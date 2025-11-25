import express from 'express';
import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import prisma from '../lib/prisma';

const router = express.Router();

// Get all products with pagination, search, sort, and filters
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const {
    page = '1',
    limit = '20',
    category,
    search,
    sortBy = 'name',
    sortOrder = 'asc',
    minPrice,
    maxPrice,
    inStock,
  } = req.query;

  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const skip = (pageNum - 1) * limitNum;

  // Build where clause
  const where: any = {};

  // Filter by category (slug)
  if (category) {
    const categoryRecord = await prisma.category.findUnique({
      where: { slug: category as string },
    });
    if (categoryRecord) {
      where.categoryId = categoryRecord.id;
    } else {
      // Return empty result if category not found
      return res.json({
        products: [],
        pagination: {
          current: pageNum,
          limit: limitNum,
          total: 0,
          pages: 0,
        },
        filters: {
          category,
          search,
          sortBy,
          sortOrder,
          minPrice,
          maxPrice,
          inStock,
        },
      });
    }
  }

  // Search filter
  if (search) {
    where.OR = [
      { name: { contains: search as string, mode: 'insensitive' } },
      { description: { contains: search as string, mode: 'insensitive' } },
      { tags: { has: search as string } },
    ];
  }

  // Price range filter
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) {
      where.price.gte = parseFloat(minPrice as string);
    }
    if (maxPrice) {
      where.price.lte = parseFloat(maxPrice as string);
    }
  }

  // Stock filter
  if (inStock === 'true') {
    where.inStock = true;
  }

  // Build orderBy clause
  let orderBy: any = {};
  const validSortFields = ['name', 'price', 'rating', 'createdAt', 'reviewCount'];
  const sortByStr = sortBy as string;
  const sortField = validSortFields.includes(sortByStr) ? sortByStr : 'name';
  const sortDirection = sortOrder === 'desc' ? 'desc' : 'asc';
  orderBy[sortField] = sortDirection;

  // Get total count for pagination
  const total = await prisma.product.count({ where });

  // Fetch products
  const products = await prisma.product.findMany({
    where,
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          icon: true,
        },
      },
    },
    orderBy,
    skip,
    take: limitNum,
  });

  res.json({
    products,
    pagination: {
      current: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    },
    filters: {
      category,
      search,
      sortBy,
      sortOrder,
      minPrice,
      maxPrice,
      inStock,
    },
  });
}));

// Get product by ID or slug
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Try to find by ID first, then by slug
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { id },
        { slug: id },
      ],
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          icon: true,
          image: true,
        },
      },
    },
  });

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json(product);
}));

// Get all categories
router.get('/categories/list', asyncHandler(async (req: Request, res: Response) => {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });

  res.json({
    categories,
    total: categories.length,
  });
}));

// Get featured products (high rating)
router.get('/featured/list', asyncHandler(async (req: Request, res: Response) => {
  const { limit = '8' } = req.query;
  const limitNum = parseInt(limit as string, 10);

  const products = await prisma.product.findMany({
    where: {
      rating: { gte: 4.5 },
      inStock: true,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          icon: true,
        },
      },
    },
    orderBy: { rating: 'desc' },
    take: limitNum,
  });

  res.json({
    products,
    total: products.length,
  });
}));

// Get recommendations (would use ML in production)
router.get('/recommendations/:userId', asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { limit = '8' } = req.query;
  const limitNum = parseInt(limit as string, 10);

  // Simple recommendation logic: get random products with good ratings
  // In production, this would use ML based on user's order history
  const totalProducts = await prisma.product.count({
    where: { inStock: true, rating: { gte: 4.0 } },
  });

  const skip = Math.floor(Math.random() * Math.max(0, totalProducts - limitNum));

  const products = await prisma.product.findMany({
    where: {
      inStock: true,
      rating: { gte: 4.0 },
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          icon: true,
        },
      },
    },
    skip,
    take: limitNum,
  });

  res.json({
    products,
    total: products.length,
    userId,
  });
}));

// Search suggestions
router.get('/search/suggestions', asyncHandler(async (req: Request, res: Response) => {
  const { q } = req.query;

  if (!q || (q as string).length < 2) {
    return res.json({ suggestions: [] });
  }

  const query = (q as string).toLowerCase();
  const suggestions = new Set<string>();

  // Get product name matches
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { tags: { has: query } },
      ],
    },
    select: { name: true, tags: true },
    take: 10,
  });

  products.forEach((product) => {
    if (product.name.toLowerCase().includes(query)) {
      suggestions.add(product.name);
    }
    product.tags.forEach((tag) => {
      if (tag.toLowerCase().includes(query)) {
        suggestions.add(tag);
      }
    });
  });

  // Get category matches
  const categories = await prisma.category.findMany({
    where: {
      name: { contains: query, mode: 'insensitive' },
    },
    select: { name: true },
    take: 5,
  });

  categories.forEach((category) => {
    suggestions.add(category.name);
  });

  res.json({
    suggestions: Array.from(suggestions).slice(0, 10),
  });
}));

export default router;
