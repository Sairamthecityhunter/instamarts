import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FiSearch, 
  FiShoppingCart, 
  FiMenu,
} from 'react-icons/fi';
import { RootState } from '../../store/store';
import { showAuthModal, logout } from '../../store/slices/authSlice';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { toast } from 'react-hot-toast';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { totalItems } = useSelector((state: RootState) => state.cart);
  const [showUserMenu, setShowUserMenu] = useState(false);

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

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-200 shadow-sm pt-[env(safe-area-inset-top)]">
      {/* Top Navigation Bar */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-1 min-w-0">
          {/* Logo on Left */}
          <Link to="/" className="flex items-center min-w-0 shrink-0">
            <div className="flex items-center min-w-0">
              <FiShoppingCart className="text-xl sm:text-2xl text-green-600 shrink-0" />
              <span className="ml-1 sm:ml-2 text-base sm:text-xl font-bold text-gray-900 truncate max-w-[6.5rem] sm:max-w-none">
                FreshBazaar
              </span>
              <span className="ml-1 sm:ml-2 text-base sm:text-lg hidden sm:inline shrink-0">🇮🇳</span>
            </div>
          </Link>

          {/* Navigation Links - Centered */}
          <nav className="hidden md:flex items-center space-x-8 flex-1 justify-center">
            <Link
              to="/menu"
              className={`font-medium transition-colors ${
                isActive('/menu') 
                  ? 'text-green-600' 
                  : 'text-gray-700 hover:text-green-600'
              }`}
            >
              Menu
            </Link>

            <Link 
              to="/stores" 
              className={`font-medium transition-colors ${
                isActive('/stores') 
                  ? 'text-green-600' 
                  : 'text-gray-700 hover:text-green-600'
              }`}
            >
              Stores
            </Link>
            <Link 
              to="/groceries" 
              className={`font-medium transition-colors ${
                isActive('/groceries') 
                  ? 'text-green-600' 
                  : 'text-gray-700 hover:text-green-600'
              }`}
            >
              Groceries
            </Link>
            <Link 
              to="/post-product" 
              className={`font-medium transition-colors ${
                isActive('/post-product') 
                  ? 'text-green-600' 
                  : 'text-gray-700 hover:text-green-600'
              }`}
            >
              🏪 Sell Products
            </Link>
            {isAuthenticated && (
              <Link 
                to="/profile" 
                className={`font-medium transition-colors ${
                  isActive('/profile') 
                    ? 'text-green-600' 
                    : 'text-gray-700 hover:text-green-600'
                }`}
              >
                Profile
              </Link>
            )}
            <Link 
              to="/contact" 
              className={`font-medium transition-colors ${
                isActive('/contact') 
                  ? 'text-green-600' 
                  : 'text-gray-700 hover:text-green-600'
              }`}
            >
              Contact Us
            </Link>
          </nav>

          {/* Right Side - Search, Cart, User Menu */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-4 shrink-0 min-w-0">
            <button
              type="button"
              onClick={() => navigate('/search')}
              className="p-2 text-gray-600 hover:text-gray-900 touch-manipulation"
              aria-label="Search"
            >
              <FiSearch className="h-5 w-5" />
            </button>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-600 hover:text-gray-900"
            >
              <FiShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu */}
            <button
              type="button"
              onClick={() => dispatch(toggleSidebar())}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 touch-manipulation"
              aria-label="Open menu"
            >
              <FiMenu className="h-6 w-6" />
            </button>

            {/* Login/Register Button or User Profile */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-1 sm:space-x-2 text-gray-700 hover:text-gray-900 max-w-[5rem] sm:max-w-[10rem] md:max-w-none"
                >
                  <span className="font-medium text-sm sm:text-base truncate">{user?.name || 'User'}</span>
                  <span className="text-xs text-gray-500 shrink-0 hidden sm:inline">▼</span>
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
                        to="/addresses"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Addresses
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
              </div>
            ) : (
              <button
                type="button"
                onClick={handleAuthClick}
                className="bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base px-3 py-1.5 sm:px-6 sm:py-2 rounded-lg font-medium transition-colors whitespace-nowrap touch-manipulation"
              >
                <span className="sm:hidden">Login</span>
                <span className="hidden sm:inline">Login / Register</span>
              </button>
            )}
          </div>
        </div>
      </div>

    </header>
  );
};

export default Header; 