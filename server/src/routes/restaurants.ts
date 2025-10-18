import express from 'express';
import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// Mock restaurant data - in real app, this would come from a database
const restaurants = [
  {
    id: '1',
    name: 'Pizza Palace',
    cuisine: ['Italian', 'Pizza', 'Pasta'],
    rating: 4.2,
    deliveryTime: '25-35 min',
    costForTwo: 600,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
    isPureVeg: false,
    offers: ['50% OFF up to ₹100', 'Free delivery on orders above ₹199'],
    isOpen: true,
    location: {
      address: '123 MG Road, Bangalore',
      coordinates: { lat: 12.9716, lng: 77.5946 }
    },
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
  },
  {
    id: '2',
    name: 'Burger House',
    cuisine: ['American', 'Burgers', 'Fast Food'],
    rating: 4.0,
    deliveryTime: '20-30 min',
    costForTwo: 400,
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400',
    isPureVeg: false,
    offers: ['Free delivery'],
    isOpen: true,
    location: {
      address: '456 Tech Park, Whitefield',
      coordinates: { lat: 12.9716, lng: 77.5946 }
    },
    menuCategories: [
      { id: 'burgers', name: 'Burgers', icon: '🍔', itemCount: 8 },
      { id: 'sides', name: 'Sides', icon: '🍟', itemCount: 6 },
      { id: 'beverages', name: 'Beverages', icon: '🥤', itemCount: 8 }
    ],
    menu: [
      {
        id: '6',
        name: 'Chicken Burger',
        description: 'Grilled chicken with fresh vegetables and special sauce',
        price: 199,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200',
        category: 'burgers',
        isVeg: false,
        isAvailable: true,
        spiceLevel: 'medium',
        calories: 350,
        allergens: ['gluten', 'eggs'],
        tags: ['bestseller'],
        rating: { average: 4.2, count: 123 },
        customizations: [
          {
            type: 'addon',
            name: 'Add-ons',
            options: [
              { name: 'Extra Cheese', price: 30 },
              { name: 'Bacon', price: 50 }
            ]
          }
        ]
      },
      {
        id: '7',
        name: 'Veg Burger',
        description: 'Plant-based patty with vegetables and vegan mayo',
        price: 149,
        image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=200',
        category: 'burgers',
        isVeg: true,
        isAvailable: true,
        calories: 280,
        allergens: ['gluten', 'soy'],
        tags: ['healthy_choice'],
        rating: { average: 3.8, count: 67 }
      }
    ]
  },
  {
    id: '3',
    name: 'Green Garden',
    cuisine: ['Indian', 'Vegetarian', 'Healthy'],
    rating: 4.5,
    deliveryTime: '30-40 min',
    costForTwo: 500,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
    isPureVeg: true,
    offers: ['20% OFF'],
    isOpen: true,
    location: {
      address: '789 Health Street, Koramangala',
      coordinates: { lat: 12.9716, lng: 77.5946 }
    },
    menuCategories: [
      { id: 'starters', name: 'Starters', icon: '🥗', itemCount: 6 },
      { id: 'main_course', name: 'Main Course', icon: '🍛', itemCount: 10 },
      { id: 'breads', name: 'Breads', icon: '🫓', itemCount: 4 },
      { id: 'desserts', name: 'Desserts', icon: '🍰', itemCount: 3 }
    ],
    menu: [
      {
        id: '8',
        name: 'Paneer Tikka',
        description: 'Grilled cottage cheese with spices and mint chutney',
        price: 299,
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200',
        category: 'starters',
        isVeg: true,
        isAvailable: true,
        spiceLevel: 'medium',
        calories: 220,
        allergens: ['dairy'],
        tags: ['bestseller', 'chef_special'],
        rating: { average: 4.6, count: 189 },
        customizations: [
          {
            type: 'spice',
            name: 'Spice Level',
            options: [
              { name: 'Mild', price: 0 },
              { name: 'Medium', price: 0 },
              { name: 'Hot', price: 0 }
            ]
          }
        ]
      },
      {
        id: '9',
        name: 'Dal Khichdi',
        description: 'Comforting rice and lentil dish with ghee',
        price: 199,
        image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=200',
        category: 'main_course',
        isVeg: true,
        isAvailable: true,
        calories: 320,
        allergens: ['dairy'],
        tags: ['healthy_choice'],
        rating: { average: 4.3, count: 94 }
      }
    ]
  }
];

// Get all restaurants with optional filters
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const { 
    cuisine, 
    rating, 
    costForTwo, 
    pureVeg, 
    offers,
    search,
    sortBy = 'relevance'
  } = req.query;

  let filteredRestaurants = [...restaurants];

  // Apply filters
  if (cuisine) {
    const cuisines = Array.isArray(cuisine) ? cuisine : [cuisine];
    filteredRestaurants = filteredRestaurants.filter(restaurant =>
      restaurant.cuisine.some(c => cuisines.includes(c))
    );
  }

  if (rating) {
    const minRating = parseFloat(rating as string);
    filteredRestaurants = filteredRestaurants.filter(restaurant =>
      restaurant.rating >= minRating
    );
  }

  if (costForTwo) {
    const maxCost = parseInt(costForTwo as string);
    filteredRestaurants = filteredRestaurants.filter(restaurant =>
      restaurant.costForTwo <= maxCost
    );
  }

  if (pureVeg === 'true') {
    filteredRestaurants = filteredRestaurants.filter(restaurant =>
      restaurant.isPureVeg
    );
  }

  if (offers === 'true') {
    filteredRestaurants = filteredRestaurants.filter(restaurant =>
      restaurant.offers.length > 0
    );
  }

  if (search) {
    const searchTerm = (search as string).toLowerCase();
    filteredRestaurants = filteredRestaurants.filter(restaurant =>
      restaurant.name.toLowerCase().includes(searchTerm) ||
      restaurant.cuisine.some(c => c.toLowerCase().includes(searchTerm)) ||
      restaurant.menu.some(item => item.name.toLowerCase().includes(searchTerm))
    );
  }

  // Apply sorting
  switch (sortBy) {
    case 'rating':
      filteredRestaurants.sort((a, b) => b.rating - a.rating);
      break;
    case 'deliveryTime':
      filteredRestaurants.sort((a, b) => {
        const aTime = parseInt(a.deliveryTime.split('-')[0]);
        const bTime = parseInt(b.deliveryTime.split('-')[0]);
        return aTime - bTime;
      });
      break;
    case 'costForTwo':
      filteredRestaurants.sort((a, b) => a.costForTwo - b.costForTwo);
      break;
    default:
      // Relevance sorting (by rating and popularity)
      filteredRestaurants.sort((a, b) => b.rating - a.rating);
  }

  res.json({
    success: true,
    data: filteredRestaurants,
    total: filteredRestaurants.length
  });
}));

// Get restaurant by ID
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const restaurant = restaurants.find(r => r.id === id);
  
  if (!restaurant) {
    return res.status(404).json({
      success: false,
      error: 'Restaurant not found'
    });
  }

  res.json({
    success: true,
    data: restaurant
  });
}));

// Get restaurant menu
router.get('/:id/menu', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { category } = req.query;
  
  const restaurant = restaurants.find(r => r.id === id);
  
  if (!restaurant) {
    return res.status(404).json({
      success: false,
      error: 'Restaurant not found'
    });
  }

  let menu = restaurant.menu;

  if (category) {
    menu = menu.filter(item => item.category === category);
  }

  res.json({
    success: true,
    data: {
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        cuisine: restaurant.cuisine,
        rating: restaurant.rating,
        deliveryTime: restaurant.deliveryTime,
        costForTwo: restaurant.costForTwo,
        isPureVeg: restaurant.isPureVeg,
        offers: restaurant.offers
      },
      menu,
      categories: restaurant.menuCategories
    }
  });
}));

// Get restaurant menu categories
router.get('/:id/categories', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const restaurant = restaurants.find(r => r.id === id);
  
  if (!restaurant) {
    return res.status(404).json({
      success: false,
      error: 'Restaurant not found'
    });
  }

  res.json({
    success: true,
    data: restaurant.menuCategories
  });
}));

// Search restaurants and dishes
router.get('/search/:query', asyncHandler(async (req: Request, res: Response) => {
  const { query } = req.params;
  const searchTerm = query.toLowerCase();

  const results = {
    restaurants: restaurants.filter(restaurant =>
      restaurant.name.toLowerCase().includes(searchTerm) ||
      restaurant.cuisine.some(c => c.toLowerCase().includes(searchTerm))
    ),
    dishes: restaurants.flatMap(restaurant =>
      restaurant.menu
        .filter(item => item.name.toLowerCase().includes(searchTerm))
        .map(item => ({
          ...item,
          restaurant: {
            id: restaurant.id,
            name: restaurant.name,
            cuisine: restaurant.cuisine,
            rating: restaurant.rating,
            deliveryTime: restaurant.deliveryTime
          }
        }))
    )
  };

  res.json({
    success: true,
    data: results,
    query: searchTerm
  });
}));

// Get popular restaurants
router.get('/popular', asyncHandler(async (req: Request, res: Response) => {
  const popularRestaurants = restaurants
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10);

  res.json({
    success: true,
    data: popularRestaurants
  });
}));

// Get restaurants by cuisine
router.get('/cuisine/:cuisine', asyncHandler(async (req: Request, res: Response) => {
  const { cuisine } = req.params;
  
  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.cuisine.some(c => c.toLowerCase() === cuisine.toLowerCase())
  );

  res.json({
    success: true,
    data: filteredRestaurants,
    cuisine
  });
}));

// Get menu item details
router.get('/:restaurantId/menu/:itemId', asyncHandler(async (req: Request, res: Response) => {
  const { restaurantId, itemId } = req.params;
  
  const restaurant = restaurants.find(r => r.id === restaurantId);
  
  if (!restaurant) {
    return res.status(404).json({
      success: false,
      error: 'Restaurant not found'
    });
  }

  const menuItem = restaurant.menu.find(item => item.id === itemId);
  
  if (!menuItem) {
    return res.status(404).json({
      success: false,
      error: 'Menu item not found'
    });
  }

  res.json({
    success: true,
    data: {
      ...menuItem,
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        cuisine: restaurant.cuisine,
        rating: restaurant.rating,
        deliveryTime: restaurant.deliveryTime
      }
    }
  });
}));

export default router; 