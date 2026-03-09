import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  // Create categories matching header menu
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Beauty & Cosmetics',
        slug: 'beauty-cosmetics',
        description: 'Skincare, cosmetics, and personal care products',
        icon: '💄',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Grocery',
        slug: 'grocery',
        description: 'Spices, staples, grains, and daily essentials',
        icon: '🛒',
        image: 'https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=300',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Stationery',
        slug: 'stationery',
        description: 'Pens, notebooks, and office supplies',
        icon: '📝',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Fruits & Vegetables',
        slug: 'fruits-vegetables',
        description: 'Fresh fruits and vegetables',
        icon: '🍎',
        image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=300',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Outdoor',
        slug: 'outdoor',
        description: 'Camping gear and outdoor supplies',
        icon: '⛺',
        image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=300',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Household',
        slug: 'household',
        description: 'Cleaning supplies and home essentials',
        icon: '🏠',
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Snacks & Refreshments',
        slug: 'snacks',
        description: 'Chips, cookies, beverages, and snacks',
        icon: '🥤',
        image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=300',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Dairy & Eggs',
        slug: 'dairy-eggs',
        description: 'Fresh dairy products and eggs',
        icon: '🥛',
        image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Roastery',
        slug: 'roastery',
        description: 'Coffee beans, roasted nuts, and tea',
        icon: '☕',
        image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=300',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Fishery',
        slug: 'fishery',
        description: 'Fresh and frozen seafood',
        icon: '🐟',
        image: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=300',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Bakery',
        slug: 'bakery',
        description: 'Fresh baked goods',
        icon: '🍞',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Delicatessen',
        slug: 'delicatessen',
        description: 'Cold cuts, cheese, and prepared foods',
        icon: '🥗',
        image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Butchery',
        slug: 'butchery',
        description: 'Fresh meat and poultry',
        icon: '🥩',
        image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=300',
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // Create products with real-time data
  const products = [
    // Beauty & Cosmetics
    {
      name: 'Vitamin C Face Serum',
      slug: 'vitamin-c-face-serum',
      description: 'Brightening serum with Vitamin C for glowing skin',
      price: 899,
      originalPrice: 1299,
      image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300',
      images: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300'],
      categoryId: categories[0].id, // Beauty & Cosmetics
      brand: 'Glow Skin',
      unit: '30ml',
      inStock: true,
      stockQuantity: 50,
      rating: 4.6,
      reviewCount: 234,
      tags: ['skincare', 'face care', 'vitamin c', 'serum'],
    },
    {
      name: 'Matte Lipstick Set',
      slug: 'matte-lipstick-set',
      description: 'Long-lasting matte lipstick in 6 shades',
      price: 599,
      originalPrice: 899,
      image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300',
      images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300'],
      categoryId: categories[0].id,
      brand: 'ColorPop',
      unit: '6 pieces',
      inStock: true,
      stockQuantity: 30,
      rating: 4.5,
      reviewCount: 189,
      tags: ['cosmetics', 'lipstick', 'makeup', 'matte'],
    },
    {
      name: 'Baby Shampoo & Body Wash',
      slug: 'baby-shampoo-body-wash',
      description: 'Gentle tear-free formula for babies',
      price: 249,
      image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=300',
      images: ['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=300'],
      categoryId: categories[0].id,
      brand: 'Baby Care',
      unit: '400ml',
      inStock: true,
      stockQuantity: 75,
      rating: 4.7,
      reviewCount: 456,
      tags: ['baby care', 'shampoo', 'body wash', 'gentle'],
    },
    
    // Grocery
    {
      name: 'Basmati Rice Premium',
      slug: 'basmati-rice-premium',
      description: 'Premium long grain basmati rice',
      price: 450,
      originalPrice: 550,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300',
      images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300'],
      categoryId: categories[1].id, // Grocery
      brand: 'India Gate',
      unit: '5kg',
      inStock: true,
      stockQuantity: 100,
      rating: 4.8,
      reviewCount: 1234,
      tags: ['staples', 'grains', 'rice', 'basmati'],
    },
    {
      name: 'Turmeric Powder',
      slug: 'turmeric-powder',
      description: 'Pure turmeric powder with high curcumin',
      price: 85,
      image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=300',
      images: ['https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=300'],
      categoryId: categories[1].id,
      brand: 'Everest',
      unit: '200g',
      inStock: true,
      stockQuantity: 200,
      rating: 4.5,
      reviewCount: 567,
      tags: ['spices', 'masalas', 'turmeric', 'cooking ingredients'],
    },
    {
      name: 'Red Chili Powder',
      slug: 'red-chili-powder',
      description: 'Spicy red chili powder from Guntur',
      price: 120,
      image: 'https://images.unsplash.com/photo-1604917454745-21e44c92d310?w=300',
      images: ['https://images.unsplash.com/photo-1604917454745-21e44c92d310?w=300'],
      categoryId: categories[1].id,
      brand: 'MDH',
      unit: '200g',
      inStock: true,
      stockQuantity: 150,
      rating: 4.4,
      reviewCount: 445,
      tags: ['spices', 'masalas', 'chili', 'spicy'],
    },
    {
      name: 'Toor Dal',
      slug: 'toor-dal',
      description: 'Premium quality toor dal (pigeon peas)',
      price: 180,
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300',
      images: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300'],
      categoryId: categories[1].id,
      brand: 'Tata Sampann',
      unit: '1kg',
      inStock: true,
      stockQuantity: 80,
      rating: 4.6,
      reviewCount: 678,
      tags: ['staples', 'grains', 'pulses', 'dal'],
    },
    
    // Stationery
    {
      name: 'Gel Pen Set',
      slug: 'gel-pen-set',
      description: 'Smooth writing gel pens in 12 colors',
      price: 199,
      originalPrice: 299,
      image: 'https://images.unsplash.com/photo-1583484963886-cfe2bffc5b8c?w=300',
      images: ['https://images.unsplash.com/photo-1583484963886-cfe2bffc5b8c?w=300'],
      categoryId: categories[2].id, // Stationery
      brand: 'Pilot',
      unit: '12 pieces',
      inStock: true,
      stockQuantity: 60,
      rating: 4.7,
      reviewCount: 345,
      tags: ['pens', 'pencils', 'office supplies', 'school supplies'],
    },
    {
      name: 'Spiral Notebook Set',
      slug: 'spiral-notebook-set',
      description: 'College ruled spiral notebooks',
      price: 299,
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300',
      images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300'],
      categoryId: categories[2].id,
      brand: 'Classmate',
      unit: '3 pieces',
      inStock: true,
      stockQuantity: 40,
      rating: 4.5,
      reviewCount: 234,
      tags: ['notebooks', 'office supplies', 'school supplies'],
    },
    
    // Fruits & Vegetables
    {
      name: 'Fresh Bananas',
      slug: 'fresh-bananas',
      description: 'Premium quality bananas, rich in potassium',
      price: 60,
      originalPrice: 80,
      image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=300',
      images: ['https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=300'],
      categoryId: categories[3].id, // Fruits & Vegetables
      brand: 'Fresh Farms',
      unit: '1 kg',
      inStock: true,
      stockQuantity: 100,
      rating: 4.5,
      reviewCount: 234,
      tags: ['fresh fruits', 'organic', 'healthy'],
    },
    {
      name: 'Organic Tomatoes',
      slug: 'organic-tomatoes',
      description: 'Fresh organic tomatoes',
      price: 50,
      originalPrice: 65,
      image: 'https://images.unsplash.com/photo-1546470427-e26264be0b28?w=300',
      images: ['https://images.unsplash.com/photo-1546470427-e26264be0b28?w=300'],
      categoryId: categories[3].id,
      brand: 'Organic Valley',
      unit: '500g',
      inStock: true,
      stockQuantity: 75,
      rating: 4.6,
      reviewCount: 312,
      tags: ['fresh vegetables', 'organic produce', 'vegetables'],
    },
    {
      name: 'Fresh Strawberries',
      slug: 'fresh-strawberries',
      description: 'Sweet and fresh strawberries',
      price: 150,
      originalPrice: 180,
      image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=300',
      images: ['https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=300'],
      categoryId: categories[3].id,
      brand: 'Berry Fresh',
      unit: '250g',
      inStock: true,
      stockQuantity: 40,
      rating: 4.9,
      reviewCount: 289,
      tags: ['fresh fruits', 'exotic fruits', 'sweet'],
    },
    
    // Snacks & Refreshments
    {
      name: 'Potato Chips',
      slug: 'potato-chips',
      description: 'Crispy potato chips',
      price: 25,
      image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=300',
      images: ['https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=300'],
      categoryId: categories[6].id, // Snacks
      brand: 'Lays',
      unit: '150g',
      inStock: true,
      stockQuantity: 300,
      rating: 4.3,
      reviewCount: 567,
      tags: ['chips', 'crackers', 'snacks', 'crispy'],
    },
    {
      name: 'Orange Juice',
      slug: 'orange-juice',
      description: '100% pure orange juice',
      price: 120,
      originalPrice: 150,
      image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300',
      images: ['https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300'],
      categoryId: categories[6].id,
      brand: 'Tropicana',
      unit: '1L',
      inStock: true,
      stockQuantity: 60,
      rating: 4.4,
      reviewCount: 178,
      tags: ['beverages', 'juices', 'fresh', 'healthy'],
    },
    
    // Dairy & Eggs
    {
      name: 'Farm Fresh Milk',
      slug: 'farm-fresh-milk',
      description: 'Pure and fresh cow milk',
      price: 30,
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300',
      images: ['https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300'],
      categoryId: categories[7].id, // Dairy
      brand: 'Amul',
      unit: '500ml',
      inStock: true,
      stockQuantity: 200,
      rating: 4.7,
      reviewCount: 89,
      tags: ['milk products', 'fresh', 'dairy', 'organic'],
    },
    {
      name: 'Fresh Eggs',
      slug: 'fresh-eggs',
      description: 'Farm fresh eggs',
      price: 80,
      image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300',
      images: ['https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300'],
      categoryId: categories[7].id,
      brand: 'Farm Fresh',
      unit: '12 pieces',
      inStock: true,
      stockQuantity: 150,
      rating: 4.8,
      reviewCount: 445,
      tags: ['eggs', 'fresh', 'protein'],
    },
    
    // Bakery
    {
      name: 'Whole Wheat Bread',
      slug: 'whole-wheat-bread',
      description: 'Freshly baked whole wheat bread',
      price: 45,
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300',
      images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300'],
      categoryId: categories[10].id, // Bakery
      brand: "Baker's Choice",
      unit: '500g',
      inStock: true,
      stockQuantity: 50,
      rating: 4.2,
      reviewCount: 156,
      tags: ['fresh bread', 'healthy', 'wheat'],
    },
  ];

  await prisma.product.createMany({ data: products });
  console.log(`✅ Created ${products.length} products`);

  // Update category product counts
  for (const category of categories) {
    const count = await prisma.product.count({
      where: { categoryId: category.id },
    });
    await prisma.category.update({
      where: { id: category.id },
      data: { productCount: count },
    });
  }

  // Create test user
  const hashedPassword = await bcrypt.hash('password123', 12);
  const user = await prisma.user.create({
    data: {
      email: 'john@example.com',
      phone: '+91 9876543210',
      name: 'John Doe',
      password: hashedPassword,
      isInstamartPlus: false,
      addresses: {
        create: {
          type: 'home',
          address: '123 MG Road, Bangalore',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560001',
          country: 'India',
          coordinates: { lat: 12.9716, lng: 77.5946 },
          isDefault: true,
        },
      },
    },
  });

  console.log(`✅ Created test user: ${user.email}`);
  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

