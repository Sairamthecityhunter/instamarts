import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../store/slices/cartSlice';
import { RootState } from '../store/store';
import RestaurantHeader from '../components/Restaurant/RestaurantHeader';
import CartSidebar from '../components/Cart/CartSidebar';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import FoodItemCard from '../components/Restaurant/FoodItemCard';
import CustomizationModal from '../components/Restaurant/CustomizationModal';
import { Restaurant, MenuItem } from '../types/restaurant';

const RestaurantPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showCustomization, setShowCustomization] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockRestaurant: Restaurant = {
      id: id || '1',
      name: 'Pizza Palace',
      cuisine: ['Italian', 'Pizza', 'Pasta'],
      rating: 4.2,
      deliveryTime: '25-35 min',
      costForTwo: 600,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
      isPureVeg: false,
      offers: ['50% OFF up to ₹100', 'Free delivery on orders above ₹199'],
      isOpen: true,
      menuCategories: [
        { id: 'starters', name: 'Starters', icon: '🥗', itemCount: 8 },
        { id: 'pizzas', name: 'Pizzas', icon: '🍕', itemCount: 12 },
        { id: 'pasta', name: 'Pasta', icon: '🍝', itemCount: 6 },
        { id: 'beverages', name: 'Beverages', icon: '🥤', itemCount: 10 },
        { id: 'desserts', name: 'Desserts', icon: '🍰', itemCount: 5 }
      ],
      menu: [
        {
          id: '1',
          name: 'Margherita Pizza',
          description: 'Classic tomato sauce with mozzarella cheese and fresh basil',
          price: 299,
          originalPrice: 399,
          image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200',
          category: 'pizzas',
          isVeg: true,
          isAvailable: true,
          spiceLevel: 'mild',
          calories: 285,
          allergens: ['dairy', 'gluten'],
          tags: ['bestseller', 'chef_special', 'instamart_recommended'],
          rating: { average: 4.5, count: 234 },
          customizations: [
            {
              type: 'topping',
              name: 'Extra Toppings',
              options: [
                { name: 'Extra Cheese', price: 50, description: 'Additional mozzarella' },
                { name: 'Mushrooms', price: 30, description: 'Fresh button mushrooms' },
                { name: 'Olives', price: 40, description: 'Black olives' }
              ]
            },
            {
              type: 'spice',
              name: 'Spice Level',
              options: [
                { name: 'Mild', price: 0 },
                { name: 'Medium', price: 0 },
                { name: 'Spicy', price: 0 }
              ]
            }
          ],
          frequentlyOrderedWith: ['2', '3'],
          recommendations: ['2', '4']
        },
        {
          id: '2',
          name: 'Pepperoni Pizza',
          description: 'Spicy pepperoni with melted cheese and herbs',
          price: 399,
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200',
          category: 'pizzas',
          isVeg: false,
          isAvailable: true,
          spiceLevel: 'spicy',
          calories: 320,
          allergens: ['dairy', 'gluten', 'pork'],
          tags: ['bestseller', 'new_item'],
          rating: { average: 4.3, count: 156 },
          customizations: [
            {
              type: 'topping',
              name: 'Extra Toppings',
              options: [
                { name: 'Extra Pepperoni', price: 60 },
                { name: 'Extra Cheese', price: 50 }
              ]
            }
          ]
        },
        {
          id: '3',
          name: 'Pasta Carbonara',
          description: 'Creamy pasta with bacon, parmesan and black pepper',
          price: 249,
          image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=200',
          category: 'pasta',
          isVeg: false,
          isAvailable: true,
          spiceLevel: 'medium',
          calories: 420,
          allergens: ['dairy', 'gluten', 'eggs'],
          tags: ['chef_special'],
          rating: { average: 4.1, count: 89 },
          customizations: [
            {
              type: 'addon',
              name: 'Add-ons',
              options: [
                { name: 'Extra Bacon', price: 40 },
                { name: 'Parmesan Cheese', price: 30 }
              ]
            }
          ]
        },
        {
          id: '4',
          name: 'Garlic Bread',
          description: 'Crispy bread topped with garlic butter and herbs',
          price: 99,
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200',
          category: 'starters',
          isVeg: true,
          isAvailable: true,
          calories: 180,
          allergens: ['dairy', 'gluten'],
          tags: ['healthy_choice'],
          rating: { average: 4.2, count: 67 }
        },
        {
          id: '5',
          name: 'Coke',
          description: 'Refreshing Coca-Cola soft drink',
          price: 60,
          image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=200',
          category: 'beverages',
          isVeg: true,
          isAvailable: true,
          calories: 140,
          tags: ['bestseller'],
          rating: { average: 4.0, count: 45 }
        }
      ]
    };

    setTimeout(() => {
      setRestaurant(mockRestaurant);
      setLoading(false);
      if (mockRestaurant.menuCategories.length > 0) {
        setSelectedCategory(mockRestaurant.menuCategories[0].id);
      }
    }, 1000);
  }, [id]);

  const handleAddToCart = (item: MenuItem, customizations?: any) => {
    const product = {
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
      category: item.category,
      brand: restaurant?.name || '',
      unit: 'piece',
      inStock: item.isAvailable,
      rating: item.rating?.average || 4.0,
      reviewCount: item.rating?.count || 0,
      tags: item.isVeg ? ['veg'] : ['non-veg'],
      customizations: customizations
    };
    
    dispatch(addToCart({ product, quantity: 1 }));
    setShowCustomization(false);
    setSelectedItem(null);
  };

  const handleCustomize = (item: MenuItem) => {
    setSelectedItem(item);
    setShowCustomization(true);
  };

  const handleRemoveFromCart = (itemId: string) => {
    dispatch(removeFromCart(itemId));
  };

  const getItemQuantity = (itemId: string) => {
    const item = cartItems.find(cartItem => cartItem.product.id === itemId);
    return item ? item.quantity : 0;
  };

  const filteredMenu = restaurant?.menu.filter(item => {
    const matchesCategory = item.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }) || [];

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!restaurant) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Restaurant not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <RestaurantHeader restaurant={restaurant} />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search in menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Category Navigation */}
            <div className="mb-6">
              <div className="flex space-x-4 overflow-x-auto pb-2">
                {restaurant.menuCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap flex items-center gap-2 ${
                      selectedCategory === category.id
                        ? 'bg-orange-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                    <span className="text-xs opacity-75">({category.itemCount})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Items */}
            <div className="space-y-6">
              {filteredMenu.map((item) => (
                <FoodItemCard
                  key={item.id}
                  item={item}
                  quantity={getItemQuantity(item.id)}
                  onAddToCart={() => handleAddToCart(item)}
                  onCustomize={() => handleCustomize(item)}
                  onRemoveFromCart={() => handleRemoveFromCart(item.id)}
                  onUpdateQuantity={(quantity: number) => {
                    if (quantity === 0) {
                      handleRemoveFromCart(item.id);
                    } else {
                      // Update quantity logic
                      const currentQty = getItemQuantity(item.id);
                      if (quantity > currentQty) {
                        handleAddToCart(item);
                      } else {
                        handleRemoveFromCart(item.id);
                      }
                    }
                  }}
                />
              ))}

              {filteredMenu.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🍽️</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    No items found
                  </h3>
                  <p className="text-gray-600">
                    {searchQuery ? 'Try adjusting your search terms' : 'This category is empty'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Cart Sidebar */}
          <div className="w-80">
            <CartSidebar />
          </div>
        </div>
      </div>

      {/* Customization Modal */}
      {showCustomization && selectedItem && (
        <CustomizationModal
          item={selectedItem}
          onClose={() => {
            setShowCustomization(false);
            setSelectedItem(null);
          }}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
};

export default RestaurantPage; 