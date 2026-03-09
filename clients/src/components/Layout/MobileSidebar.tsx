import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiX, FiChevronRight, FiUser, FiShoppingCart, FiHome } from 'react-icons/fi';
import { RootState } from '../../store/store';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { showAuthModal, logout } from '../../store/slices/authSlice';
import { toast } from 'react-hot-toast';

// Category menu data (same as Header)
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

const MobileSidebar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isOpen } = useSelector((state: RootState) => state.ui.sidebar);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { totalItems } = useSelector((state: RootState) => state.cart);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const handleClose = () => {
    dispatch(toggleSidebar(false));
  };

  const handleLinkClick = () => {
    handleClose();
  };

  const handleAuthClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
      handleClose();
    } else {
      dispatch(showAuthModal('login'));
      handleClose();
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    handleClose();
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        onClick={handleClose}
      />

      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 overflow-y-auto md:hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center">
            <FiShoppingCart className="text-2xl text-green-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">FreshBazaar</span>
            <span className="ml-2 text-lg">🇮🇳</span>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        {/* User Section */}
        <div className="p-4 border-b border-gray-200">
          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <FiUser className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{user?.name || 'User'}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
          ) : (
            <button
              onClick={handleAuthClick}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Login / Register
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <div className="py-2">
          <Link
            to="/"
            onClick={handleLinkClick}
            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <FiHome className="h-5 w-5 mr-3" />
            <span className="font-medium">Home</span>
          </Link>
          <Link
            to="/menu"
            onClick={handleLinkClick}
            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <span className="mr-3">📋</span>
            <span className="font-medium">Menu</span>
          </Link>
          <Link
            to="/stores"
            onClick={handleLinkClick}
            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <span className="mr-3">🏪</span>
            <span className="font-medium">Stores</span>
          </Link>
          <Link
            to="/groceries"
            onClick={handleLinkClick}
            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <span className="mr-3">🛒</span>
            <span className="font-medium">Groceries</span>
          </Link>
          <Link
            to="/cart"
            onClick={handleLinkClick}
            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <FiShoppingCart className="h-5 w-5 mr-3" />
            <span className="font-medium">Cart</span>
            {totalItems > 0 && (
              <span className="ml-auto bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          <Link
            to="/post-product"
            onClick={handleLinkClick}
            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <span className="mr-3">🏪</span>
            <span className="font-medium">Sell Products</span>
          </Link>
          {isAuthenticated && (
            <>
              <Link
                to="/profile"
                onClick={handleLinkClick}
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <FiUser className="h-5 w-5 mr-3" />
                <span className="font-medium">Profile</span>
              </Link>
              <Link
                to="/orders"
                onClick={handleLinkClick}
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <span className="mr-3">📦</span>
                <span className="font-medium">Orders</span>
              </Link>
              <Link
                to="/subscriptions"
                onClick={handleLinkClick}
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <span className="mr-3">📦</span>
                <span className="font-medium">Subscriptions</span>
              </Link>
              <Link
                to="/addresses"
                onClick={handleLinkClick}
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <span className="mr-3">📍</span>
                <span className="font-medium">Addresses</span>
              </Link>
            </>
          )}
          <Link
            to="/contact"
            onClick={handleLinkClick}
            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <span className="mr-3">📞</span>
            <span className="font-medium">Contact Us</span>
          </Link>
        </div>

        {/* Categories Section */}
        <div className="border-t border-gray-200 py-2">
          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Categories
          </div>
          {categoryMenu.map((category) => (
            <div key={category.id}>
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <span className="mr-3 text-lg">{category.icon}</span>
                  <span className="font-medium text-sm">{category.name}</span>
                </div>
                <FiChevronRight
                  className={`h-5 w-5 transition-transform ${
                    expandedCategory === category.id ? 'transform rotate-90' : ''
                  }`}
                />
              </button>
              {expandedCategory === category.id && category.subcategories.length > 0 && (
                <div className="bg-gray-50">
                  {category.subcategories.map((subcategory, index) => (
                    <Link
                      key={index}
                      to={`/menu?category=${category.id}&subcategory=${encodeURIComponent(subcategory.toLowerCase())}`}
                      onClick={handleLinkClick}
                      className="block px-8 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-green-600 transition-colors"
                    >
                      {subcategory}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Logout Button */}
        {isAuthenticated && (
          <div className="border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default MobileSidebar;
