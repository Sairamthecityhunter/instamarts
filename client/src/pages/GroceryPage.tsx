import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import GroceryItemDetail from '../components/Grocery/GroceryItemDetail';

interface GroceryItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  subcategory: string;
  brand: string;
  unit: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
  weight?: string;
  expiry?: string;
  organic?: boolean;
  glutenFree?: boolean;
  vegan?: boolean;
  storeId?: string;
  storeName?: string;
}

interface GroceryCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  itemCount: number;
  subcategories: string[];
}

const GroceryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const dispatch = useDispatch();
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [categories, setCategories] = useState<GroceryCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    organic: false,
    glutenFree: false,
    vegan: false,
    inStock: false,
    minPrice: '',
    maxPrice: ''
  });
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<GroceryItem | null>(null);
  const [showItemDetail, setShowItemDetail] = useState(false);

  useEffect(() => {
    loadGroceryData();
  }, []);

  const loadGroceryData = async () => {
    setLoading(true);
    try {
      // Indian Grocery Categories as per PRD
      const mockCategories: GroceryCategory[] = [
        {
          id: 'staples',
          name: '🌾 Staples & Grains',
          icon: '🌾',
          description: 'Rice, wheat flour, lentils, cooking oils',
          itemCount: 85,
          subcategories: ['Rice', 'Flour', 'Lentils', 'Cooking Oils', 'Sugar & Jaggery']
        },
        {
          id: 'spices',
          name: '🌶️ Spices & Masalas',
          icon: '🌶️',
          description: 'Whole spices, ground spices, spice mixes',
          itemCount: 120,
          subcategories: ['Whole Spices', 'Ground Spices', 'Garam Masala', 'Regional Masalas', 'Organic Spices']
        },
        {
          id: 'snacks',
          name: '🥨 Snacks & Namkeens',
          icon: '🥨',
          description: 'Traditional Indian snacks, namkeens, sweets',
          itemCount: 95,
          subcategories: ['Namkeens', 'Chips & Crackers', 'Traditional Sweets', 'Dry Fruits', 'Chocolates']
        },
        {
          id: 'fresh-produce',
          name: '🥬 Fresh Produce',
          icon: '🥬',
          description: 'Vegetables, fruits, herbs used in Indian cooking',
          itemCount: 75,
          subcategories: ['Vegetables', 'Fruits', 'Fresh Herbs', 'Exotic Vegetables', 'Organic Produce']
        },
        {
          id: 'dairy',
          name: '🥛 Dairy & Alternatives',
          icon: '🥛',
          description: 'Milk, yogurt, paneer, traditional dairy products',
          itemCount: 45,
          subcategories: ['Milk', 'Yogurt & Curd', 'Paneer & Cheese', 'Butter & Ghee', 'Plant-based Alternatives']
        },
        {
          id: 'beverages',
          name: '☕ Beverages',
          icon: '☕',
          description: 'Tea, coffee, traditional drinks',
          itemCount: 65,
          subcategories: ['Tea', 'Coffee', 'Traditional Drinks', 'Health Drinks', 'Juices']
        },
        {
          id: 'personal-care',
          name: '🧴 Personal Care',
          icon: '🧴',
          description: 'Ayurvedic products, traditional beauty items',
          itemCount: 55,
          subcategories: ['Ayurvedic Products', 'Hair Care', 'Skin Care', 'Oral Care', 'Traditional Beauty']
        },
        {
          id: 'kitchenware',
          name: '🍳 Kitchenware',
          icon: '🍳',
          description: 'Traditional cooking utensils, appliances',
          itemCount: 35,
          subcategories: ['Cookware', 'Storage Containers', 'Kitchen Tools', 'Traditional Utensils', 'Appliances']
        }
      ];

      // Sample Indian grocery items with comprehensive authentic products
      const mockItems: GroceryItem[] = [
        // ===== SPICES & MASALAS =====
        {
          id: '1',
          name: 'Cardamom Green Pods',
          description: 'Premium quality green cardamom pods from Kerala hills',
          price: 450,
          originalPrice: 500,
          image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300',
          category: 'spices',
          subcategory: 'Whole Spices',
          brand: 'Everest',
          unit: '50g',
          inStock: true,
          rating: 4.7,
          reviewCount: 892,
          tags: ['Premium', 'Kerala', 'Aromatic'],
          organic: true
        },
        {
          id: '2',
          name: 'Black Pepper Whole',
          description: 'World-renowned black peppercorns from Malabar coast',
          price: 320,
          image: 'https://images.unsplash.com/photo-1505798577917-a65157d3353a?w=300',
          category: 'spices',
          subcategory: 'Whole Spices',
          brand: 'MDH',
          unit: '100g',
          inStock: true,
          rating: 4.6,
          reviewCount: 567,
          tags: ['Malabar', 'Premium', 'Fresh']
        },
        {
          id: '3',
          name: 'Turmeric Powder',
          description: 'Pure turmeric powder with high curcumin content',
          price: 85,
          image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=300',
          category: 'spices',
          subcategory: 'Ground Spices',
          brand: 'Badshah',
          unit: '200g',
          inStock: true,
          rating: 4.5,
          reviewCount: 1245,
          tags: ['Pure', 'High Curcumin', 'Anti-inflammatory']
        },
        {
          id: '4',
          name: 'Garam Masala Blend',
          description: 'Authentic blend of aromatic spices for Indian cooking',
          price: 95,
          originalPrice: 110,
          image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300',
          category: 'spices',
          subcategory: 'Garam Masala',
          brand: 'MDH',
          unit: '100g',
          inStock: true,
          rating: 4.4,
          reviewCount: 856,
          tags: ['Authentic', 'Fresh', 'Traditional']
        },
        {
          id: '5',
          name: 'Cumin Seeds (Jeera)',
          description: 'Fresh cumin seeds with strong aroma',
          price: 180,
          image: 'https://images.unsplash.com/photo-1599909151466-de8f96a538a3?w=300',
          category: 'spices',
          subcategory: 'Whole Spices',
          brand: 'Everest',
          unit: '200g',
          inStock: true,
          rating: 4.3,
          reviewCount: 445,
          tags: ['Fresh', 'Aromatic', 'Premium']
        },
        {
          id: '6',
          name: 'Coriander Powder',
          description: 'Freshly ground coriander seeds',
          price: 65,
          image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=300',
          category: 'spices',
          subcategory: 'Ground Spices',
          brand: 'Red Label',
          unit: '200g',
          inStock: true,
          rating: 4.2,
          reviewCount: 334,
          tags: ['Fresh Ground', 'Daily Use']
        },
        {
          id: '7',
          name: 'Red Chili Powder',
          description: 'Spicy red chili powder from Guntur',
          price: 120,
          image: 'https://images.unsplash.com/photo-1604917454745-21e44c92d310?w=300',
          category: 'spices',
          subcategory: 'Ground Spices',
          brand: 'Everest',
          unit: '200g',
          inStock: true,
          rating: 4.4,
          reviewCount: 789,
          tags: ['Guntur', 'Spicy', 'Authentic']
        },

        // ===== RICE & GRAINS =====
        {
          id: '8',
          name: 'Basmati Rice Premium Aged',
          description: 'Premium quality aged basmati rice with long grains',
          price: 285,
          originalPrice: 320,
          image: 'https://images.unsplash.com/photo-1586201375761-83865001e8c3?w=300',
          category: 'staples',
          subcategory: 'Rice',
          brand: 'India Gate',
          unit: '5kg',
          inStock: true,
          rating: 4.6,
          reviewCount: 1248,
          tags: ['Premium', 'Aged', 'Aromatic'],
          organic: true
        },
        {
          id: '9',
          name: 'Sona Masoori Rice',
          description: 'Premium non-basmati rice, perfect for South Indian dishes',
          price: 180,
          image: 'https://images.unsplash.com/photo-1586201375761-83865001e8c3?w=300',
          category: 'staples',
          subcategory: 'Rice',
          brand: 'Daawat',
          unit: '5kg',
          inStock: true,
          rating: 4.3,
          reviewCount: 567,
          tags: ['South Indian', 'Premium', 'Non-sticky']
        },
        {
          id: '10',
          name: 'Ponni Rice',
          description: 'Traditional Tamil Nadu rice variety',
          price: 155,
          image: 'https://images.unsplash.com/photo-1586201375761-83865001e8c3?w=300',
          category: 'staples',
          subcategory: 'Rice',
          brand: 'Aachi',
          unit: '5kg',
          inStock: true,
          rating: 4.2,
          reviewCount: 432,
          tags: ['Traditional', 'Tamil Nadu', 'Premium']
        },

        // ===== LENTILS & PULSES =====
        {
          id: '11',
          name: 'Toor Dal (Arhar)',
          description: 'High-quality pigeon peas, rich in protein',
          price: 135,
          image: 'https://images.unsplash.com/photo-1599909151466-de8f96a538a3?w=300',
          category: 'staples',
          subcategory: 'Lentils',
          brand: 'Organic Tattva',
          unit: '1kg',
          inStock: true,
          rating: 4.3,
          reviewCount: 432,
          tags: ['Protein Rich', 'Organic'],
          organic: true
        },
        {
          id: '12',
          name: 'Moong Dal (Split)',
          description: 'Yellow split mung beans, easy to digest',
          price: 110,
          image: 'https://images.unsplash.com/photo-1599909151466-de8f96a538a3?w=300',
          category: 'staples',
          subcategory: 'Lentils',
          brand: 'Tata Sampann',
          unit: '1kg',
          inStock: true,
          rating: 4.4,
          reviewCount: 356,
          tags: ['Easy Digest', 'Protein Rich']
        },
        {
          id: '13',
          name: 'Chana Dal',
          description: 'Split Bengal gram, perfect for Indian preparations',
          price: 125,
          image: 'https://images.unsplash.com/photo-1599909151466-de8f96a538a3?w=300',
          category: 'staples',
          subcategory: 'Lentils',
          brand: 'Ashirvaad',
          unit: '1kg',
          inStock: true,
          rating: 4.2,
          reviewCount: 278,
          tags: ['Bengal Gram', 'High Protein']
        },
        {
          id: '14',
          name: 'Black Urad Dal',
          description: 'Whole black gram for dal makhani and dosa',
          price: 145,
          image: 'https://images.unsplash.com/photo-1599909151466-de8f96a538a3?w=300',
          category: 'staples',
          subcategory: 'Lentils',
          brand: 'Pro Nature',
          unit: '1kg',
          inStock: true,
          rating: 4.3,
          reviewCount: 189,
          tags: ['Whole Gram', 'Dal Makhani']
        },
        {
          id: '15',
          name: 'Rajma (Kidney Beans)',
          description: 'Premium red kidney beans from Kashmir',
          price: 165,
          image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300',
          category: 'staples',
          subcategory: 'Lentils',
          brand: 'Organic India',
          unit: '1kg',
          inStock: true,
          rating: 4.5,
          reviewCount: 423,
          tags: ['Kashmir', 'Premium', 'Organic']
        },
        {
          id: '16',
          name: 'Chickpeas (Kabuli Chana)',
          description: 'Large white chickpeas, perfect for chole',
          price: 140,
          image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300',
          category: 'staples',
          subcategory: 'Lentils',
          brand: 'Fortune',
          unit: '1kg',
          inStock: true,
          rating: 4.1,
          reviewCount: 267,
          tags: ['Large', 'White', 'Chole']
        },

        // ===== EDIBLE OILS & GHEE =====
        {
          id: '17',
          name: 'Pure Ghee (Clarified Butter)',
          description: 'Traditional A2 cow ghee, made from pure milk',
          price: 650,
          originalPrice: 720,
          image: 'https://images.unsplash.com/photo-1609501676725-7186f66edcd7?w=300',
          category: 'staples',
          subcategory: 'Cooking Oils',
          brand: 'Amul',
          unit: '1L',
          inStock: true,
          rating: 4.7,
          reviewCount: 1567,
          tags: ['A2 Cow', 'Pure', 'Traditional']
        },
        {
          id: '18',
          name: 'Mustard Oil',
          description: 'Cold-pressed mustard oil with strong flavor',
          price: 285,
          image: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=300',
          category: 'staples',
          subcategory: 'Cooking Oils',
          brand: 'Dhara',
          unit: '1L',
          inStock: true,
          rating: 4.3,
          reviewCount: 445,
          tags: ['Cold Pressed', 'Strong Flavor', 'Traditional']
        },
        {
          id: '19',
          name: 'Coconut Oil Pure',
          description: 'Cold-pressed virgin coconut oil for cooking',
          price: 425,
          originalPrice: 450,
          image: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=300',
          category: 'staples',
          subcategory: 'Cooking Oils',
          brand: 'Parachute',
          unit: '1L',
          inStock: true,
          rating: 4.6,
          reviewCount: 892,
          tags: ['Cold Pressed', 'Virgin', 'Pure'],
          organic: true
        },
        {
          id: '20',
          name: 'Sesame Oil (Til Oil)',
          description: 'Traditional sesame oil for authentic South Indian cooking',
          price: 320,
          image: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=300',
          category: 'staples',
          subcategory: 'Cooking Oils',
          brand: 'Idhayam',
          unit: '1L',
          inStock: true,
          rating: 4.4,
          reviewCount: 356,
          tags: ['Traditional', 'South Indian', 'Pure']
        },

        // ===== PACKAGED & READY-TO-EAT FOODS =====
        {
          id: '21',
          name: 'MTR Ready to Eat Sambar',
          description: 'Authentic South Indian sambar, ready in 2 minutes',
          price: 85,
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300',
          category: 'snacks',
          subcategory: 'Ready-to-eat',
          brand: 'MTR',
          unit: '300g',
          inStock: true,
          rating: 4.2,
          reviewCount: 234,
          tags: ['Ready to Eat', 'South Indian', 'Authentic']
        },
        {
          id: '22',
          name: 'Haldiram\'s Chole Bhature',
          description: 'Complete meal with chole and bhature',
          price: 120,
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300',
          category: 'snacks',
          subcategory: 'Ready-to-eat',
          brand: 'Haldiram\'s',
          unit: '300g',
          inStock: true,
          rating: 4.1,
          reviewCount: 189,
          tags: ['Complete Meal', 'North Indian', 'Tasty']
        },
        {
          id: '23',
          name: 'Instant Maggi Noodles',
          description: 'Classic 2-minute Maggi masala noodles',
          price: 45,
          image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300',
          category: 'snacks',
          subcategory: 'Instant Foods',
          brand: 'Maggi',
          unit: '280g (4 packs)',
          inStock: true,
          rating: 4.3,
          reviewCount: 2456,
          tags: ['2 Minute', 'Classic', 'Tasty']
        },

        // ===== SNACKS & NAMKEENS =====
        {
          id: '24',
          name: 'Haldiram\'s Aloo Bhujia',
          description: 'Crispy potato sticks with aromatic spices',
          price: 45,
          originalPrice: 50,
          image: 'https://images.unsplash.com/photo-1599599810694-57a2ca3bf6f1?w=300',
          category: 'snacks',
          subcategory: 'Namkeens',
          brand: 'Haldiram\'s',
          unit: '150g',
          inStock: true,
          rating: 4.4,
          reviewCount: 567,
          tags: ['Crispy', 'Spicy', 'Traditional']
        },
        {
          id: '25',
          name: 'Bikaji Bhel Puri Mix',
          description: 'Ready-to-eat bhel puri mix with chutneys',
          price: 65,
          image: 'https://images.unsplash.com/photo-1599599810694-57a2ca3bf6f1?w=300',
          category: 'snacks',
          subcategory: 'Namkeens',
          brand: 'Bikaji',
          unit: '150g',
          inStock: true,
          rating: 4.2,
          reviewCount: 323,
          tags: ['Street Food', 'Chatpata', 'Mumbai Style']
        },
        {
          id: '26',
          name: 'Kurkure Masala Munch',
          description: 'Crunchy corn puffs with masala flavor',
          price: 20,
          image: 'https://images.unsplash.com/photo-1599599810694-57a2ca3bf6f1?w=300',
          category: 'snacks',
          subcategory: 'Chips & Crackers',
          brand: 'Kurkure',
          unit: '55g',
          inStock: true,
          rating: 4.0,
          reviewCount: 890,
          tags: ['Crunchy', 'Masala', 'Kids Favorite']
        },
        {
          id: '27',
          name: 'Parle Monaco Biscuits',
          description: 'Salty crackers perfect for tea time',
          price: 35,
          image: 'https://images.unsplash.com/photo-1599599810694-57a2ca3bf6f1?w=300',
          category: 'snacks',
          subcategory: 'Biscuits',
          brand: 'Parle',
          unit: '200g',
          inStock: true,
          rating: 4.1,
          reviewCount: 445,
          tags: ['Salty', 'Tea Time', 'Classic']
        },

        // ===== TREE NUTS & DRIED FRUITS =====
        {
          id: '28',
          name: 'Cashews Premium',
          description: 'Large size cashews from Kerala',
          price: 850,
          originalPrice: 920,
          image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=300',
          category: 'snacks',
          subcategory: 'Dry Fruits',
          brand: 'Nutraj',
          unit: '500g',
          inStock: true,
          rating: 4.6,
          reviewCount: 678,
          tags: ['Premium', 'Kerala', 'Large Size']
        },
        {
          id: '29',
          name: 'Almonds California',
          description: 'Premium California almonds, rich in protein',
          price: 720,
          image: 'https://images.unsplash.com/photo-1508747718406-e3654b8443f5?w=300',
          category: 'snacks',
          subcategory: 'Dry Fruits',
          brand: 'Happilo',
          unit: '500g',
          inStock: true,
          rating: 4.5,
          reviewCount: 892,
          tags: ['California', 'Premium', 'Protein Rich']
        },
        {
          id: '30',
          name: 'Dates Medjool',
          description: 'Large, soft Medjool dates from Iran',
          price: 450,
          image: 'https://images.unsplash.com/photo-1577308856961-8e0ec50d6ad4?w=300',
          category: 'snacks',
          subcategory: 'Dry Fruits',
          brand: 'Nutraj',
          unit: '250g',
          inStock: true,
          rating: 4.4,
          reviewCount: 234,
          tags: ['Medjool', 'Soft', 'Natural Sweetener']
        },
        {
          id: '31',
          name: 'Raisins (Kishmish)',
          description: 'Sweet seedless raisins from Afghanistan',
          price: 285,
          image: 'https://images.unsplash.com/photo-1577308856961-8e0ec50d6ad4?w=300',
          category: 'snacks',
          subcategory: 'Dry Fruits',
          brand: 'Rostaa',
          unit: '500g',
          inStock: true,
          rating: 4.2,
          reviewCount: 356,
          tags: ['Seedless', 'Afghanistan', 'Sweet']
        },

        // ===== TEA & COFFEE =====
        {
          id: '32',
          name: 'Assam Tea Leaves CTC',
          description: 'Premium black tea from Assam gardens',
          price: 175,
          image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300',
          category: 'beverages',
          subcategory: 'Tea',
          brand: 'Tata Tea',
          unit: '500g',
          inStock: true,
          rating: 4.3,
          reviewCount: 345,
          tags: ['Premium', 'Strong', 'Assam']
        },
        {
          id: '33',
          name: 'Darjeeling Tea Premium',
          description: 'Finest Darjeeling tea with muscatel flavor',
          price: 650,
          originalPrice: 720,
          image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300',
          category: 'beverages',
          subcategory: 'Tea',
          brand: 'Twinings',
          unit: '200g',
          inStock: true,
          rating: 4.7,
          reviewCount: 234,
          tags: ['Darjeeling', 'Muscatel', 'Premium']
        },
        {
          id: '34',
          name: 'Filter Coffee Powder',
          description: 'Traditional South Indian filter coffee blend',
          price: 385,
          image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=300',
          category: 'beverages',
          subcategory: 'Coffee',
          brand: 'Narasu\'s',
          unit: '500g',
          inStock: true,
          rating: 4.5,
          reviewCount: 567,
          tags: ['South Indian', 'Filter', 'Traditional']
        },
        {
          id: '35',
          name: 'Green Tea Organic',
          description: 'Organic green tea with antioxidants',
          price: 285,
          image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300',
          category: 'beverages',
          subcategory: 'Tea',
          brand: 'Organic India',
          unit: '100g',
          inStock: true,
          rating: 4.4,
          reviewCount: 445,
          tags: ['Organic', 'Antioxidants', 'Health'],
          organic: true
        },

        // ===== FRESH FRUITS & VEGETABLES =====
        {
          id: '36',
          name: 'Fresh Mangoes Alphonso',
          description: 'King of mangoes from Maharashtra',
          price: 650,
          originalPrice: 720,
          image: 'https://images.unsplash.com/photo-1553279768-865429ffa5fb?w=300',
          category: 'fresh-produce',
          subcategory: 'Fruits',
          brand: 'Fresh Farm',
          unit: '1kg (4-5 pieces)',
          inStock: true,
          rating: 4.8,
          reviewCount: 1234,
          tags: ['Alphonso', 'King of Mangoes', 'Maharashtra']
        },
        {
          id: '37',
          name: 'Fresh Tomatoes',
          description: 'Farm fresh tomatoes, handpicked daily',
          price: 40,
          image: 'https://images.unsplash.com/photo-1546470427-e92bb2f8e4b0?w=300',
          category: 'fresh-produce',
          subcategory: 'Vegetables',
          brand: 'Fresh Farm',
          unit: '1kg',
          inStock: true,
          rating: 4.2,
          reviewCount: 234,
          tags: ['Fresh', 'Farm Direct']
        },
        {
          id: '38',
          name: 'Bitter Gourd (Karela)',
          description: 'Fresh bitter gourd, rich in nutrients',
          price: 85,
          image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=300',
          category: 'fresh-produce',
          subcategory: 'Vegetables',
          brand: 'Organic Farms',
          unit: '500g',
          inStock: true,
          rating: 3.9,
          reviewCount: 123,
          tags: ['Bitter', 'Nutritious', 'Indian Vegetable']
        },
        {
          id: '39',
          name: 'Okra (Bhindi)',
          description: 'Fresh okra, perfect for Indian curries',
          price: 65,
          image: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=300',
          category: 'fresh-produce',
          subcategory: 'Vegetables',
          brand: 'Green Valley',
          unit: '500g',
          inStock: true,
          rating: 4.1,
          reviewCount: 167,
          tags: ['Fresh', 'Indian Curry', 'Tender']
        },
        {
          id: '40',
          name: 'Guavas Fresh',
          description: 'Sweet and juicy guavas, rich in Vitamin C',
          price: 120,
          image: 'https://images.unsplash.com/photo-1586633114737-706bb89b9ad8?w=300',
          category: 'fresh-produce',
          subcategory: 'Fruits',
          brand: 'Tropical Fresh',
          unit: '1kg',
          inStock: true,
          rating: 4.3,
          reviewCount: 289,
          tags: ['Sweet', 'Vitamin C', 'Tropical']
        },

        // ===== DAIRY PRODUCTS =====
        {
          id: '41',
          name: 'Amul Fresh Paneer',
          description: 'Fresh cottage cheese, perfect for Indian curries',
          price: 85,
          image: 'https://images.unsplash.com/photo-1631452180519-8dd4f754e6b4?w=300',
          category: 'dairy',
          subcategory: 'Paneer & Cheese',
          brand: 'Amul',
          unit: '200g',
          inStock: true,
          rating: 4.5,
          reviewCount: 678,
          tags: ['Fresh', 'High Protein']
        },
        {
          id: '42',
          name: 'Amul Taza Milk',
          description: 'Fresh homogenized toned milk',
          price: 28,
          image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300',
          category: 'dairy',
          subcategory: 'Milk',
          brand: 'Amul',
          unit: '500ml',
          inStock: true,
          rating: 4.4,
          reviewCount: 2345,
          tags: ['Fresh', 'Homogenized', 'Toned']
        },
        {
          id: '43',
          name: 'Amul Curd (Dahi)',
          description: 'Fresh thick curd made from pure milk',
          price: 35,
          image: 'https://images.unsplash.com/photo-1571212515416-6ca18ce63a31?w=300',
          category: 'dairy',
          subcategory: 'Yogurt & Curd',
          brand: 'Amul',
          unit: '400g',
          inStock: true,
          rating: 4.3,
          reviewCount: 567,
          tags: ['Fresh', 'Thick', 'Pure Milk']
        },
        {
          id: '44',
          name: 'Amul Butter Salted',
          description: 'Premium quality salted butter',
          price: 65,
          image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=300',
          category: 'dairy',
          subcategory: 'Butter & Ghee',
          brand: 'Amul',
          unit: '100g',
          inStock: true,
          rating: 4.6,
          reviewCount: 1234,
          tags: ['Premium', 'Salted', 'Fresh']
        },

        // ===== SAUCES & CONDIMENTS =====
        {
          id: '45',
          name: 'Mango Pickle (Aam Ka Achar)',
          description: 'Traditional spicy mango pickle',
          price: 125,
          image: 'https://images.unsplash.com/photo-1599909151466-de8f96a538a3?w=300',
          category: 'snacks',
          subcategory: 'Pickles & Chutneys',
          brand: 'Priya',
          unit: '300g',
          inStock: true,
          rating: 4.4,
          reviewCount: 456,
          tags: ['Traditional', 'Spicy', 'Homestyle']
        },
        {
          id: '46',
          name: 'Lime Pickle',
          description: 'Tangy lime pickle with Indian spices',
          price: 95,
          image: 'https://images.unsplash.com/photo-1599909151466-de8f96a538a3?w=300',
          category: 'snacks',
          subcategory: 'Pickles & Chutneys',
          brand: 'Mother\'s Recipe',
          unit: '300g',
          inStock: true,
          rating: 4.2,
          reviewCount: 234,
          tags: ['Tangy', 'Traditional', 'Spicy']
        },
        {
          id: '47',
          name: 'Tamarind Paste',
          description: 'Concentrated tamarind paste for authentic flavor',
          price: 75,
          image: 'https://images.unsplash.com/photo-1599909151466-de8f96a538a3?w=300',
          category: 'spices',
          subcategory: 'Pastes',
          brand: 'Swad',
          unit: '200g',
          inStock: true,
          rating: 4.3,
          reviewCount: 167,
          tags: ['Concentrated', 'Authentic', 'Tangy']
        },
        {
          id: '48',
          name: 'Ginger Garlic Paste',
          description: 'Fresh ginger garlic paste, no preservatives',
          price: 55,
          image: 'https://images.unsplash.com/photo-1599909151466-de8f96a538a3?w=300',
          category: 'spices',
          subcategory: 'Pastes',
          brand: 'Everest',
          unit: '200g',
          inStock: true,
          rating: 4.1,
          reviewCount: 345,
          tags: ['Fresh', 'No Preservatives', 'Convenient']
        },

        // ===== FLOURS & GRAINS =====
        {
          id: '49',
          name: 'Wheat Flour (Atta)',
          description: 'Whole wheat flour for rotis and parathas',
          price: 185,
          image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300',
          category: 'staples',
          subcategory: 'Flour',
          brand: 'Ashirvaad',
          unit: '5kg',
          inStock: true,
          rating: 4.4,
          reviewCount: 1567,
          tags: ['Whole Wheat', 'Fresh Ground', 'Quality']
        },
        {
          id: '50',
          name: 'Besan (Chickpea Flour)',
          description: 'Fine chickpea flour for pakoras and sweets',
          price: 95,
          image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300',
          category: 'staples',
          subcategory: 'Flour',
          brand: 'Everest',
          unit: '1kg',
          inStock: true,
          rating: 4.2,
          reviewCount: 445,
          tags: ['Fine', 'Pakoras', 'Sweets']
        },
        {
          id: '51',
          name: 'Semolina (Sooji/Rava)',
          description: 'Coarse semolina for upma and halwa',
          price: 65,
          image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300',
          category: 'staples',
          subcategory: 'Flour',
          brand: 'Tata Sampann',
          unit: '1kg',
          inStock: true,
          rating: 4.1,
          reviewCount: 234,
          tags: ['Coarse', 'Upma', 'Halwa']
        },

        // ===== AYURVEDA & HERBAL PRODUCTS =====
        {
          id: '52',
          name: 'Chyawanprash',
          description: 'Traditional Ayurvedic immunity booster',
          price: 385,
          image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300',
          category: 'personal-care',
          subcategory: 'Ayurvedic Products',
          brand: 'Dabur',
          unit: '500g',
          inStock: true,
          rating: 4.5,
          reviewCount: 892,
          tags: ['Ayurvedic', 'Immunity', 'Traditional']
        },
        {
          id: '53',
          name: 'Turmeric Milk Powder',
          description: 'Golden milk powder with turmeric and spices',
          price: 165,
          image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300',
          category: 'beverages',
          subcategory: 'Health Drinks',
          brand: 'Organic India',
          unit: '200g',
          inStock: true,
          rating: 4.3,
          reviewCount: 234,
          tags: ['Golden Milk', 'Turmeric', 'Health'],
          organic: true
        },
        {
          id: '54',
          name: 'Amla Juice',
          description: 'Pure amla juice rich in Vitamin C',
          price: 225,
          image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300',
          category: 'beverages',
          subcategory: 'Health Drinks',
          brand: 'Patanjali',
          unit: '500ml',
          inStock: true,
          rating: 4.2,
          reviewCount: 345,
          tags: ['Pure', 'Vitamin C', 'Antioxidant']
        },

        // ===== TRADITIONAL SWEETS =====
        {
          id: '55',
          name: 'Soan Papdi',
          description: 'Flaky traditional Indian sweet',
          price: 145,
          image: 'https://images.unsplash.com/photo-1631452180539-96aca7d48617?w=300',
          category: 'snacks',
          subcategory: 'Traditional Sweets',
          brand: 'Haldiram\'s',
          unit: '250g',
          inStock: true,
          rating: 4.3,
          reviewCount: 567,
          tags: ['Flaky', 'Traditional', 'Festival']
        },
        {
          id: '56',
          name: 'Gulab Jamun Mix',
          description: 'Instant mix for making gulab jamuns',
          price: 85,
          image: 'https://images.unsplash.com/photo-1631452180539-96aca7d48617?w=300',
          category: 'snacks',
          subcategory: 'Traditional Sweets',
          brand: 'Gits',
          unit: '200g',
          inStock: true,
          rating: 4.1,
          reviewCount: 234,
          tags: ['Instant Mix', 'Traditional', 'Easy']
        },
        {
          id: '57',
          name: 'Rasgulla (Canned)',
          description: 'Soft spongy rasgullas in sugar syrup',
          price: 95,
          image: 'https://images.unsplash.com/photo-1631452180539-96aca7d48617?w=300',
          category: 'snacks',
          subcategory: 'Traditional Sweets',
          brand: 'Haldiram\'s',
          unit: '500g (1 can)',
          inStock: true,
          rating: 4.2,
          reviewCount: 345,
          tags: ['Soft', 'Spongy', 'Bengali Sweet']
        },

        // ===== JAGGERY & SUGAR =====
        {
          id: '58',
          name: 'Organic Jaggery (Gur)',
          description: 'Pure organic jaggery from sugarcane',
          price: 125,
          image: 'https://images.unsplash.com/photo-1606728035253-49e8a23146de?w=300',
          category: 'staples',
          subcategory: 'Sugar & Jaggery',
          brand: 'Organic Tattva',
          unit: '1kg',
          inStock: true,
          rating: 4.4,
          reviewCount: 456,
          tags: ['Organic', 'Pure', 'Natural Sweetener'],
          organic: true
        },
        {
          id: '59',
          name: 'Rock Sugar (Mishri)',
          description: 'Crystallized sugar for traditional sweets',
          price: 85,
          image: 'https://images.unsplash.com/photo-1606728035253-49e8a23146de?w=300',
          category: 'staples',
          subcategory: 'Sugar & Jaggery',
          brand: 'Tata',
          unit: '500g',
          inStock: true,
          rating: 4.1,
          reviewCount: 234,
          tags: ['Crystallized', 'Traditional', 'Pure']
        },

        // ===== FROZEN INDIAN FOODS =====
        {
          id: '60',
          name: 'Frozen Samosas',
          description: 'Ready-to-fry samosas with potato filling',
          price: 165,
          image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300',
          category: 'snacks',
          subcategory: 'Frozen Foods',
          brand: 'Haldiram\'s',
          unit: '400g (12 pieces)',
          inStock: true,
          rating: 4.3,
          reviewCount: 445,
          tags: ['Ready to Fry', 'Potato Filling', 'Crispy']
        },
        {
          id: '61',
          name: 'Frozen Parathas',
          description: 'Multilayered frozen parathas, ready to cook',
          price: 125,
          image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300',
          category: 'snacks',
          subcategory: 'Frozen Foods',
          brand: 'Godrej',
          unit: '400g (5 pieces)',
          inStock: true,
          rating: 4.2,
          reviewCount: 356,
          tags: ['Multilayered', 'Ready to Cook', 'Convenient']
        }
      ];

      setCategories(mockCategories);
      setItems(mockItems);
    } catch (error) {
      console.error('Error loading grocery data:', error);
      toast.error('Failed to load grocery data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item: GroceryItem) => {
    dispatch(addToCart({
      product: {
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        originalPrice: item.originalPrice,
        image: item.image,
        category: item.category,
        brand: item.brand,
        unit: item.unit,
        inStock: item.inStock,
        rating: item.rating,
        reviewCount: item.reviewCount,
        tags: item.tags
      },
      quantity: 1
    }));
    toast.success(`${item.name} added to cart`);
  };

  // Filter and sort items
  const filteredItems = items
    .filter(item => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (selectedSubcategory !== 'all' && item.subcategory !== selectedSubcategory) return false;
      if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (filters.organic && !item.organic) return false;
      if (filters.inStock && !item.inStock) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        case 'name': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">FreshBazaar Groceries</h1>
            <p className="text-xl text-green-100">
              Authentic Indian groceries delivered fresh to your doorstep
            </p>
            <div className="mt-6 flex justify-center">
              <div className="bg-white bg-opacity-20 rounded-lg px-6 py-3">
                <span className="text-green-100">Free delivery on orders above ₹199</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-8">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-6 rounded-xl text-center transition-all ${
                selectedCategory === category.id
                  ? 'bg-green-600 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-green-50 hover:text-green-600 shadow-sm'
              }`}
            >
              <div className="text-3xl mb-2">{category.icon}</div>
              <h3 className="font-semibold text-sm mb-1">{category.name.split(' ').slice(1).join(' ')}</h3>
              <p className="text-xs opacity-75">{category.itemCount} items</p>
            </button>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search groceries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
              
              <div className="flex items-center gap-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.organic}
                    onChange={(e) => setFilters({...filters, organic: e.target.checked})}
                    className="rounded text-green-600"
                  />
                  <span className="ml-2 text-sm">Organic</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Category Info */}
        {selectedCategory !== 'all' && selectedCategoryData && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="text-4xl">{selectedCategoryData.icon}</div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedCategoryData.name}</h2>
                <p className="text-gray-600">{selectedCategoryData.description}</p>
                <div className="flex gap-2 mt-2">
                  {selectedCategoryData.subcategories.map(sub => (
                    <button
                      key={sub}
                      onClick={() => setSelectedSubcategory(selectedSubcategory === sub ? 'all' : sub)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedSubcategory === sub
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-green-100'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                {item.organic && (
                  <span className="absolute top-2 left-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    🌱 Organic
                  </span>
                )}
                {item.originalPrice && (
                  <span className="absolute top-2 right-2 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                    {Math.round((1 - item.price / item.originalPrice) * 100)}% OFF
                  </span>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{item.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{item.brand} • {item.unit}</p>
                
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-yellow-400">★</span>
                  <span className="text-sm text-gray-600">{item.rating}</span>
                  <span className="text-sm text-gray-400">({item.reviewCount})</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-gray-900">₹{item.price}</span>
                    {item.originalPrice && (
                      <span className="text-sm text-gray-500 line-through ml-2">₹{item.originalPrice}</span>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={!item.inStock}
                    className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {item.inStock ? 'Add' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🛒</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Item Detail Modal */}
      {showItemDetail && selectedItem && (
        <GroceryItemDetail
          item={selectedItem}
          onClose={() => {
            setShowItemDetail(false);
            setSelectedItem(null);
          }}
        />
      )}
    </div>
  );
};

export default GroceryPage; 