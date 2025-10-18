import express from 'express';
import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// Mock grocery data - in real app, this would come from a database
const groceryCategories = [
  {
    id: 'spices',
    name: '🌶️ Spices & Masalas',
    icon: '🌶️',
    description: 'Authentic Indian spices, whole spices, ground spices, masala blends',
    itemCount: 150,
    subcategories: ['Whole Spices', 'Ground Spices', 'Garam Masala', 'Regional Masalas', 'Organic Spices']
  },
  {
    id: 'staples',
    name: '🌾 Staples & Grains',
    icon: '🌾',
    description: 'Premium rice varieties, lentils, flours, cooking oils, ghee',
    itemCount: 120,
    subcategories: ['Basmati Rice', 'Regional Rice', 'Lentils & Pulses', 'Cooking Oils', 'Flour & Grains']
  },
  {
    id: 'snacks',
    name: '🥨 Snacks & Namkeens',
    icon: '🥨',
    description: 'Traditional Indian snacks, namkeens, biscuits, ready-to-eat foods',
    itemCount: 200,
    subcategories: ['Namkeens', 'Traditional Sweets', 'Chips & Crackers', 'Dry Fruits', 'Ready-to-Eat']
  },
  {
    id: 'beverages',
    name: '☕ Tea & Coffee',
    icon: '☕',
    description: 'Premium Indian teas, filter coffee, health drinks',
    itemCount: 80,
    subcategories: ['Assam Tea', 'Darjeeling Tea', 'South Indian Coffee', 'Green Tea', 'Health Drinks']
  },
  {
    id: 'fresh-produce',
    name: '🥭 Fresh Produce',
    icon: '🥭',
    description: 'Indian fruits, vegetables, fresh herbs used in Indian cooking',
    itemCount: 95,
    subcategories: ['Tropical Fruits', 'Indian Vegetables', 'Fresh Herbs', 'Organic Produce', 'Seasonal Fruits']
  },
  {
    id: 'dairy',
    name: '🥛 Dairy Products',
    icon: '🥛',
    description: 'Fresh paneer, milk, curd, ghee, traditional dairy products',
    itemCount: 60,
    subcategories: ['Paneer & Cheese', 'Milk Products', 'Yogurt & Curd', 'Butter & Ghee', 'Plant-based']
  },
  {
    id: 'personal-care',
    name: '🌿 Ayurveda & Wellness',
    icon: '🌿',
    description: 'Ayurvedic products, herbal supplements, traditional wellness items',
    itemCount: 70,
    subcategories: ['Ayurvedic Medicine', 'Hair Care', 'Skin Care', 'Immunity Boosters', 'Herbal Teas']
  },
  {
    id: 'kitchenware',
    name: '🍳 Indian Kitchenware',
    icon: '🍳',
    description: 'Traditional cooking utensils, pressure cookers, storage containers',
    itemCount: 45,
    subcategories: ['Pressure Cookers', 'Traditional Utensils', 'Storage Containers', 'Spice Boxes', 'Cookware']
  }
];

const groceryItems = [
  // ===== PREMIUM SPICES & MASALAS =====
  {
    id: '1',
    name: 'Cardamom Green Pods Premium',
    description: 'Premium quality green cardamom pods from Kerala hills, world-renowned for aroma',
    price: 450,
    originalPrice: 500,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200',
    category: 'spices',
    subcategory: 'Whole Spices',
    brand: 'Everest',
    unit: '50g',
    inStock: true,
    rating: 4.8,
    reviewCount: 1245,
    tags: ['premium', 'kerala', 'aromatic', 'export-quality'],
    weight: '50g',
    organic: true,
    vegan: true,
    glutenFree: true
  },
  {
    id: '2',
    name: 'Black Pepper Whole Malabar',
    description: 'World-renowned black peppercorns from Malabar coast, king of spices',
    price: 320,
    image: 'https://images.unsplash.com/photo-1505798577917-a65157d3353a?w=200',
    category: 'spices',
    subcategory: 'Whole Spices',
    brand: 'MDH',
    unit: '100g',
    inStock: true,
    rating: 4.7,
    reviewCount: 892,
    tags: ['malabar', 'premium', 'king-of-spices'],
    weight: '100g',
    vegan: true,
    glutenFree: true
  },
  {
    id: '3',
    name: 'Turmeric Powder High Curcumin',
    description: 'Pure turmeric powder with high curcumin content, anti-inflammatory properties',
    price: 85,
    image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=200',
    category: 'spices',
    subcategory: 'Ground Spices',
    brand: 'Badshah',
    unit: '200g',
    inStock: true,
    rating: 4.6,
    reviewCount: 1567,
    tags: ['pure', 'high-curcumin', 'anti-inflammatory'],
    weight: '200g',
    vegan: true,
    glutenFree: true
  },
  {
    id: '4',
    name: 'Garam Masala Authentic Blend',
    description: 'Traditional blend of aromatic whole spices, freshly ground for authentic Indian cooking',
    price: 95,
    originalPrice: 110,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200',
    category: 'spices',
    subcategory: 'Garam Masala',
    brand: 'MDH',
    unit: '100g',
    inStock: true,
    rating: 4.5,
    reviewCount: 2134,
    tags: ['authentic', 'fresh', 'traditional', 'aromatic'],
    weight: '100g',
    vegan: true,
    glutenFree: true
  },
  {
    id: '5',
    name: 'Red Chili Powder Guntur',
    description: 'Spicy red chili powder from Guntur, Andhra Pradesh - known for heat and flavor',
    price: 120,
    image: 'https://images.unsplash.com/photo-1604917454745-21e44c92d310?w=200',
    category: 'spices',
    subcategory: 'Ground Spices',
    brand: 'Everest',
    unit: '200g',
    inStock: true,
    rating: 4.4,
    reviewCount: 987,
    tags: ['guntur', 'spicy', 'authentic', 'andhra'],
    weight: '200g',
    vegan: true,
    glutenFree: true
  },

  // ===== PREMIUM RICE VARIETIES =====
  {
    id: '6',
    name: 'Basmati Rice Premium Aged',
    description: 'Premium aged basmati rice with long grains and aromatic fragrance, exported worldwide',
    price: 285,
    originalPrice: 320,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e8c3?w=200',
    category: 'staples',
    subcategory: 'Basmati Rice',
    brand: 'India Gate',
    unit: '5kg',
    inStock: true,
    rating: 4.7,
    reviewCount: 3456,
    tags: ['premium', 'aged', 'aromatic', 'export-quality'],
    weight: '5kg',
    organic: true,
    vegan: true,
    glutenFree: true
  },
  {
    id: '7',
    name: 'Sona Masoori Rice',
    description: 'Premium non-basmati rice, perfect for South Indian dishes, lightweight and aromatic',
    price: 180,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e8c3?w=200',
    category: 'staples',
    subcategory: 'Regional Rice',
    brand: 'Daawat',
    unit: '5kg',
    inStock: true,
    rating: 4.5,
    reviewCount: 1234,
    tags: ['south-indian', 'premium', 'lightweight', 'aromatic'],
    weight: '5kg',
    vegan: true,
    glutenFree: true
  },

  // ===== LENTILS & PULSES =====
  {
    id: '8',
    name: 'Toor Dal Premium Arhar',
    description: 'High-quality pigeon peas rich in protein, staple of Indian cooking',
    price: 135,
    image: 'https://images.unsplash.com/photo-1599909151466-de8f96a538a3?w=200',
    category: 'staples',
    subcategory: 'Lentils & Pulses',
    brand: 'Organic Tattva',
    unit: '1kg',
    inStock: true,
    rating: 4.4,
    reviewCount: 876,
    tags: ['protein-rich', 'organic', 'staple'],
    weight: '1kg',
    organic: true,
    vegan: true,
    glutenFree: true
  },
  {
    id: '9',
    name: 'Rajma Kashmir Premium',
    description: 'Premium red kidney beans from Kashmir valley, perfect for rajma curry',
    price: 165,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200',
    category: 'staples',
    subcategory: 'Lentils & Pulses',
    brand: 'Organic India',
    unit: '1kg',
    inStock: true,
    rating: 4.6,
    reviewCount: 654,
    tags: ['kashmir', 'premium', 'rajma-curry', 'protein-rich'],
    weight: '1kg',
    organic: true,
    vegan: true,
    glutenFree: true
  },

  // ===== COOKING OILS & GHEE =====
  {
    id: '10',
    name: 'Pure Cow Ghee A2',
    description: 'Traditional A2 cow ghee made from pure milk, golden and aromatic',
    price: 650,
    originalPrice: 720,
    image: 'https://images.unsplash.com/photo-1609501676725-7186f66edcd7?w=200',
    category: 'staples',
    subcategory: 'Cooking Oils',
    brand: 'Amul',
    unit: '1L',
    inStock: true,
    rating: 4.8,
    reviewCount: 2345,
    tags: ['a2-cow', 'pure', 'traditional', 'golden'],
    weight: '1L'
  },
  {
    id: '11',
    name: 'Mustard Oil Cold Pressed',
    description: 'Cold-pressed mustard oil with strong flavor, traditional cooking oil of North India',
    price: 285,
    image: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=200',
    category: 'staples',
    subcategory: 'Cooking Oils',
    brand: 'Dhara',
    unit: '1L',
    inStock: true,
    rating: 4.3,
    reviewCount: 567,
    tags: ['cold-pressed', 'traditional', 'north-indian', 'strong-flavor'],
    weight: '1L',
    vegan: true
  },
  {
    id: '12',
    name: 'Coconut Oil Virgin Pure',
    description: 'Cold-pressed virgin coconut oil, pure and natural for cooking and wellness',
    price: 425,
    originalPrice: 450,
    image: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=200',
    category: 'staples',
    subcategory: 'Cooking Oils',
    brand: 'Parachute',
    unit: '1L',
    inStock: true,
    rating: 4.7,
    reviewCount: 1456,
    tags: ['virgin', 'cold-pressed', 'pure', 'wellness'],
    weight: '1L',
    organic: true,
    vegan: true,
    glutenFree: true
  },

  // ===== TRADITIONAL SNACKS =====
  {
    id: '13',
    name: 'Haldiram\'s Aloo Bhujia',
    description: 'Crispy potato sticks with aromatic spices, traditional Indian namkeen',
    price: 45,
    originalPrice: 50,
    image: 'https://images.unsplash.com/photo-1599599810694-57a2ca3bf6f1?w=200',
    category: 'snacks',
    subcategory: 'Namkeens',
    brand: 'Haldiram\'s',
    unit: '150g',
    inStock: true,
    rating: 4.5,
    reviewCount: 1789,
    tags: ['crispy', 'traditional', 'spicy', 'namkeen'],
    weight: '150g',
    vegan: true
  },
  {
    id: '14',
    name: 'Cashews Premium Kerala',
    description: 'Large size premium cashews from Kerala, rich in healthy fats',
    price: 850,
    originalPrice: 920,
    image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=200',
    category: 'snacks',
    subcategory: 'Dry Fruits',
    brand: 'Nutraj',
    unit: '500g',
    inStock: true,
    rating: 4.7,
    reviewCount: 987,
    tags: ['kerala', 'premium', 'large-size', 'healthy-fats'],
    weight: '500g',
    vegan: true,
    glutenFree: true
  },
  {
    id: '15',
    name: 'Dates Medjool Iran',
    description: 'Large soft Medjool dates from Iran, natural sweetener rich in fiber',
    price: 450,
    image: 'https://images.unsplash.com/photo-1577308856961-8e0ec50d6ad4?w=200',
    category: 'snacks',
    subcategory: 'Dry Fruits',
    brand: 'Nutraj',
    unit: '250g',
    inStock: true,
    rating: 4.6,
    reviewCount: 456,
    tags: ['medjool', 'iran', 'natural-sweetener', 'fiber-rich'],
    weight: '250g',
    vegan: true,
    glutenFree: true
  },

  // ===== TEA & COFFEE =====
  {
    id: '16',
    name: 'Assam Tea CTC Premium',
    description: 'Premium black tea from Assam gardens, strong and malty flavor',
    price: 175,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200',
    category: 'beverages',
    subcategory: 'Assam Tea',
    brand: 'Tata Tea',
    unit: '500g',
    inStock: true,
    rating: 4.4,
    reviewCount: 1234,
    tags: ['assam', 'premium', 'strong', 'malty'],
    weight: '500g',
    vegan: true,
    glutenFree: true
  },
  {
    id: '17',
    name: 'Darjeeling Tea Premium',
    description: 'Finest Darjeeling tea with muscatel flavor, champagne of teas',
    price: 650,
    originalPrice: 720,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200',
    category: 'beverages',
    subcategory: 'Darjeeling Tea',
    brand: 'Twinings',
    unit: '200g',
    inStock: true,
    rating: 4.8,
    reviewCount: 567,
    tags: ['darjeeling', 'muscatel', 'premium', 'champagne-of-teas'],
    weight: '200g',
    vegan: true,
    glutenFree: true
  },
  {
    id: '18',
    name: 'Filter Coffee South Indian',
    description: 'Traditional South Indian filter coffee blend, rich and aromatic',
    price: 385,
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=200',
    category: 'beverages',
    subcategory: 'South Indian Coffee',
    brand: 'Narasu\'s',
    unit: '500g',
    inStock: true,
    rating: 4.6,
    reviewCount: 890,
    tags: ['south-indian', 'filter-coffee', 'rich', 'aromatic'],
    weight: '500g',
    vegan: true,
    glutenFree: true
  },

  // ===== FRESH PRODUCE =====
  {
    id: '19',
    name: 'Alphonso Mangoes Maharashtra',
    description: 'King of mangoes from Maharashtra, sweet and aromatic',
    price: 650,
    originalPrice: 720,
    image: 'https://images.unsplash.com/photo-1553279768-865429ffa5fb?w=200',
    category: 'fresh-produce',
    subcategory: 'Tropical Fruits',
    brand: 'Fresh Farm',
    unit: '1kg (4-5 pieces)',
    inStock: true,
    rating: 4.9,
    reviewCount: 2134,
    tags: ['alphonso', 'maharashtra', 'king-of-mangoes', 'sweet'],
    weight: '1kg',
    vegan: true,
    glutenFree: true
  },
  {
    id: '20',
    name: 'Bitter Gourd Karela',
    description: 'Fresh bitter gourd rich in nutrients, traditional Indian vegetable',
    price: 85,
    image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=200',
    category: 'fresh-produce',
    subcategory: 'Indian Vegetables',
    brand: 'Organic Farms',
    unit: '500g',
    inStock: true,
    rating: 4.0,
    reviewCount: 234,
    tags: ['bitter-gourd', 'nutritious', 'traditional', 'indian-vegetable'],
    weight: '500g',
    vegan: true,
    glutenFree: true
  },

  // ===== DAIRY PRODUCTS =====
  {
    id: '21',
    name: 'Amul Fresh Paneer',
    description: 'Fresh cottage cheese perfect for Indian curries, high in protein',
    price: 85,
    image: 'https://images.unsplash.com/photo-1631452180519-8dd4f754e6b4?w=200',
    category: 'dairy',
    subcategory: 'Paneer & Cheese',
    brand: 'Amul',
    unit: '200g',
    inStock: true,
    rating: 4.6,
    reviewCount: 1456,
    tags: ['fresh', 'cottage-cheese', 'protein-rich', 'indian-curries'],
    weight: '200g'
  },
  {
    id: '22',
    name: 'Amul Taza Milk',
    description: 'Fresh homogenized toned milk, pure and nutritious',
    price: 28,
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200',
    category: 'dairy',
    subcategory: 'Milk Products',
    brand: 'Amul',
    unit: '500ml',
    inStock: true,
    rating: 4.5,
    reviewCount: 3456,
    tags: ['fresh', 'homogenized', 'toned', 'nutritious'],
    weight: '500ml'
  },

  // ===== AYURVEDIC PRODUCTS =====
  {
    id: '23',
    name: 'Chyawanprash Immunity Booster',
    description: 'Traditional Ayurvedic immunity booster with herbs and spices',
    price: 385,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200',
    category: 'personal-care',
    subcategory: 'Ayurvedic Medicine',
    brand: 'Dabur',
    unit: '500g',
    inStock: true,
    rating: 4.5,
    reviewCount: 1789,
    tags: ['ayurvedic', 'immunity', 'traditional', 'herbal'],
    weight: '500g',
    vegan: true
  },
  {
    id: '24',
    name: 'Turmeric Golden Milk Powder',
    description: 'Golden milk powder with turmeric and spices for health and wellness',
    price: 165,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200',
    category: 'beverages',
    subcategory: 'Health Drinks',
    brand: 'Organic India',
    unit: '200g',
    inStock: true,
    rating: 4.4,
    reviewCount: 567,
    tags: ['golden-milk', 'turmeric', 'wellness', 'organic'],
    weight: '200g',
    organic: true,
    vegan: true,
    glutenFree: true
  },

  // ===== TRADITIONAL SWEETS =====
  {
    id: '25',
    name: 'Soan Papdi Traditional',
    description: 'Flaky traditional Indian sweet, perfect for festivals and celebrations',
    price: 145,
    image: 'https://images.unsplash.com/photo-1631452180539-96aca7d48617?w=200',
    category: 'snacks',
    subcategory: 'Traditional Sweets',
    brand: 'Haldiram\'s',
    unit: '250g',
    inStock: true,
    rating: 4.3,
    reviewCount: 890,
    tags: ['traditional', 'flaky', 'festivals', 'celebrations'],
    weight: '250g'
  }
];

// Get all grocery categories
router.get('/categories', asyncHandler(async (req: Request, res: Response) => {
  res.json({
    success: true,
    data: groceryCategories
  });
}));

// Get grocery items with filters
router.get('/items', asyncHandler(async (req: Request, res: Response) => {
  const { 
    category, 
    subcategory, 
    search, 
    organic, 
    glutenFree, 
    vegan, 
    inStock,
    minPrice,
    maxPrice,
    sortBy = 'name',
    page = 1,
    limit = 20
  } = req.query;

  let filteredItems = [...groceryItems];

  // Apply filters
  if (category) {
    filteredItems = filteredItems.filter(item => item.category === category);
  }

  if (subcategory) {
    filteredItems = filteredItems.filter(item => item.subcategory === subcategory);
  }

  if (search) {
    const searchTerm = (search as string).toLowerCase();
    filteredItems = filteredItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm) ||
      item.brand.toLowerCase().includes(searchTerm)
    );
  }

  if (organic === 'true') {
    filteredItems = filteredItems.filter(item => item.organic);
  }

  if (glutenFree === 'true') {
    filteredItems = filteredItems.filter(item => item.glutenFree);
  }

  if (vegan === 'true') {
    filteredItems = filteredItems.filter(item => item.vegan);
  }

  if (inStock === 'true') {
    filteredItems = filteredItems.filter(item => item.inStock);
  }

  if (minPrice) {
    const min = parseFloat(minPrice as string);
    filteredItems = filteredItems.filter(item => item.price >= min);
  }

  if (maxPrice) {
    const max = parseFloat(maxPrice as string);
    filteredItems = filteredItems.filter(item => item.price <= max);
  }

  // Apply sorting
  switch (sortBy) {
    case 'price-low':
      filteredItems.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filteredItems.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      filteredItems.sort((a, b) => b.rating - a.rating);
      break;
    case 'name':
    default:
      filteredItems.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Apply pagination
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  res.json({
    success: true,
    data: paginatedItems,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: filteredItems.length,
      totalPages: Math.ceil(filteredItems.length / limitNum)
    }
  });
}));

// Get grocery items by category
router.get('/category/:category', asyncHandler(async (req: Request, res: Response) => {
  const { category } = req.params;
  const { subcategory } = req.query;

  let filteredItems = groceryItems.filter(item => item.category === category);

  if (subcategory) {
    filteredItems = filteredItems.filter(item => item.subcategory === subcategory);
  }

  const categoryInfo = groceryCategories.find(cat => cat.id === category);

  res.json({
    success: true,
    data: {
      category: categoryInfo,
      items: filteredItems
    }
  });
}));

// Get grocery item by ID
router.get('/item/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const item = groceryItems.find(item => item.id === id);
  
  if (!item) {
    return res.status(404).json({
      success: false,
      error: 'Grocery item not found'
    });
  }

  res.json({
    success: true,
    data: item
  });
}));

// Search grocery items
router.get('/search/:query', asyncHandler(async (req: Request, res: Response) => {
  const { query } = req.params;
  const searchTerm = query.toLowerCase();

  const results = groceryItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm) ||
    item.description.toLowerCase().includes(searchTerm) ||
    item.brand.toLowerCase().includes(searchTerm) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );

  res.json({
    success: true,
    data: results,
    query: searchTerm
  });
}));

// Get popular grocery items
router.get('/popular', asyncHandler(async (req: Request, res: Response) => {
  const popularItems = groceryItems
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10);

  res.json({
    success: true,
    data: popularItems
  });
}));

export default router; 