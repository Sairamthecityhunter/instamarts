import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { logout, updateProfile } from '../store/slices/authSlice';
import { toast } from 'react-hot-toast';
import { FiCamera, FiUpload, FiX } from 'react-icons/fi';
import ShoppingLists from '../components/UI/ShoppingLists';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveImage = async () => {
    if (!imagePreview) return;
    
    setIsUploadingImage(true);
    try {
      // Simulate image upload API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update user avatar in Redux store
      dispatch(updateProfile({ avatar: imagePreview }));
      
      setShowImageUpload(false);
      setImagePreview(null);
      toast.success('Profile picture updated successfully!');
    } catch (error) {
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleCancelImageUpload = () => {
    setShowImageUpload(false);
    setImagePreview(null);
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      dispatch(updateProfile(formData));
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/');
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: '👤' },
    { id: 'shopping-lists', name: 'Shopping Lists', icon: '📝' },
    { id: 'preferences', name: 'Preferences', icon: '⚙️' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'subscription', name: 'Premium', icon: '⭐' },
  ];

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-green-600 hover:text-green-700 font-medium"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        <div className="flex items-center space-x-6 mb-6">
          {/* Avatar Section with Upload */}
          <div className="relative">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}
              alt={user?.name || 'User'}
              className="w-20 h-20 rounded-full object-cover border-4 border-gray-200"
            />
            <button
              onClick={() => setShowImageUpload(true)}
              className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors shadow-lg"
              title="Change profile picture"
            >
              <FiCamera className="w-4 h-4" />
            </button>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-gray-900">{user?.name}</h4>
            <p className="text-gray-600">Member since {user?.joinDate || 'January 2024'}</p>
            {user?.isInstamartPlus && (
              <span className="inline-block bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full mt-2 font-medium">
                ⭐ FreshBazaar Premium Member
              </span>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleSaveProfile}
                disabled={isLoading}
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <span className="text-sm text-gray-500">Name</span>
              <p className="text-gray-900">{user?.name}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Email</span>
              <p className="text-gray-900">{user?.email}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Phone</span>
              <p className="text-gray-900">{user?.phone}</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-2xl">📦</span>
            <h3 className="text-lg font-semibold text-gray-900">Orders</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">{user?.totalOrders || 47}</p>
          <p className="text-gray-600">Total orders placed</p>
          <button
            onClick={() => navigate('/orders')}
            className="text-green-600 hover:text-green-700 font-medium mt-2"
          >
            View Orders →
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-2xl">📍</span>
            <h3 className="text-lg font-semibold text-gray-900">Addresses</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">{user?.addresses?.length || 3}</p>
          <p className="text-gray-600">Saved delivery addresses</p>
          <button
            onClick={() => navigate('/addresses')}
            className="text-green-600 hover:text-green-700 font-medium mt-2"
          >
            Manage Addresses →
          </button>
        </div>
      </div>
    </div>
  );

  const renderShoppingListsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">My Shopping Lists</h3>
        <ShoppingLists />
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              defaultChecked={true}
              className="rounded text-green-600 focus:ring-green-500"
            />
            <span>📧 Email notifications for orders</span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              defaultChecked={false}
              className="rounded text-green-600 focus:ring-green-500"
            />
            <span>📱 SMS notifications</span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              defaultChecked={true}
              className="rounded text-green-600 focus:ring-green-500"
            />
            <span>🔔 Push notifications</span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              defaultChecked={true}
              className="rounded text-green-600 focus:ring-green-500"
            />
            <span>🎯 Promotional offers</span>
          </label>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Shopping Preferences</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Language</label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
              <option>English</option>
              <option>हिंदी (Hindi)</option>
              <option>বাংলা (Bengali)</option>
              <option>தமிழ் (Tamil)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Preferences</label>
            <div className="flex flex-wrap gap-2">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">🌱 Vegetarian</span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">🌿 Organic</span>
              <button className="text-green-600 hover:text-green-700 px-3 py-1 border border-green-300 rounded-full text-sm">
                + Add Preference
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
        <div className="space-y-4">
          <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                  🔐 Change Password
                </h4>
                <p className="text-sm text-gray-600">Update your account password</p>
              </div>
              <span className="text-green-600">→</span>
            </div>
          </button>
          <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                  🛡️ Two-Factor Authentication
                </h4>
                <p className="text-sm text-gray-600">Add an extra layer of security</p>
              </div>
              <span className="text-green-600">→</span>
            </div>
          </button>
          <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                  🕐 Login History
                </h4>
                <p className="text-sm text-gray-600">View recent login activity</p>
              </div>
              <span className="text-green-600">→</span>
            </div>
          </button>
          <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                  📱 Linked Devices
                </h4>
                <p className="text-sm text-gray-600">Manage your logged-in devices</p>
              </div>
              <span className="text-green-600">→</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderSubscriptionTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">FreshBazaar Premium</h3>
          {user?.isInstamartPlus && (
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              ⭐ Active
            </span>
          )}
        </div>
        
        {user?.isInstamartPlus ? (
          <div className="space-y-4">
            <p className="text-gray-600">You're currently subscribed to FreshBazaar Premium</p>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                🎁 Benefits you're enjoying:
              </h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• 🚚 Free delivery on all orders</li>
                <li>• ⚡ Priority customer support</li>
                <li>• 🎯 Exclusive deals and offers</li>
                <li>• 🌟 Early access to new products</li>
                <li>• 💰 Special pricing on bulk orders</li>
                <li>• 🎪 Festival season special discounts</li>
              </ul>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/premium')}
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Manage Subscription
              </button>
              <button className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                Download Invoice
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600">Upgrade to FreshBazaar Premium for exclusive benefits</p>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900 mb-2">🌟 Premium Benefits:</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Free delivery on all orders</li>
                <li>• Priority customer support</li>
                <li>• Exclusive deals and offers</li>
                <li>• Early access to new products</li>
              </ul>
            </div>
            <button
              onClick={() => navigate('/premium')}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              ⭐ Upgrade to Premium
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🏪 Seller Account</h3>
        <p className="text-gray-600 mb-4">
          Want to sell your authentic Indian products on FreshBazaar?
        </p>
        <button
          onClick={() => navigate('/post-product')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Start Selling Products
        </button>
      </div>
    </div>
  );

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Sign In</h2>
          <p className="text-gray-600 mb-4">You need to be signed in to view your account.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-3">{tab.icon}</span>
                    {tab.name}
                  </button>
                ))}
              </nav>

              <div className="border-t mt-6 pt-6">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && renderProfileTab()}
            {activeTab === 'shopping-lists' && renderShoppingListsTab()}
            {activeTab === 'preferences' && renderPreferencesTab()}
            {activeTab === 'security' && renderSecurityTab()}
            {activeTab === 'subscription' && renderSubscriptionTab()}
          </div>
        </div>
      </div>

      {/* Image Upload Modal */}
      {showImageUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Change Profile Picture</h3>
              <button
                onClick={handleCancelImageUpload}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Current Avatar */}
              <div className="text-center">
                <img
                  src={imagePreview || user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}
                  alt="Profile preview"
                  className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-gray-200"
                />
              </div>

              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Click to upload a new profile picture</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="avatar-upload"
                />
                <label
                  htmlFor="avatar-upload"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 cursor-pointer transition-colors"
                >
                  Choose Image
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  JPG, PNG or GIF. Max size 5MB.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleSaveImage}
                  disabled={!imagePreview || isUploadingImage}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isUploadingImage ? 'Uploading...' : 'Save Picture'}
                </button>
                <button
                  onClick={handleCancelImageUpload}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage; 