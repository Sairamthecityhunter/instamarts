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
import { showAuthModal } from '../../store/slices/authSlice';
import { toggleSidebar } from '../../store/slices/uiSlice';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { totalItems } = useSelector((state: RootState) => state.cart);
  const { deliveryInfo } = useSelector((state: RootState) => state.ui);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleAuthClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      dispatch(showAuthModal('login'));
    }
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
                <span className="text-2xl font-bold text-primary-600">Swiggy</span>
                <span className="ml-1 text-xl font-semibold text-gray-900">Instamart</span>
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
                  placeholder="Search for products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Profile */}
            <button
              onClick={handleAuthClick}
              className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900"
            >
              <FiUser className="h-6 w-6" />
              {isAuthenticated && user && (
                <span className="hidden lg:block text-sm font-medium">
                  {user.name}
                </span>
              )}
            </button>

            {/* Instamart+ */}
            {isAuthenticated && user?.isInstamartPlus && (
              <Link
                to="/instamart-plus"
                className="hidden lg:flex items-center px-3 py-1 bg-gradient-bg text-white text-sm font-medium rounded-full"
              >
                Plus
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