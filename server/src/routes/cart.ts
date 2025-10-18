import express from 'express';
import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// In-memory cart storage for demo
const carts: { [userId: string]: any } = {};

// Get user's cart
router.get('/', asyncHandler(async (req: any, res: Response) => {
  const userId = req.userId;
  const cart = carts[userId] || { items: [], totalItems: 0, totalAmount: 0 };
  
  res.json({ cart });
}));

// Add item to cart
router.post('/add', asyncHandler(async (req: any, res: Response) => {
  const userId = req.userId;
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  // Initialize cart if doesn't exist
  if (!carts[userId]) {
    carts[userId] = { items: [], totalItems: 0, totalAmount: 0 };
  }

  const cart = carts[userId];
  const existingItemIndex = cart.items.findIndex((item: any) => item.productId === productId);

  if (existingItemIndex >= 0) {
    // Update existing item
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    cart.items.push({
      productId,
      quantity,
      addedAt: new Date()
    });
  }

  // Recalculate totals (mock calculation)
  cart.totalItems = cart.items.reduce((total: number, item: any) => total + item.quantity, 0);
  cart.totalAmount = cart.items.reduce((total: number, item: any) => {
    // Mock price calculation - in production, fetch actual product prices
    const mockPrice = 50; // ₹50 per item
    return total + (mockPrice * item.quantity);
  }, 0);

  res.json({
    message: 'Item added to cart',
    cart
  });
}));

// Update item quantity
router.put('/update', asyncHandler(async (req: any, res: Response) => {
  const userId = req.userId;
  const { productId, quantity } = req.body;

  if (!productId || quantity === undefined) {
    return res.status(400).json({ error: 'Product ID and quantity are required' });
  }

  if (!carts[userId]) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  const cart = carts[userId];
  const itemIndex = cart.items.findIndex((item: any) => item.productId === productId);

  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found in cart' });
  }

  if (quantity <= 0) {
    // Remove item
    cart.items.splice(itemIndex, 1);
  } else {
    // Update quantity
    cart.items[itemIndex].quantity = quantity;
  }

  // Recalculate totals
  cart.totalItems = cart.items.reduce((total: number, item: any) => total + item.quantity, 0);
  cart.totalAmount = cart.items.reduce((total: number, item: any) => {
    const mockPrice = 50;
    return total + (mockPrice * item.quantity);
  }, 0);

  res.json({
    message: 'Cart updated',
    cart
  });
}));

// Remove item from cart
router.delete('/remove/:productId', asyncHandler(async (req: any, res: Response) => {
  const userId = req.userId;
  const { productId } = req.params;

  if (!carts[userId]) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  const cart = carts[userId];
  cart.items = cart.items.filter((item: any) => item.productId !== productId);

  // Recalculate totals
  cart.totalItems = cart.items.reduce((total: number, item: any) => total + item.quantity, 0);
  cart.totalAmount = cart.items.reduce((total: number, item: any) => {
    const mockPrice = 50;
    return total + (mockPrice * item.quantity);
  }, 0);

  res.json({
    message: 'Item removed from cart',
    cart
  });
}));

// Clear cart
router.delete('/clear', asyncHandler(async (req: any, res: Response) => {
  const userId = req.userId;
  
  carts[userId] = { items: [], totalItems: 0, totalAmount: 0 };
  
  res.json({
    message: 'Cart cleared',
    cart: carts[userId]
  });
}));

export default router; 