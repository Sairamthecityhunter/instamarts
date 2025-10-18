import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { toast } from 'react-hot-toast';
import { 
  FiUsers, 
  FiPlus, 
  FiShare2, 
  FiCopy, 
  FiCheck,
  FiClock,
  FiDollarSign,
  FiTruck,
  FiUser,
  FiShoppingCart,
  FiPercent
} from 'react-icons/fi';

interface GroupOrder {
  id: string;
  name: string;
  organizer: {
    id: string;
    name: string;
    avatar: string;
  };
  participants: {
    id: string;
    name: string;
    avatar: string;
    orderValue: number;
    items: number;
    hasPaid: boolean;
  }[];
  minOrder: number;
  currentTotal: number;
  deadline: string;
  deliveryAddress: string;
  status: 'active' | 'completed' | 'expired';
  savings: number;
  maxParticipants: number;
  category: string;
}

interface CreateGroupOrderForm {
  name: string;
  minOrder: number;
  deadline: string;
  deliveryAddress: string;
  maxParticipants: number;
  category: string;
  description: string;
}

const GroupOrderPage: React.FC = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [groupOrders, setGroupOrders] = useState<GroupOrder[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<GroupOrder | null>(null);
  const [createForm, setCreateForm] = useState<CreateGroupOrderForm>({
    name: '',
    minOrder: 500,
    deadline: '',
    deliveryAddress: '',
    maxParticipants: 10,
    category: 'general',
    description: ''
  });
  const [loading, setLoading] = useState(true);
  const [shareLink, setShareLink] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    loadGroupOrders();
  }, []);

  const loadGroupOrders = async () => {
    try {
      // Mock group orders
      const mockOrders: GroupOrder[] = [
        {
          id: '1',
          name: 'Building A Grocery Run',
          organizer: {
            id: 'user1',
            name: 'Priya Sharma',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150'
          },
          participants: [
            {
              id: 'user1',
              name: 'Priya Sharma',
              avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150',
              orderValue: 450,
              items: 12,
              hasPaid: true
            },
            {
              id: 'user2',
              name: 'Rahul Gupta',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
              orderValue: 320,
              items: 8,
              hasPaid: true
            },
            {
              id: 'user3',
              name: 'Sneha Patel',
              avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
              orderValue: 280,
              items: 6,
              hasPaid: false
            }
          ],
          minOrder: 1000,
          currentTotal: 1050,
          deadline: '2024-01-15T18:00:00',
          deliveryAddress: 'Prestige Apartments, Whitefield, Bangalore',
          status: 'active',
          savings: 85,
          maxParticipants: 8,
          category: 'groceries'
        },
        {
          id: '2',
          name: 'Office Snacks Order',
          organizer: {
            id: 'user4',
            name: 'Amit Kumar',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
          },
          participants: [
            {
              id: 'user4',
              name: 'Amit Kumar',
              avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
              orderValue: 180,
              items: 5,
              hasPaid: true
            },
            {
              id: 'user5',
              name: 'Kavya Reddy',
              avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150',
              orderValue: 220,
              items: 7,
              hasPaid: true
            }
          ],
          minOrder: 800,
          currentTotal: 400,
          deadline: '2024-01-15T15:00:00',
          deliveryAddress: 'TechPark Building, Electronic City, Bangalore',
          status: 'active',
          savings: 45,
          maxParticipants: 12,
          category: 'snacks'
        }
      ];
      setGroupOrders(mockOrders);
    } catch (error) {
      console.error('Error loading group orders:', error);
      toast.error('Failed to load group orders');
    } finally {
      setLoading(false);
    }
  };

  const createGroupOrder = async () => {
    try {
      const newOrder: GroupOrder = {
        id: Date.now().toString(),
        name: createForm.name,
        organizer: {
          id: user?.id || 'current-user',
          name: user?.name || 'Current User',
          avatar: user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
        },
        participants: [{
          id: user?.id || 'current-user',
          name: user?.name || 'Current User',
          avatar: user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
          orderValue: 0,
          items: 0,
          hasPaid: false
        }],
        minOrder: createForm.minOrder,
        currentTotal: 0,
        deadline: createForm.deadline,
        deliveryAddress: createForm.deliveryAddress,
        status: 'active',
        savings: 0,
        maxParticipants: createForm.maxParticipants,
        category: createForm.category
      };

      setGroupOrders(prev => [...prev, newOrder]);
      setShowCreateModal(false);
      
      // Generate share link
      const link = `${window.location.origin}/group-order/join/${newOrder.id}`;
      setShareLink(link);
      setShowShareModal(true);
      
      toast.success('Group order created successfully!');
    } catch (error) {
      toast.error('Failed to create group order');
    }
  };

  const joinGroupOrder = (orderId: string) => {
    setGroupOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const newParticipant = {
          id: user?.id || 'current-user',
          name: user?.name || 'Current User',
          avatar: user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
          orderValue: 0,
          items: 0,
          hasPaid: false
        };
        return {
          ...order,
          participants: [...order.participants, newParticipant]
        };
      }
      return order;
    }));
    toast.success('Joined group order successfully!');
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast.success('Share link copied to clipboard!');
  };

  const formatTimeRemaining = (deadline: string) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m left`;
    }
    return `${minutes}m left`;
  };

  const getProgressPercentage = (current: number, min: number) => {
    return Math.min((current / min) * 100, 100);
  };

  const categories = [
    { id: 'general', name: 'General', icon: '🛒' },
    { id: 'groceries', name: 'Groceries', icon: '🥬' },
    { id: 'snacks', name: 'Snacks', icon: '🍿' },
    { id: 'electronics', name: 'Electronics', icon: '📱' },
    { id: 'household', name: 'Household', icon: '🏠' },
    { id: 'personal-care', name: 'Personal Care', icon: '🧴' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Group Orders</h1>
            <p className="text-gray-600 mt-2">Save money by ordering together with your community</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <FiPlus className="h-5 w-5" />
            Create Group Order
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiUsers className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {groupOrders.reduce((total, order) => total + order.participants.length, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Participants</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiDollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  ₹{groupOrders.reduce((total, order) => total + order.savings, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Savings</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FiShoppingCart className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {groupOrders.filter(order => order.status === 'active').length}
                </div>
                <div className="text-sm text-gray-600">Active Orders</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiPercent className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">15%</div>
                <div className="text-sm text-gray-600">Avg Savings</div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Group Orders */}
        <div className="grid lg:grid-cols-2 gap-6">
          {groupOrders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{order.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <img
                      src={order.organizer.avatar}
                      alt={order.organizer.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm text-gray-600">by {order.organizer.name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === 'active' 
                      ? 'bg-green-100 text-green-700'
                      : order.status === 'completed'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {order.status}
                  </span>
                  <button
                    onClick={() => {
                      const link = `${window.location.origin}/group-order/join/${order.id}`;
                      setShareLink(link);
                      setShowShareModal(true);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600"
                    title="Share"
                  >
                    <FiShare2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Progress to minimum order</span>
                  <span className="text-sm font-medium text-gray-900">
                    ₹{order.currentTotal} / ₹{order.minOrder}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage(order.currentTotal, order.minOrder)}%` }}
                  ></div>
                </div>
              </div>

              {/* Participants */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-900">
                    Participants ({order.participants.length}/{order.maxParticipants})
                  </span>
                </div>
                <div className="space-y-2">
                  {order.participants.slice(0, 3).map(participant => (
                    <div key={participant.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={participant.avatar}
                          alt={participant.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{participant.name}</div>
                          <div className="text-xs text-gray-500">
                            {participant.items} items • ₹{participant.orderValue}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {participant.hasPaid ? (
                          <span className="text-green-600">
                            <FiCheck className="h-4 w-4" />
                          </span>
                        ) : (
                          <span className="text-yellow-600">
                            <FiClock className="h-4 w-4" />
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {order.participants.length > 3 && (
                    <div className="text-sm text-gray-500 text-center">
                      +{order.participants.length - 3} more participants
                    </div>
                  )}
                </div>
              </div>

              {/* Order Details */}
              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Time remaining</div>
                    <div className="font-medium text-gray-900">{formatTimeRemaining(order.deadline)}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Potential savings</div>
                    <div className="font-medium text-green-600">₹{order.savings}</div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-gray-600 text-sm">Delivery address</div>
                  <div className="text-sm text-gray-900">{order.deliveryAddress}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4">
                {order.participants.some(p => p.id === user?.id) ? (
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    View Order
                  </button>
                ) : (
                  <button
                    onClick={() => joinGroupOrder(order.id)}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Join Order
                  </button>
                )}
                <button
                  onClick={() => {
                    const link = `${window.location.origin}/group-order/join/${order.id}`;
                    setShareLink(link);
                    setShowShareModal(true);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FiShare2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {groupOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">👥</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No group orders yet</h3>
            <p className="text-gray-600 mb-4">Create your first group order to start saving with friends</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
              Create Group Order
            </button>
          </div>
        )}
      </div>

      {/* Create Group Order Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Create Group Order</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Name</label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Office Lunch Order"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order</label>
                  <input
                    type="number"
                    value={createForm.minOrder}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, minOrder: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Participants</label>
                  <input
                    type="number"
                    value={createForm.maxParticipants}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                <input
                  type="datetime-local"
                  value={createForm.deadline}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, deadline: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                <textarea
                  value={createForm.deliveryAddress}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, deliveryAddress: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  rows={3}
                  placeholder="Enter the delivery address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={createForm.category}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={createGroupOrder}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Create Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Share Group Order</h3>
            <p className="text-gray-600 mb-4">
              Share this link with friends to let them join your group order
            </p>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
              <button
                onClick={copyShareLink}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <FiCopy className="h-4 w-4" />
              </button>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowShareModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'Join our group order!',
                      text: 'Save money by joining our group order on Instamart',
                      url: shareLink
                    });
                  }
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Share via Apps
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupOrderPage;
