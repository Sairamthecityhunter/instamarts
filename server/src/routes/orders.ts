import express from 'express';
import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// In-memory order storage for demo
const orders: any[] = [];

// Create new order
router.post('/', asyncHandler(async (req: any, res: Response) => {
  const userId = req.userId;
  const { 
    items, 
    deliveryAddress, 
    paymentMethod, 
    totalAmount,
    deliverySlot,
    specialInstructions 
  } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Order items are required' });
  }

  if (!deliveryAddress) {
    return res.status(400).json({ error: 'Delivery address is required' });
  }

  // Generate order ID
  const orderId = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;

  const newOrder = {
    id: orderId,
    userId,
    items,
    deliveryAddress,
    paymentMethod: paymentMethod || 'cash_on_delivery',
    totalAmount: totalAmount || 0,
    deliverySlot: deliverySlot || 'asap',
    specialInstructions: specialInstructions || '',
    status: 'placed',
    estimatedDeliveryTime: 20, // minutes
    tracking: {
      placed: new Date(),
      confirmed: null,
      packed: null,
      outForDelivery: null,
      delivered: null
    },
    createdAt: new Date(),
    updatedAt: new Date()
  };

  orders.push(newOrder);

  // Mock order progression
  setTimeout(() => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = 'confirmed';
      order.tracking.confirmed = new Date();
      // Emit socket event in real implementation
    }
  }, 5000); // 5 seconds

  res.status(201).json({
    message: 'Order placed successfully',
    order: newOrder
  });
}));

// Get user's orders
router.get('/', asyncHandler(async (req: any, res: Response) => {
  const userId = req.userId;
  const { page = 1, limit = 10, status } = req.query;

  let userOrders = orders.filter(order => order.userId === userId);

  // Filter by status if provided
  if (status) {
    userOrders = userOrders.filter(order => order.status === status);
  }

  // Sort by creation date (newest first)
  userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Pagination
  const startIndex = (Number(page) - 1) * Number(limit);
  const endIndex = startIndex + Number(limit);
  const paginatedOrders = userOrders.slice(startIndex, endIndex);

  res.json({
    orders: paginatedOrders,
    pagination: {
      current: Number(page),
      limit: Number(limit),
      total: userOrders.length,
      pages: Math.ceil(userOrders.length / Number(limit))
    }
  });
}));

// Get specific order
router.get('/:orderId', asyncHandler(async (req: any, res: Response) => {
  const userId = req.userId;
  const { orderId } = req.params;

  const order = orders.find(o => o.id === orderId && o.userId === userId);

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  res.json({ order });
}));

// Track order (public endpoint with order ID)
router.get('/track/:orderId', asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.params;

  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  // Return only tracking information (no sensitive data)
  const trackingInfo = {
    orderId: order.id,
    status: order.status,
    estimatedDeliveryTime: order.estimatedDeliveryTime,
    tracking: order.tracking,
    items: order.items.map((item: any) => ({
      name: item.name || 'Product',
      quantity: item.quantity
    }))
  };

  res.json({ tracking: trackingInfo });
}));

// Cancel order
router.post('/:orderId/cancel', asyncHandler(async (req: any, res: Response) => {
  const userId = req.userId;
  const { orderId } = req.params;
  const { reason } = req.body;

  const orderIndex = orders.findIndex(o => o.id === orderId && o.userId === userId);

  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const order = orders[orderIndex];

  // Check if order can be cancelled
  if (['delivered', 'cancelled'].includes(order.status)) {
    return res.status(400).json({ error: 'Order cannot be cancelled' });
  }

  // Update order status
  order.status = 'cancelled';
  order.cancellationReason = reason || 'User cancellation';
  order.cancelledAt = new Date();
  order.updatedAt = new Date();

  res.json({
    message: 'Order cancelled successfully',
    order
  });
}));

// Reorder (create new order with same items)
router.post('/:orderId/reorder', asyncHandler(async (req: any, res: Response) => {
  const userId = req.userId;
  const { orderId } = req.params;

  const originalOrder = orders.find(o => o.id === orderId && o.userId === userId);

  if (!originalOrder) {
    return res.status(404).json({ error: 'Original order not found' });
  }

  // Create new order with same items
  const newOrderId = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;

  const reorder = {
    id: newOrderId,
    userId,
    items: originalOrder.items,
    deliveryAddress: originalOrder.deliveryAddress,
    paymentMethod: originalOrder.paymentMethod,
    totalAmount: originalOrder.totalAmount,
    deliverySlot: 'asap',
    specialInstructions: '',
    status: 'placed',
    estimatedDeliveryTime: 20,
    tracking: {
      placed: new Date(),
      confirmed: null,
      packed: null,
      outForDelivery: null,
      delivered: null
    },
    isReorder: true,
    originalOrderId: orderId,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  orders.push(reorder);

  res.status(201).json({
    message: 'Reorder placed successfully',
    order: reorder
  });
}));

// Get order analytics (for internal use)
router.get('/analytics/summary', asyncHandler(async (req: any, res: Response) => {
  const userId = req.userId;
  const userOrders = orders.filter(order => order.userId === userId);

  const analytics = {
    totalOrders: userOrders.length,
    totalSpent: userOrders.reduce((sum, order) => sum + order.totalAmount, 0),
    averageOrderValue: userOrders.length > 0 ? 
      userOrders.reduce((sum, order) => sum + order.totalAmount, 0) / userOrders.length : 0,
    ordersByStatus: {
      placed: userOrders.filter(o => o.status === 'placed').length,
      confirmed: userOrders.filter(o => o.status === 'confirmed').length,
      packed: userOrders.filter(o => o.status === 'packed').length,
      outForDelivery: userOrders.filter(o => o.status === 'outForDelivery').length,
      delivered: userOrders.filter(o => o.status === 'delivered').length,
      cancelled: userOrders.filter(o => o.status === 'cancelled').length
    },
    frequentlyOrderedItems: [] // Would calculate from order history
  };

  res.json({ analytics });
}));

export default router; 