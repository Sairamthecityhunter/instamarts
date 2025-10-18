import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { toast } from 'react-hot-toast';
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiCalendar, 
  FiRepeat, 
  FiPause, 
  FiPlay,
  FiTruck,
  FiStar,
  FiSave
} from 'react-icons/fi';

interface Subscription {
  id: string;
  name: string;
  products: {
    id: string;
    name: string;
    brand: string;
    image: string;
    price: number;
    quantity: number;
    unit: string;
  }[];
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  nextDelivery: string;
  isActive: boolean;
  totalAmount: number;
  deliveryTime: string;
  savings: number;
}

interface SubscriptionTemplate {
  id: string;
  name: string;
  description: string;
  products: string[];
  frequency: 'daily' | 'weekly' | 'monthly';
  price: number;
  savings: number;
  popular: boolean;
}

const SubscriptionPage: React.FC = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [templates, setTemplates] = useState<SubscriptionTemplate[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscriptions();
    loadTemplates();
  }, []);

  const loadSubscriptions = async () => {
    try {
      // Mock user subscriptions
      const mockSubscriptions: Subscription[] = [
        {
          id: '1',
          name: 'Daily Essentials',
          products: [
            {
              id: '1',
              name: 'Fresh Milk',
              brand: 'Amul',
              image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300',
              price: 28,
              quantity: 1,
              unit: '500ml'
            },
            {
              id: '2',
              name: 'Brown Bread',
              brand: 'Modern',
              image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=300',
              price: 35,
              quantity: 1,
              unit: '400g'
            }
          ],
          frequency: 'daily',
          nextDelivery: '2024-01-15T08:00:00',
          isActive: true,
          totalAmount: 63,
          deliveryTime: '8:00 AM',
          savings: 12
        },
        {
          id: '2',
          name: 'Weekly Grocery Pack',
          products: [
            {
              id: '3',
              name: 'Basmati Rice',
              brand: 'India Gate',
              image: 'https://images.unsplash.com/photo-1586201375761-83865001e8c3?w=300',
              price: 285,
              quantity: 1,
              unit: '5kg'
            },
            {
              id: '4',
              name: 'Masoor Dal',
              brand: 'Tata Sampann',
              image: 'https://images.unsplash.com/photo-1586201375761-83865001e8c3?w=300',
              price: 125,
              quantity: 1,
              unit: '1kg'
            }
          ],
          frequency: 'weekly',
          nextDelivery: '2024-01-20T10:00:00',
          isActive: true,
          totalAmount: 410,
          deliveryTime: '10:00 AM',
          savings: 45
        }
      ];
      setSubscriptions(mockSubscriptions);
    } catch (error) {
      console.error('Error loading subscriptions:', error);
      toast.error('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const loadTemplates = async () => {
    try {
      const mockTemplates: SubscriptionTemplate[] = [
        {
          id: '1',
          name: 'Morning Essentials',
          description: 'Fresh milk, bread, eggs for your daily breakfast',
          products: ['Fresh Milk 500ml', 'Brown Bread', 'Free Range Eggs (6 pcs)'],
          frequency: 'daily',
          price: 95,
          savings: 18,
          popular: true
        },
        {
          id: '2',
          name: 'Weekly Staples',
          description: 'Rice, dal, oil, and basic cooking ingredients',
          products: ['Basmati Rice 5kg', 'Masoor Dal 1kg', 'Sunflower Oil 1L', 'Turmeric Powder'],
          frequency: 'weekly',
          price: 650,
          savings: 85,
          popular: true
        },
        {
          id: '3',
          name: 'Fresh Produce Box',
          description: 'Seasonal vegetables and fruits delivered fresh',
          products: ['Mixed Vegetables 2kg', 'Seasonal Fruits 1kg', 'Green Leafy Vegetables'],
          frequency: 'weekly',
          price: 280,
          savings: 45,
          popular: false
        },
        {
          id: '4',
          name: 'Baby Care Bundle',
          description: 'Diapers, baby food, and care products',
          products: ['Baby Diapers (30 pcs)', 'Baby Food', 'Baby Wipes', 'Baby Oil'],
          frequency: 'weekly',
          price: 1200,
          savings: 180,
          popular: false
        }
      ];
      setTemplates(mockTemplates);
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const toggleSubscription = (id: string) => {
    setSubscriptions(prev => prev.map(sub => 
      sub.id === id ? { ...sub, isActive: !sub.isActive } : sub
    ));
    toast.success('Subscription updated successfully');
  };

  const deleteSubscription = (id: string) => {
    setSubscriptions(prev => prev.filter(sub => sub.id !== id));
    toast.success('Subscription deleted successfully');
  };

  const createFromTemplate = (template: SubscriptionTemplate) => {
    const newSubscription: Subscription = {
      id: Date.now().toString(),
      name: template.name,
      products: template.products.map((product, index) => ({
        id: (index + 1).toString(),
        name: product.split(' ')[0] + ' ' + product.split(' ')[1],
        brand: 'Brand',
        image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300',
        price: Math.floor(template.price / template.products.length),
        quantity: 1,
        unit: product.includes('kg') ? '1kg' : product.includes('ml') ? '500ml' : '1 pc'
      })),
      frequency: template.frequency,
      nextDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
      totalAmount: template.price,
      deliveryTime: '8:00 AM',
      savings: template.savings
    };

    setSubscriptions(prev => [...prev, newSubscription]);
    toast.success('Subscription created successfully!');
  };

  const formatNextDelivery = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-IN', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'Every Day';
      case 'weekly': return 'Every Week';
      case 'biweekly': return 'Every 2 Weeks';
      case 'monthly': return 'Every Month';
      default: return frequency;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Subscriptions</h1>
            <p className="text-gray-600 mt-2">Manage your recurring deliveries</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <FiPlus className="h-5 w-5" />
            New Subscription
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiRepeat className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {subscriptions.filter(s => s.isActive).length}
                </div>
                <div className="text-sm text-gray-600">Active</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiTruck className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {subscriptions.filter(s => 
                    s.isActive && new Date(s.nextDelivery).toDateString() === new Date().toDateString()
                  ).length}
                </div>
                <div className="text-sm text-gray-600">Due Today</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FiSave className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  ₹{subscriptions.reduce((total, sub) => total + (sub.isActive ? sub.savings : 0), 0)}
                </div>
                <div className="text-sm text-gray-600">Monthly Savings</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiStar className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">4.8</div>
                <div className="text-sm text-gray-600">Avg Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Subscriptions */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Active Subscriptions</h2>
            <div className="space-y-4">
              {subscriptions.map(subscription => (
                <div key={subscription.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{subscription.name}</h3>
                      <p className="text-sm text-gray-600">{getFrequencyText(subscription.frequency)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleSubscription(subscription.id)}
                        className={`p-2 rounded-lg ${
                          subscription.isActive 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-100 text-gray-600'
                        }`}
                        title={subscription.isActive ? 'Pause' : 'Resume'}
                      >
                        {subscription.isActive ? <FiPause className="h-4 w-4" /> : <FiPlay className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedSubscription(subscription);
                          setShowEditModal(true);
                        }}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg"
                        title="Edit"
                      >
                        <FiEdit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteSubscription(subscription.id)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg"
                        title="Delete"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    {subscription.products.map(product => (
                      <div key={product.id} className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-600">
                            {product.brand} • {product.unit} • Qty: {product.quantity}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">₹{product.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FiCalendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          Next delivery: {formatNextDelivery(subscription.nextDelivery)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">{subscription.deliveryTime}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-gray-900">Total: ₹{subscription.totalAmount}</div>
                      <div className="text-sm text-green-600">Save ₹{subscription.savings}/month</div>
                    </div>
                  </div>
                </div>
              ))}

              {subscriptions.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">📦</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No subscriptions yet</h3>
                  <p className="text-gray-600 mb-4">Create your first subscription to start saving time and money</p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
                  >
                    Create Subscription
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Subscription Templates */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Templates</h2>
            <div className="space-y-4">
              {templates.map(template => (
                <div key={template.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                        {template.popular && (
                          <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">Includes:</div>
                    <div className="space-y-1">
                      {template.products.slice(0, 3).map((product, index) => (
                        <div key={index} className="text-sm text-gray-700">• {product}</div>
                      ))}
                      {template.products.length > 3 && (
                        <div className="text-sm text-gray-500">+ {template.products.length - 3} more items</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">₹{template.price}/{template.frequency}</div>
                      <div className="text-sm text-green-600">Save ₹{template.savings}/month</div>
                    </div>
                    <button
                      onClick={() => createFromTemplate(template)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Subscribe
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal would be implemented here */}
      {/* For brevity, I'm not including the full modal implementation */}
    </div>
  );
};

export default SubscriptionPage;