import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { loadOrders, updateOrderStatus } from '../store/slices/ordersSlice';
import { toast } from 'react-hot-toast';

interface OrderStatus {
  id: string;
  status: 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  isCompleted: boolean;
}

const OrderTrackingPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orders } = useSelector((state: RootState) => state.orders);
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    // Load orders from localStorage
    dispatch(loadOrders());
  }, [dispatch]);

  useEffect(() => {
    if (orders.length > 0 && orderId) {
      const order = orders.find(o => o.id === orderId);
      if (order) {
        setCurrentOrder(order);
        setCurrentStep(getStepFromStatus(order.status));
      } else {
        toast.error('Order not found');
        navigate('/orders');
      }
      setIsLoading(false);
    }
  }, [orders, orderId, navigate]);

  const getStepFromStatus = (status: string): number => {
    switch (status) {
      case 'confirmed': return 0;
      case 'preparing': return 1;
      case 'out_for_delivery': return 2;
      case 'delivered': return 3;
      case 'cancelled': return -1;
      default: return 0;
    }
  };

  const getOrderStatuses = (orderStatus: string): OrderStatus[] => {
    const baseStatuses = [
      {
        id: '1',
        status: 'confirmed' as const,
        title: 'Order Confirmed',
        description: 'Your order has been confirmed and is being prepared',
        timestamp: formatOrderTime(currentOrder?.orderDate),
        icon: '✅',
        isCompleted: true,
      },
      {
        id: '2',
        status: 'preparing' as const,
        title: 'Preparing Your Order',
        description: 'Our team is carefully preparing your items',
        timestamp: getEstimatedTime(currentOrder?.orderDate, 10),
        icon: '👨‍🍳',
        isCompleted: ['preparing', 'out_for_delivery', 'delivered'].includes(orderStatus),
      },
      {
        id: '3',
        status: 'out_for_delivery' as const,
        title: 'Out for Delivery',
        description: 'Your order is on its way to you',
        timestamp: getEstimatedTime(currentOrder?.orderDate, 20),
        icon: '🚚',
        isCompleted: ['out_for_delivery', 'delivered'].includes(orderStatus),
      },
      {
        id: '4',
        status: 'delivered' as const,
        title: 'Delivered',
        description: 'Your order has been delivered successfully',
        timestamp: currentOrder?.deliveryDate ? formatOrderTime(currentOrder.deliveryDate) : getEstimatedTime(currentOrder?.orderDate, 30),
        icon: '🎉',
        isCompleted: orderStatus === 'delivered',
      },
    ];

    if (orderStatus === 'cancelled') {
      return [
        baseStatuses[0],
        {
          id: '2',
          status: 'cancelled' as const,
          title: 'Order Cancelled',
          description: 'Your order has been cancelled',
          timestamp: formatOrderTime(new Date().toISOString()),
          icon: '❌',
          isCompleted: true,
        },
      ];
    }

    return baseStatuses;
  };

  const formatOrderTime = (dateString: string): string => {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getEstimatedTime = (orderDate: string, addMinutes: number): string => {
    const date = new Date(orderDate);
    date.setMinutes(date.getMinutes() + addMinutes);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const canCancelOrder = (status: string): boolean => {
    return ['confirmed', 'preparing'].includes(status);
  };

  const handleCancelOrder = async () => {
    if (!currentOrder) return;
    
    try {
      setIsCancelling(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update order status to cancelled
      dispatch(updateOrderStatus({ orderId: currentOrder.id, status: 'cancelled' }));
      
      toast.success('Order cancelled successfully');
      
      // Update current order state
      setCurrentOrder({ ...currentOrder, status: 'cancelled' });
      setCurrentStep(-1);
      
    } catch (error) {
      toast.error('Failed to cancel order. Please try again.');
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <button
            onClick={() => navigate('/orders')}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            View All Orders
          </button>
        </div>
      </div>
    );
  }

  const orderStatuses = getOrderStatuses(currentOrder.status);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/orders')}
            className="text-green-600 hover:text-green-800 mb-4 flex items-center"
          >
            ← Back to Orders
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Track Order #{currentOrder.id}</h1>
          <p className="text-gray-600">Placed on {new Date(currentOrder.orderDate).toLocaleDateString('en-IN')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Progress */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Progress</h2>
              
              <div className="space-y-6">
                {orderStatuses.map((status, index) => (
                  <div key={status.id} className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                      status.isCompleted 
                        ? currentOrder.status === 'cancelled' && status.status === 'cancelled'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {status.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-medium ${
                          status.isCompleted ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {status.title}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {status.timestamp}
                        </span>
                      </div>
                      <p className={`text-sm mt-1 ${
                        status.isCompleted ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {status.description}
                      </p>
                      {index < orderStatuses.length - 1 && currentOrder.status !== 'cancelled' && (
                        <div className={`w-px h-6 mt-4 ml-6 ${
                          status.isCompleted ? 'bg-green-200' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Cancel Order Button */}
              {canCancelOrder(currentOrder.status) && (
                <div className="mt-8 pt-6 border-t">
                  <button
                    onClick={handleCancelOrder}
                    disabled={isCancelling}
                    className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCancelling ? 'Cancelling...' : 'Cancel Order'}
                  </button>
                  <p className="text-sm text-gray-500 mt-2">
                    You can cancel this order while it's being prepared
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Order Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Details</h2>
              
              {/* Store Info */}
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={currentOrder.storeImage}
                  alt={currentOrder.storeName}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-medium text-gray-900">{currentOrder.storeName}</h3>
                  <p className="text-sm text-gray-600">Store</p>
                </div>
              </div>

              {/* Items */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Items ({currentOrder.items.length})</h4>
                <div className="space-y-2">
                  {currentOrder.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.quantity}x {item.name}</span>
                      <span className="text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>₹{currentOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="mt-6 pt-4 border-t">
                <h4 className="font-medium text-gray-900 mb-2">Delivery Address</h4>
                <p className="text-sm text-gray-600">{currentOrder.deliveryAddress}</p>
              </div>

              {/* Payment Method */}
              <div className="mt-4">
                <h4 className="font-medium text-gray-900 mb-1">Payment Method</h4>
                <p className="text-sm text-gray-600">{currentOrder.paymentMethod}</p>
              </div>

              {/* Delivery Instructions */}
              {currentOrder.deliveryInstructions && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-1">Delivery Instructions</h4>
                  <p className="text-sm text-gray-600">{currentOrder.deliveryInstructions}</p>
                </div>
              )}

              {/* Contact Support */}
              <div className="mt-6 pt-4 border-t">
                <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage; 