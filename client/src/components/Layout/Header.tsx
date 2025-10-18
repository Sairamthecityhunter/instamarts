import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FiSearch, 
  FiMapPin, 
  FiShoppingCart, 
  FiUser, 
  FiMenu,
  FiClock 
} from 'react-icons/fi';
import { RootState } from '../../store/store';
import { showAuthModal, logout } from '../../store/slices/authSlice';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { toast } from 'react-hot-toast';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { totalItems } = useSelector((state: RootState) => state.cart);
  const { deliveryInfo } = useSelector((state: RootState) => state.ui);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleAuthClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      dispatch(showAuthModal('login'));
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    setShowUserMenu(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Menu */}
          <div className="flex items-center">
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <FiMenu className="h-6 w-6" />
            </button>
            
            <Link to="/" className="flex items-center ml-2 lg:ml-0">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-green-600">🛒</span>
                <span className="ml-2 text-xl font-bold text-gray-900">FreshBazaar</span>
                <span className="ml-2 text-lg">🇮🇳</span>
              </div>
            </Link>
          </div>

          {/* Delivery Info */}
          <div className="hidden md:flex items-center text-sm text-gray-600 ml-8">
            <FiMapPin className="h-4 w-4 mr-1" />
            <span className="mr-4 max-w-xs truncate">
              {deliveryInfo.address || 'Select delivery location'}
            </span>
            
            <FiClock className="h-4 w-4 mr-1" />
            <span className="font-medium text-green-600">
              {deliveryInfo.estimatedTime} mins
            </span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-4">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for groceries, spices, staples..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-600 hover:text-gray-900"
            >
              <FiShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Quick Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link 
                to="/instamart" 
                className="text-green-600 hover:text-green-700 transition-colors font-medium flex items-center gap-1"
              >
                ⚡ Instamart
              </Link>
              <Link 
                to="/stores" 
                className="text-gray-700 hover:text-green-600 transition-colors font-medium"
              >
                Stores
              </Link>
              <Link 
                to="/groceries" 
                className="text-gray-700 hover:text-green-600 transition-colors font-medium"
              >
                Groceries
              </Link>
              <Link 
                to="/post-product" 
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-400 transition-colors font-medium"
              >
                🏪 Sell Products
              </Link>
            </div>

            {/* User Profile */}
            <div className="relative">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
                  >
                    <img
                      src={user?.avatar || 'https://via.placeholder.com/32'}
                      alt="Profile"
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="hidden md:block">{user?.name}</span>
                    <span className="text-xs">▼</span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <div className="py-1">
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Profile
                        </Link>
                        <Link
                          to="/orders"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Orders
                        </Link>
                        <Link
                          to="/subscriptions"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          📦 Subscriptions
                        </Link>
                        <Link
                          to="/group-orders"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          👥 Group Orders
                        </Link>
                        <Link
                          to="/addresses"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Addresses
                        </Link>
                        <Link
                          to="/post-product"
                          className="block px-4 py-2 text-blue-600 hover:bg-blue-50 font-medium"
                          onClick={() => setShowUserMenu(false)}
                        >
                          🏪 Sell Products
                        </Link>
                        <Link
                          to="/premium"
                          className="block px-4 py-2 text-green-600 hover:bg-green-50 font-medium"
                          onClick={() => setShowUserMenu(false)}
                        >
                          ⭐ Premium
                        </Link>
                        <hr className="my-1" />
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={handleAuthClick}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  <FiUser className="h-5 w-5" />
                  <span className="hidden md:block">Sign In</span>
                </button>
              )}
            </div>

            {/* Premium Badge */}
            {isAuthenticated && user?.isInstamartPlus && (
              <Link
                to="/premium"
                className="hidden lg:flex items-center px-3 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-medium rounded-full"
              >
                ⭐ Premium
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Delivery Info */}
      <div className="md:hidden px-4 py-2 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center">
            <FiMapPin className="h-4 w-4 mr-1" />
            <span className="truncate max-w-xs">
              {deliveryInfo.address || 'Select location'}
            </span>
          </div>
          <div className="flex items-center">
            <FiClock className="h-4 w-4 mr-1" />
            <span className="font-medium text-green-600">
              {deliveryInfo.estimatedTime} mins
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 