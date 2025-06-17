import express from 'express';
import { Request, Response } from 'express';

const router = express.Router();

// Sample data for development
const sampleProducts = [
  {
    id: '1',
    name: 'Fresh Bananas',
    description: 'Premium quality bananas, rich in potassium',
    price: 60,
    originalPrice: 80,
    image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=300',
    category: 'fruits',
    brand: 'Fresh Farms',
    unit: '1 kg',
    inStock: true,
    rating: 4.5,
    reviewCount: 234,
    tags: ['fresh', 'organic', 'healthy']
  },
  {
    id: '2',
    name: 'Whole Wheat Bread',
    description: 'Freshly baked whole wheat bread',
    price: 45,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300',
    category: 'bakery',
    brand: 'Baker\'s Choice',
    unit: '500g',
    inStock: true,
    rating: 4.2,
    reviewCount: 156,
    tags: ['fresh', 'healthy', 'wheat']
  },
  {
    id: '3',
    name: 'Farm Fresh Milk',
    description: 'Pure and fresh cow milk',
    price: 30,
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300',
    category: 'dairy',
    brand: 'Pure Dairy',
    unit: '500ml',
    inStock: true,
    rating: 4.7,
    reviewCount: 89,
    tags: ['fresh', 'dairy', 'organic']
  }
];

const sampleCategories = [
  {
    id: '1',
    name: 'Fruits & Vegetables',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=300',
    icon: '🥬',
    productCount: 120
  },
  {
    id: '2',
    name: 'Dairy & Eggs',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300',
    icon: '🥛',
    productCount: 45
  },
  {
    id: '3',
    name: 'Bakery',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300',
    icon: '🍞',
    productCount: 78
  }
];

// Get all products with pagination and filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      category, 
      search, 
      sortBy = 'name',
      sortOrder = 'asc',
      minPrice,
      maxPrice,
      inStock
    } = req.query;

    let filteredProducts = [...sampleProducts];

    // Filter by category
    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }

    // Filter by search query
    if (search) {
      const searchLower = (search as string).toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Filter by price range
    if (minPrice) {
      filteredProducts = filteredProducts.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      filteredProducts = filteredProducts.filter(p => p.price <= Number(maxPrice));
    }

    // Filter by stock
    if (inStock === 'true') {
      filteredProducts = filteredProducts.filter(p => p.inStock);
    }

    // Sort products
    filteredProducts.sort((a, b) => {
      let aValue: any = a[sortBy as keyof typeof a];
      let bValue: any = b[sortBy as keyof typeof b];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'desc') {
        return aValue < bValue ? 1 : -1;
      }
      return aValue > bValue ? 1 : -1;
    });

    // Pagination
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    res.json({
      products: paginatedProducts,
      pagination: {
        current: Number(page),
        limit: Number(limit),
        total: filteredProducts.length,
        pages: Math.ceil(filteredProducts.length / Number(limit))
      },
      filters: {
        category,
        search,
        sortBy,
        sortOrder,
        minPrice,
        maxPrice,
        inStock
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get product by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = sampleProducts.find(p => p.id === id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all categories
router.get('/categories/list', async (req: Request, res: Response) => {
  try {
    res.json({
      categories: sampleCategories,
      total: sampleCategories.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get featured products
router.get('/featured/list', async (req: Request, res: Response) => {
  try {
    const featuredProducts = sampleProducts.filter(p => p.rating >= 4.5);
    res.json({
      products: featuredProducts,
      total: featuredProducts.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get recommendations (would use ML in production)
router.get('/recommendations/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    // Simple recommendation logic for demo
    const recommendations = sampleProducts
      .sort(() => 0.5 - Math.random())
      .slice(0, 8);
    
    res.json({
      products: recommendations,
      total: recommendations.length,
      userId
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search suggestions
router.get('/search/suggestions', async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    
    if (!q || (q as string).length < 2) {
      return res.json({ suggestions: [] });
    }
    
    const query = (q as string).toLowerCase();
    const suggestions = new Set<string>();
    
    // Add product name matches
    sampleProducts.forEach(product => {
      if (product.name.toLowerCase().includes(query)) {
        suggestions.add(product.name);
      }
      
      // Add tag matches
      product.tags.forEach(tag => {
        if (tag.toLowerCase().includes(query)) {
          suggestions.add(tag);
        }
      });
    });
    
    // Add category matches
    sampleCategories.forEach(category => {
      if (category.name.toLowerCase().includes(query)) {
        suggestions.add(category.name);
      }
    });
    
    res.json({
      suggestions: Array.from(suggestions).slice(0, 10)
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 