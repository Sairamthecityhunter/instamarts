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

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Fruits & Vegetables',
        slug: 'fruits-vegetables',
        description: 'Fresh fruits and vegetables',
        icon: '🥬',
        image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=300',
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
        name: 'Bakery',
        slug: 'bakery',
        description: 'Fresh baked goods',
        icon: '🍞',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Beverages',
        slug: 'beverages',
        description: 'Drinks and beverages',
        icon: '🥤',
        image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Snacks',
        slug: 'snacks',
        description: 'Chips, cookies, and snacks',
        icon: '🍪',
        image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=300',
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // Create products
  const products = [
    {
      name: 'Fresh Bananas',
      slug: 'fresh-bananas',
      description: 'Premium quality bananas, rich in potassium',
      price: 60,
      originalPrice: 80,
      image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=300',
      images: [
        'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=300',
      ],
      categoryId: categories[0].id,
      brand: 'Fresh Farms',
      unit: '1 kg',
      inStock: true,
      stockQuantity: 100,
      rating: 4.5,
      reviewCount: 234,
      tags: ['fresh', 'organic', 'healthy'],
    },
    {
      name: 'Whole Wheat Bread',
      slug: 'whole-wheat-bread',
      description: 'Freshly baked whole wheat bread',
      price: 45,
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300',
      images: [
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300',
      ],
      categoryId: categories[2].id,
      brand: "Baker's Choice",
      unit: '500g',
      inStock: true,
      stockQuantity: 50,
      rating: 4.2,
      reviewCount: 156,
      tags: ['fresh', 'healthy', 'wheat'],
    },
    {
      name: 'Farm Fresh Milk',
      slug: 'farm-fresh-milk',
      description: 'Pure and fresh cow milk',
      price: 30,
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300',
      images: [
        'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300',
      ],
      categoryId: categories[1].id,
      brand: 'Pure Dairy',
      unit: '500ml',
      inStock: true,
      stockQuantity: 200,
      rating: 4.7,
      reviewCount: 89,
      tags: ['fresh', 'dairy', 'organic'],
    },
    {
      name: 'Organic Tomatoes',
      slug: 'organic-tomatoes',
      description: 'Fresh organic tomatoes',
      price: 50,
      originalPrice: 65,
      image: 'https://images.unsplash.com/photo-1546470427-e26264be0b28?w=300',
      images: [
        'https://images.unsplash.com/photo-1546470427-e26264be0b28?w=300',
      ],
      categoryId: categories[0].id,
      brand: 'Organic Valley',
      unit: '500g',
      inStock: true,
      stockQuantity: 75,
      rating: 4.6,
      reviewCount: 312,
      tags: ['fresh', 'organic', 'vegetables'],
    },
    {
      name: 'Fresh Eggs',
      slug: 'fresh-eggs',
      description: 'Farm fresh eggs',
      price: 80,
      image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300',
      images: [
        'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300',
      ],
      categoryId: categories[1].id,
      brand: 'Farm Fresh',
      unit: '12 pieces',
      inStock: true,
      stockQuantity: 150,
      rating: 4.8,
      reviewCount: 445,
      tags: ['fresh', 'eggs', 'protein'],
    },
    {
      name: 'Orange Juice',
      slug: 'orange-juice',
      description: '100% pure orange juice',
      price: 120,
      originalPrice: 150,
      image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300',
      images: [
        'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300',
      ],
      categoryId: categories[3].id,
      brand: 'Fresh Squeezed',
      unit: '1L',
      inStock: true,
      stockQuantity: 60,
      rating: 4.4,
      reviewCount: 178,
      tags: ['juice', 'fresh', 'healthy'],
    },
    {
      name: 'Potato Chips',
      slug: 'potato-chips',
      description: 'Crispy potato chips',
      price: 25,
      image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=300',
      images: [
        'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=300',
      ],
      categoryId: categories[4].id,
      brand: 'Crunchy',
      unit: '150g',
      inStock: true,
      stockQuantity: 300,
      rating: 4.3,
      reviewCount: 567,
      tags: ['snacks', 'chips', 'crispy'],
    },
    {
      name: 'Fresh Strawberries',
      slug: 'fresh-strawberries',
      description: 'Sweet and fresh strawberries',
      price: 150,
      originalPrice: 180,
      image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=300',
      images: [
        'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=300',
      ],
      categoryId: categories[0].id,
      brand: 'Berry Fresh',
      unit: '250g',
      inStock: true,
      stockQuantity: 40,
      rating: 4.9,
      reviewCount: 289,
      tags: ['fresh', 'fruits', 'sweet'],
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

