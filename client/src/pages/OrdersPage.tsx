import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { loadOrders, updateOrderStatus, deleteOrder } from '../store/slices/ordersSlice';
import { addToCart } from '../store/slices/cartSlice';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const OrdersPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, isLoading } = useSelector((state: RootState) => state.orders);
  const [filter, setFilter] = useState<'all' | 'delivered' | 'cancelled' | 'in_progress' | 'confirmed' | 'preparing' | 'out_for_delivery'>('all');
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [reorderingOrderId, setReorderingOrderId] = useState<string | null>(null);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);

  useEffect(() => {
    // Load orders from localStorage on component mount
    dispatch(loadOrders());
  }, [dispatch]);

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    if (filter === 'in_progress') {
      return ['confirmed', 'preparing', 'out_for_delivery', 'in_progress'].includes(order.status);
    }
    return order.status === filter;
  });

  const handleCancelOrder = async (orderId: string) => {
    try {
      setCancellingOrderId(orderId);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update order status to cancelled
      dispatch(updateOrderStatus({ orderId, status: 'cancelled' }));
      
      toast.success('Order cancelled successfully');
    } catch (error) {
      toast.error('Failed to cancel order. Please try again.');
    } finally {
      setCancellingOrderId(null);
    }
  };

  const handleReorder = async (order: any) => {
    try {
      setReorderingOrderId(order.id);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Add each item from the order to the cart
      order.items.forEach((item: any) => {
        const product = {
          id: item.id,
          name: item.name,
          description: `Reordered from ${order.storeName}`,
          price: item.price,
          image: item.image,
          category: 'grocery',
          brand: order.storeName,
          unit: '1 unit',
          inStock: true,
          rating: 4.5,
          reviewCount: 100,
          tags: ['reorder']
        };
        
        dispatch(addToCart({ product, quantity: item.quantity }));
      });
      
      toast.success(`${order.items.length} items added to cart!`);
      
      // Navigate to cart page
      setTimeout(() => {
        navigate('/cart');
      }, 1000);
      
    } catch (error) {
      toast.error('Failed to reorder. Please try again.');
    } finally {
      setReorderingOrderId(null);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this order? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingOrderId(orderId);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Delete order from Redux store and localStorage
      dispatch(deleteOrder(orderId));
      
      toast.success('Order deleted successfully');
    } catch (error) {
      toast.error('Failed to delete order. Please try again.');
    } finally {
      setDeletingOrderId(null);
    }
  };

  const canCancelOrder = (status: string) => {
    return ['confirmed', 'preparing'].includes(status);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      case 'confirmed':
        return 'text-blue-600 bg-blue-100';
      case 'preparing':
        return 'text-orange-600 bg-orange-100';
      case 'out_for_delivery':
        return 'text-purple-600 bg-purple-100';
      case 'in_progress':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      case 'confirmed':
        return 'Confirmed';
      case 'preparing':
        return 'Preparing';
      case 'out_for_delivery':
        return 'Out for Delivery';
      case 'in_progress':
        return 'In Progress';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">My Orders</h1>
          <p className="text-gray-600">Track your order history and reorder your favorites</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex space-x-4 overflow-x-auto">
            {[
              { key: 'all', label: 'All Orders' },
              { key: 'in_progress', label: 'Active Orders' },
              { key: 'delivered', label: 'Delivered' },
              { key: 'cancelled', label: 'Cancelled' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as any)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                  filter === tab.key
                    ? 'bg-green-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex gap-4">
                <img
                  src={order.storeImage}
                  alt={order.storeName}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {order.storeName}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Order #{order.id} • {formatDate(order.orderDate)}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {order.deliveryAddress}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Payment: {order.paymentMethod}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                      <p className="text-lg font-semibold text-gray-800 mt-1">
                        ₹{order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-800 mb-2">Items Ordered:</h4>
                    <div className="space-y-1">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm text-gray-600">
                          <span>{item.quantity}x {item.name}</span>
                          <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Instructions */}
                  {order.deliveryInstructions && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-800 mb-1">Delivery Instructions:</h4>
                      <p className="text-sm text-gray-600">{order.deliveryInstructions}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 flex-wrap">
                    <Link
                      to={`/track-order/${order.id}`}
                      className="px-4 py-2 border border-green-500 text-green-500 rounded-lg hover:bg-green-50 transition-colors"
                    >
                      Track Order
                    </Link>
                    
                    <button 
                      onClick={() => handleReorder(order)}
                      disabled={reorderingOrderId === order.id}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {reorderingOrderId === order.id ? 'Adding to Cart...' : 'Reorder'}
                    </button>
                    
                    {canCancelOrder(order.status) && (
                      <button 
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={cancellingOrderId === order.id}
                        className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {cancellingOrderId === order.id ? 'Cancelling...' : 'Cancel Order'}
                      </button>
                    )}
                    
                    {order.status === 'cancelled' && (
                      <button 
                        onClick={() => handleDeleteOrder(order.id)}
                        disabled={deletingOrderId === order.id}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingOrderId === order.id ? '🗑️ Deleting...' : '🗑️ Delete Order'}
                      </button>
                    )}
                    
                    {order.status === 'delivered' && (
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        Rate & Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📦</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                No orders found
              </h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? "You haven't placed any orders yet"
                  : `No ${filter} orders found`
                }
              </p>
              {filter === 'all' && (
                <Link
                  to="/"
                  className="inline-block mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Start Ordering
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage; 