import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FiSearch, 
  FiShoppingCart, 
  FiUser, 
  FiMenu,
} from 'react-icons/fi';
import { RootState } from '../../store/store';
import { showAuthModal, logout } from '../../store/slices/authSlice';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { toast } from 'react-hot-toast';

// Category menu data
const categoryMenu = [
  {
    id: 'beauty-cosmetics',
    name: 'BEAUTY & COSMETICS',
    icon: '💄',
    subcategories: ['SKINCARE', 'COSMETICS ITEMS', 'FACE CARE', 'BABY CARE', 'DENTAL CARE', 'PERSONAL CARE', 'HAIR CARE', 'MEDICINE', 'HAND WASH', 'MORE']
  },
  {
    id: 'grocery',
    name: 'GROCERY',
    icon: '🛒',
    subcategories: ['Spices & Masalas', 'Staples & Grains', 'Snacks & Namkeens', 'Beverages', 'Fresh Produce', 'Dairy Products']
  },
  {
    id: 'stationery',
    name: 'STATIONERY',
    icon: '📝',
    subcategories: ['Pens & Pencils', 'Notebooks', 'Office Supplies', 'Art Supplies', 'School Supplies']
  },
  {
    id: 'fruits-vegetables',
    name: 'FRUITS & VEGETABLES',
    icon: '🍎',
    subcategories: ['Fresh Fruits', 'Fresh Vegetables', 'Organic Produce', 'Exotic Fruits', 'Seasonal Vegetables']
  },
  {
    id: 'outdoor',
    name: 'OUTDOOR',
    icon: '⛺',
    subcategories: ['Camping Gear', 'Outdoor Furniture', 'Garden Supplies', 'BBQ & Grilling']
  },
  {
    id: 'household',
    name: 'HOUSEHOLD',
    icon: '🏠',
    subcategories: ['Cleaning Supplies', 'Home Decor', 'Kitchenware', 'Storage Solutions', 'Bedding & Bath']
  },
  {
    id: 'snacks-refreshments',
    name: 'SNACKS & REFRESHMENTS',
    icon: '🥤',
    subcategories: ['Chips & Crackers', 'Beverages', 'Candy & Sweets', 'Energy Drinks', 'Juices']
  },
  {
    id: 'dairy',
    name: 'GOODS AND DAIRY',
    icon: '🥛',
    subcategories: ['Milk Products', 'Cheese', 'Yogurt', 'Butter & Ghee', 'Plant-based Alternatives']
  },
  {
    id: 'roastery',
    name: 'ROASTERY',
    icon: '☕',
    subcategories: ['Coffee Beans', 'Roasted Nuts', 'Coffee Products', 'Tea Selection']
  },
  {
    id: 'fishery',
    name: 'FISHERY',
    icon: '🐟',
    subcategories: ['Fresh Fish', 'Frozen Seafood', 'Canned Fish', 'Fish Products']
  },
  {
    id: 'bakery',
    name: 'BAKERY',
    icon: '🍞',
    subcategories: ['Fresh Bread', 'Pastries', 'Cakes', 'Cookies', 'Traditional Breads']
  },
  {
    id: 'delicatessen',
    name: 'DELICATESSEN',
    icon: '🥗',
    subcategories: ['Cold Cuts', 'Cheese Selection', 'Olives & Pickles', 'Prepared Foods']
  },
  {
    id: 'butchery',
    name: 'BUTCHERY',
    icon: '🥩',
    subcategories: ['Fresh Meat', 'Poultry', 'Lamb & Goat', 'Processed Meats']
  },
];

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
    <header className="bg-white sticky top-0 z-50 border-b border-gray-200 shadow-sm">
      {/* Top Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo on Left */}
          <Link to="/" className="flex items-center">
            <div className="flex items-center">
              <FiShoppingCart className="text-2xl text-green-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">FreshBazaar</span>
              <span className="ml-2 text-lg">🇮🇳</span>
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
          <div className="flex items-center space-x-4">
            {/* Search Icon - Mobile */}
            <button
              onClick={() => navigate('/search')}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              <FiSearch className="h-5 w-5" />
            </button>

            {/* Search Icon - Desktop */}
            <button
              onClick={() => navigate('/search')}
              className="hidden md:block p-2 text-gray-600 hover:text-gray-900"
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
              onClick={() => dispatch(toggleSidebar())}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <FiMenu className="h-6 w-6" />
            </button>

            {/* Login/Register Button or User Profile */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                >
                  <span className="font-medium">{user?.name || 'User'}</span>
                  <span className="text-xs text-gray-500">▼</span>
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
                onClick={handleAuthClick}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Login / Register
              </button>
            )}
          </div>
        </div>
      </div>

    </header>
  );
};

export default Header; 