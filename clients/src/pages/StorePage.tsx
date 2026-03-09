import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { useCurrency } from '../hooks/useCurrency';

interface Store {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  address: string;
  phone: string;
  specialties: string[];
  isOpen: boolean;
  openingHours: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  brand: string;
  unit: string;
  inStock: boolean;
  rating: number;
  discount?: number;
}

const StorePage: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { formatPrice } = useCurrency();
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadStoreData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeId]);

  const loadStoreData = async () => {
    setLoading(true);
    try {
      // Store data mapping based on storeId from StoreListPage
      const storesMap: Record<string, Store> = {
        '1': {
          id: '1',
          name: 'Sharma Grocery Store',
          description: 'Authentic Indian groceries and fresh produce since 1985',
          image: 'https://images.unsplash.com/photo-1555982105-d25af4182e4e?w=400',
          rating: 4.5,
          reviewCount: 1250,
          deliveryTime: '25-35 mins',
          address: 'Shop 15, Main Market, Delhi - 110001',
          phone: '+91 98765 43210',
          specialties: ['Fresh Vegetables', 'Spices & Masalas', 'Regional Specialties'],
          isOpen: true,
          openingHours: '7:00 AM - 10:00 PM'
        },
        '6': {
          id: '6',
          name: 'Devotional Mart',
          description: 'Pooja stores, Incense & items',
          image: 'https://images.unsplash.com/photo-1586201375761-83865001e8c3?w=400',
          rating: 4.8,
          reviewCount: 875,
          deliveryTime: '15-25 mins',
          address: 'Temple Street, Varanasi - 221001',
          phone: '+91 98765 43211',
          specialties: ['Pooja Essentials', 'Incense & Dhoop', 'Idols & Statues'],
          isOpen: true,
          openingHours: '6:00 AM - 9:00 PM'
        },
        '7': {
          id: '7',
          name: 'Sacred Offerings',
          description: 'Pooja stores, Incense & items',
          image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400',
          rating: 4.7,
          reviewCount: 690,
          deliveryTime: '20-30 mins',
          address: 'Religious Market, Haridwar - 249401',
          phone: '+91 98765 43212',
          specialties: ['Idols & Statues', 'Incense & Books', 'Pooja Items'],
          isOpen: true,
          openingHours: '7:00 AM - 8:00 PM'
        },
        '8': {
          id: '8',
          name: 'Divine Pooja Store',
          description: 'Religious stores & spiritual items',
          image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400',
          rating: 4.6,
          reviewCount: 790,
          deliveryTime: '25-35 mins',
          address: 'Spiritual Lane, Rishikesh - 249201',
          phone: '+91 98765 43213',
          specialties: ['Flowers & Leaves', 'Brass Pooja Sets', 'Spiritual Items'],
          isOpen: true,
          openingHours: '6:00 AM - 9:00 PM'
        },
        '9': {
          id: '9',
          name: 'Spiritual Bazaar',
          description: 'Religious items stores',
          image: 'https://images.unsplash.com/photo-1631452180539-96aca7d48617?w=400',
          rating: 4.5,
          reviewCount: 685,
          deliveryTime: '15-25 mins',
          address: 'Devotion Road, Mathura - 281001',
          phone: '+91 98765 43214',
          specialties: ['Rudraksha Beads', 'Spiritual Books', 'Pooja Accessories'],
          isOpen: true,
          openingHours: '7:00 AM - 8:00 PM'
        },
        '2': {
          id: '2',
          name: 'Modern Mart',
          description: 'Your one-stop shop for all Indian grocery needs',
          image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=400',
          rating: 4.3,
          reviewCount: 890,
          deliveryTime: '20-30 mins',
          address: 'Shopping Complex, Mumbai - 400001',
          phone: '+91 98765 43215',
          specialties: ['Bulk Items', 'Packaged Goods', 'Household Items'],
          isOpen: true,
          openingHours: '8:00 AM - 11:00 PM'
        },
        '10': {
          id: '10',
          name: 'Mega Supermarket',
          description: 'Large selection of groceries, household items, and more',
          image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
          rating: 4.4,
          reviewCount: 1120,
          deliveryTime: '25-35 mins',
          address: 'Mall Road, Bangalore - 560001',
          phone: '+91 98765 43216',
          specialties: ['Beverages', 'Frozen Foods', 'Personal Care'],
          isOpen: true,
          openingHours: '9:00 AM - 10:00 PM'
        },
        '11': {
          id: '11',
          name: 'City Mart',
          description: 'Convenient supermarket with wide variety of products',
          image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400',
          rating: 4.2,
          reviewCount: 756,
          deliveryTime: '18-28 mins',
          address: 'Main Street, Pune - 411001',
          phone: '+91 98765 43217',
          specialties: ['Snacks', 'Dairy Products', 'Bakery Items'],
          isOpen: true,
          openingHours: '7:00 AM - 10:00 PM'
        },
        '12': {
          id: '12',
          name: 'Express Superstore',
          description: 'Quick delivery supermarket for all your daily needs',
          image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400',
          rating: 4.5,
          reviewCount: 934,
          deliveryTime: '15-25 mins',
          address: 'Highway Road, Hyderabad - 500001',
          phone: '+91 98765 43218',
          specialties: ['Ready-to-Eat', 'Beverages', 'Cleaning Supplies'],
          isOpen: true,
          openingHours: '8:00 AM - 11:00 PM'
        },
        '3': {
          id: '3',
          name: 'Spice Paradise',
          description: 'Premium spices and masalas from across India',
          image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400',
          rating: 4.7,
          reviewCount: 567,
          deliveryTime: '30-40 mins',
          address: 'Spice Market, Kochi - 682001',
          phone: '+91 98765 43219',
          specialties: ['Whole Spices', 'Ground Masalas', 'Organic Spices'],
          isOpen: true,
          openingHours: '9:00 AM - 8:00 PM'
        },
        '13': {
          id: '13',
          name: 'Gourmet Indian Foods',
          description: 'Specialty Indian ingredients and gourmet products',
          image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400',
          rating: 4.6,
          reviewCount: 678,
          deliveryTime: '35-45 mins',
          address: 'Gourmet Street, Delhi - 110001',
          phone: '+91 98765 43220',
          specialties: ['Premium Rice', 'Exotic Spices', 'Gourmet Items'],
          isOpen: true,
          openingHours: '10:00 AM - 9:00 PM'
        },
        '14': {
          id: '14',
          name: 'Organic Harvest',
          description: '100% organic Indian groceries and specialty items',
          image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400',
          rating: 4.8,
          reviewCount: 892,
          deliveryTime: '30-40 mins',
          address: 'Organic Lane, Chennai - 600001',
          phone: '+91 98765 43221',
          specialties: ['Organic Products', 'Health Foods', 'Natural Items'],
          isOpen: true,
          openingHours: '8:00 AM - 8:00 PM'
        },
        '15': {
          id: '15',
          name: 'Regional Specialties Store',
          description: 'Authentic regional Indian foods and specialty items',
          image: 'https://images.unsplash.com/photo-1586201375761-83865001e8c3?w=400',
          rating: 4.5,
          reviewCount: 523,
          deliveryTime: '40-50 mins',
          address: 'Regional Market, Kolkata - 700001',
          phone: '+91 98765 43222',
          specialties: ['Regional Foods', 'Traditional Items', 'Authentic Products'],
          isOpen: true,
          openingHours: '9:00 AM - 9:00 PM'
        },
        '4': {
          id: '4',
          name: 'Fresh Farm Market',
          description: 'Farm-fresh vegetables and fruits daily',
          image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400',
          rating: 4.4,
          reviewCount: 723,
          deliveryTime: '15-25 mins',
          address: 'Farm Road, Nashik - 422001',
          phone: '+91 98765 43223',
          specialties: ['Organic Vegetables', 'Seasonal Fruits', 'Fresh Herbs'],
          isOpen: true,
          openingHours: '6:00 AM - 9:00 PM'
        },
        '16': {
          id: '16',
          name: 'Green Valley Produce',
          description: 'Fresh organic vegetables and fruits from local farms',
          image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400',
          rating: 4.6,
          reviewCount: 645,
          deliveryTime: '20-30 mins',
          address: 'Valley Road, Dehradun - 248001',
          phone: '+91 98765 43224',
          specialties: ['Organic Produce', 'Local Vegetables', 'Fresh Fruits'],
          isOpen: true,
          openingHours: '7:00 AM - 8:00 PM'
        },
        '17': {
          id: '17',
          name: 'Daily Fresh Market',
          description: 'Daily fresh vegetables, fruits, and herbs',
          image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400',
          rating: 4.3,
          reviewCount: 512,
          deliveryTime: '12-22 mins',
          address: 'Market Street, Jaipur - 302001',
          phone: '+91 98765 43225',
          specialties: ['Fresh Vegetables', 'Tropical Fruits', 'Fresh Herbs'],
          isOpen: true,
          openingHours: '6:00 AM - 9:00 PM'
        },
        '18': {
          id: '18',
          name: 'Farm to Door',
          description: 'Direct from farm fresh produce delivered to your door',
          image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400',
          rating: 4.7,
          reviewCount: 834,
          deliveryTime: '25-35 mins',
          address: 'Farm Gate, Ludhiana - 141001',
          phone: '+91 98765 43226',
          specialties: ['Farm Fresh', 'Seasonal Produce', 'Organic Options'],
          isOpen: true,
          openingHours: '7:00 AM - 8:00 PM'
        },
        '5': {
          id: '5',
          name: 'Sweets & Snacks Corner',
          description: 'Traditional Indian sweets and namkeens',
          image: 'https://images.unsplash.com/photo-1631452180539-96aca7d48617?w=400',
          rating: 4.2,
          reviewCount: 456,
          deliveryTime: '35-45 mins',
          address: 'Sweet Street, Agra - 282001',
          phone: '+91 98765 43227',
          specialties: ['Fresh Sweets', 'Namkeens', 'Festival Specials'],
          isOpen: true,
          openingHours: '8:00 AM - 10:00 PM'
        },
        '19': {
          id: '19',
          name: 'Mithai House',
          description: 'Authentic Indian sweets and traditional desserts',
          image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400',
          rating: 4.5,
          reviewCount: 678,
          deliveryTime: '30-40 mins',
          address: 'Mithai Lane, Kanpur - 208001',
          phone: '+91 98765 43228',
          specialties: ['Gulab Jamun', 'Rasgulla', 'Barfi', 'Ladoo'],
          isOpen: true,
          openingHours: '9:00 AM - 9:00 PM'
        },
        '20': {
          id: '20',
          name: 'Namkeen Express',
          description: 'Crispy namkeens and savory snacks',
          image: 'https://images.unsplash.com/photo-1599599810694-57a2ca3bf6f1?w=400',
          rating: 4.4,
          reviewCount: 589,
          deliveryTime: '25-35 mins',
          address: 'Snack Street, Indore - 452001',
          phone: '+91 98765 43229',
          specialties: ['Bhujia', 'Mixture', 'Chips', 'Kurkure'],
          isOpen: true,
          openingHours: '8:00 AM - 10:00 PM'
        },
        '21': {
          id: '21',
          name: 'Sweet Delights',
          description: 'Fresh Indian sweets and confectionery',
          image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
          rating: 4.6,
          reviewCount: 745,
          deliveryTime: '20-30 mins',
          address: 'Confectionery Road, Surat - 395001',
          phone: '+91 98765 43230',
          specialties: ['Kaju Katli', 'Peda', 'Jalebi', 'Halwa'],
          isOpen: true,
          openingHours: '9:00 AM - 9:00 PM'
        },
        '22': {
          id: '22',
          name: 'Snack Zone',
          description: 'Wide variety of Indian snacks and namkeens',
          image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400',
          rating: 4.3,
          reviewCount: 432,
          deliveryTime: '18-28 mins',
          address: 'Zone Market, Vadodara - 390001',
          phone: '+91 98765 43231',
          specialties: ['Packaged Snacks', 'Fresh Namkeens', 'Dry Fruits'],
          isOpen: true,
          openingHours: '8:00 AM - 10:00 PM'
        }
      };

      // Get store data based on storeId, default to store 1 if not found
      const mockStore = storesMap[storeId || '1'] || storesMap['1'];

      const mockProducts: Product[] = [
        // SPICES & MASALAS
        {
          id: '1',
          name: 'Cardamom Green Pods',
          description: 'Premium quality green cardamom pods from Kerala hills',
          price: 450,
          originalPrice: 500,
          image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300',
          category: 'spices',
          brand: 'Everest',
          unit: '50g',
          inStock: true,
          rating: 4.7,
          discount: 10
        },
        {
          id: '2',
          name: 'Black Pepper Whole',
          description: 'World-renowned black peppercorns from Malabar coast',
          price: 320,
          image: 'https://images.unsplash.com/photo-1505798577917-a65157d3353a?w=300',
          category: 'spices',
          brand: 'MDH',
          unit: '100g',
          inStock: true,
          rating: 4.6
        },
        {
          id: '3',
          name: 'Turmeric Powder',
          description: 'Pure turmeric powder with high curcumin content',
          price: 85,
          image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=300',
          category: 'spices',
          brand: 'Badshah',
          unit: '200g',
          inStock: true,
          rating: 4.5
        },
        {
          id: '4',
          name: 'Garam Masala Blend',
          description: 'Authentic blend of aromatic spices for Indian cooking',
          price: 95,
          originalPrice: 110,
          image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300',
          category: 'spices',
          brand: 'MDH',
          unit: '100g',
          inStock: true,
          rating: 4.4,
          discount: 14
        },
        {
          id: '5',
          name: 'Red Chili Powder',
          description: 'Spicy red chili powder from Guntur',
          price: 120,
          image: 'https://images.unsplash.com/photo-1604917454745-21e44c92d310?w=300',
          category: 'spices',
          brand: 'Everest',
          unit: '200g',
          inStock: true,
          rating: 4.4
        },

        // RICE & GRAINS
        {
          id: '6',
          name: 'Basmati Rice Premium Aged',
          description: 'Premium quality aged basmati rice with long grains',
          price: 285,
          originalPrice: 320,
          image: 'https://images.unsplash.com/photo-1586201375761-83865001e8c3?w=300',
          category: 'staples',
          brand: 'India Gate',
          unit: '5kg',
          inStock: true,
          rating: 4.6,
          discount: 11
        },
        {
          id: '7',
          name: 'Sona Masoori Rice',
          description: 'Premium non-basmati rice, perfect for South Indian dishes',
          price: 180,
          image: 'https://images.unsplash.com/photo-1586201375761-83865001e8c3?w=300',
          category: 'staples',
          brand: 'Daawat',
          unit: '5kg',
          inStock: true,
          rating: 4.3
        },

        // LENTILS & PULSES
        {
          id: '8',
          name: 'Toor Dal (Arhar)',
          description: 'High-quality pigeon peas, rich in protein',
          price: 135,
          image: 'https://images.unsplash.com/photo-1599909151466-de8f96a538a3?w=300',
          category: 'lentils',
          brand: 'Organic Tattva',
          unit: '1kg',
          inStock: true,
          rating: 4.3
        },
        {
          id: '9',
          name: 'Moong Dal (Split)',
          description: 'Yellow split mung beans, easy to digest',
          price: 110,
          image: 'https://images.unsplash.com/photo-1599909151466-de8f96a538a3?w=300',
          category: 'lentils',
          brand: 'Tata Sampann',
          unit: '1kg',
          inStock: true,
          rating: 4.4
        },
        {
          id: '10',
          name: 'Rajma (Kidney Beans)',
          description: 'Premium red kidney beans from Kashmir',
          price: 165,
          image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300',
          category: 'lentils',
          brand: 'Organic India',
          unit: '1kg',
          inStock: true,
          rating: 4.5
        },

        // OILS & GHEE
        {
          id: '11',
          name: 'Pure Ghee (Clarified Butter)',
          description: 'Traditional A2 cow ghee, made from pure milk',
          price: 650,
          originalPrice: 720,
          image: 'https://images.unsplash.com/photo-1609501676725-7186f66edcd7?w=300',
          category: 'oils',
          brand: 'Amul',
          unit: '1L',
          inStock: true,
          rating: 4.7,
          discount: 10
        },
        {
          id: '12',
          name: 'Mustard Oil',
          description: 'Cold-pressed mustard oil with strong flavor',
          price: 285,
          image: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=300',
          category: 'oils',
          brand: 'Dhara',
          unit: '1L',
          inStock: true,
          rating: 4.3
        },
        {
          id: '13',
          name: 'Coconut Oil Pure',
          description: 'Cold-pressed virgin coconut oil for cooking',
          price: 425,
          originalPrice: 450,
          image: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=300',
          category: 'oils',
          brand: 'Parachute',
          unit: '1L',
          inStock: true,
          rating: 4.6,
          discount: 6
        },

        // SNACKS & NAMKEENS
        {
          id: '14',
          name: 'Haldiram\'s Aloo Bhujia',
          description: 'Crispy potato sticks with aromatic spices',
          price: 45,
          originalPrice: 50,
          image: 'https://images.unsplash.com/photo-1599599810694-57a2ca3bf6f1?w=300',
          category: 'snacks',
          brand: 'Haldiram\'s',
          unit: '150g',
          inStock: true,
          rating: 4.4,
          discount: 10
        },
        {
          id: '15',
          name: 'Bikaji Bhel Puri Mix',
          description: 'Ready-to-eat bhel puri mix with chutneys',
          price: 65,
          image: 'https://images.unsplash.com/photo-1599599810694-57a2ca3bf6f1?w=300',
          category: 'snacks',
          brand: 'Bikaji',
          unit: '150g',
          inStock: true,
          rating: 4.2
        },
        {
          id: '16',
          name: 'Kurkure Masala Munch',
          description: 'Crunchy corn puffs with masala flavor',
          price: 20,
          image: 'https://images.unsplash.com/photo-1599599810694-57a2ca3bf6f1?w=300',
          category: 'snacks',
          brand: 'Kurkure',
          unit: '55g',
          inStock: true,
          rating: 4.0
        },

        // DRY FRUITS & NUTS
        {
          id: '17',
          name: 'Cashews Premium',
          description: 'Large size cashews from Kerala',
          price: 850,
          originalPrice: 920,
          image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=300',
          category: 'dry-fruits',
          brand: 'Nutraj',
          unit: '500g',
          inStock: true,
          rating: 4.6,
          discount: 8
        },
        {
          id: '18',
          name: 'Almonds California',
          description: 'Premium California almonds, rich in protein',
          price: 720,
          image: 'https://images.unsplash.com/photo-1508747718406-e3654b8443f5?w=300',
          category: 'dry-fruits',
          brand: 'Happilo',
          unit: '500g',
          inStock: true,
          rating: 4.5
        },
        {
          id: '19',
          name: 'Dates Medjool',
          description: 'Large, soft Medjool dates from Iran',
          price: 450,
          image: 'https://images.unsplash.com/photo-1577308856961-8e0ec50d6ad4?w=300',
          category: 'dry-fruits',
          brand: 'Nutraj',
          unit: '250g',
          inStock: true,
          rating: 4.4
        },

        // TEA & COFFEE
        {
          id: '20',
          name: 'Assam Tea Leaves CTC',
          description: 'Premium black tea from Assam gardens',
          price: 175,
          image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300',
          category: 'beverages',
          brand: 'Tata Tea',
          unit: '500g',
          inStock: true,
          rating: 4.3
        },
        {
          id: '21',
          name: 'Darjeeling Tea Premium',
          description: 'Finest Darjeeling tea with muscatel flavor',
          price: 650,
          originalPrice: 720,
          image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300',
          category: 'beverages',
          brand: 'Twinings',
          unit: '200g',
          inStock: true,
          rating: 4.7,
          discount: 10
        },
        {
          id: '22',
          name: 'Filter Coffee Powder',
          description: 'Traditional South Indian filter coffee blend',
          price: 385,
          image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=300',
          category: 'beverages',
          brand: 'Narasu\'s',
          unit: '500g',
          inStock: true,
          rating: 4.5
        },

        // FRESH PRODUCE
        {
          id: '23',
          name: 'Fresh Mangoes Alphonso',
          description: 'King of mangoes from Maharashtra',
          price: 650,
          originalPrice: 720,
          image: 'https://images.unsplash.com/photo-1553279768-865429ffa5fb?w=300',
          category: 'vegetables',
          brand: 'Fresh Farm',
          unit: '1kg (4-5 pieces)',
          inStock: true,
          rating: 4.8,
          discount: 10
        },
        {
          id: '24',
          name: 'Fresh Tomatoes',
          description: 'Farm fresh tomatoes, handpicked daily',
          price: 40,
          image: 'https://images.unsplash.com/photo-1546470427-e92bb2f8e4b0?w=300',
          category: 'vegetables',
          brand: 'Fresh Farm',
          unit: '1kg',
          inStock: true,
          rating: 4.2
        },
        {
          id: '25',
          name: 'Okra (Bhindi)',
          description: 'Fresh okra, perfect for Indian curries',
          price: 65,
          image: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=300',
          category: 'vegetables',
          brand: 'Green Valley',
          unit: '500g',
          inStock: true,
          rating: 4.1
        },

        // DAIRY PRODUCTS
        {
          id: '26',
          name: 'Amul Fresh Paneer',
          description: 'Fresh cottage cheese, perfect for Indian curries',
          price: 85,
          image: 'https://images.unsplash.com/photo-1631452180519-8dd4f754e6b4?w=300',
          category: 'dairy',
          brand: 'Amul',
          unit: '200g',
          inStock: true,
          rating: 4.5
        },
        {
          id: '27',
          name: 'Amul Taza Milk',
          description: 'Fresh homogenized toned milk',
          price: 28,
          image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300',
          category: 'dairy',
          brand: 'Amul',
          unit: '500ml',
          inStock: true,
          rating: 4.4
        },
        {
          id: '28',
          name: 'Amul Curd (Dahi)',
          description: 'Fresh thick curd made from pure milk',
          price: 35,
          image: 'https://images.unsplash.com/photo-1571212515416-6ca18ce63a31?w=300',
          category: 'dairy',
          brand: 'Amul',
          unit: '400g',
          inStock: true,
          rating: 4.3
        },

        // FLOURS & GRAINS
        {
          id: '29',
          name: 'Wheat Flour (Atta)',
          description: 'Whole wheat flour for rotis and parathas',
          price: 185,
          image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300',
          category: 'flour',
          brand: 'Ashirvaad',
          unit: '5kg',
          inStock: true,
          rating: 4.4
        },
        {
          id: '30',
          name: 'Besan (Chickpea Flour)',
          description: 'Fine chickpea flour for pakoras and sweets',
          price: 95,
          image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300',
          category: 'flour',
          brand: 'Everest',
          unit: '1kg',
          inStock: true,
          rating: 4.2
        },

        // TRADITIONAL SWEETS
        {
          id: '31',
          name: 'Soan Papdi',
          description: 'Flaky traditional Indian sweet',
          price: 145,
          image: 'https://images.unsplash.com/photo-1631452180539-96aca7d48617?w=300',
          category: 'sweets',
          brand: 'Haldiram\'s',
          unit: '250g',
          inStock: true,
          rating: 4.3
        },
        {
          id: '32',
          name: 'Gulab Jamun Mix',
          description: 'Instant mix for making gulab jamuns',
          price: 85,
          image: 'https://images.unsplash.com/photo-1631452180539-96aca7d48617?w=300',
          category: 'sweets',
          brand: 'Gits',
          unit: '200g',
          inStock: true,
          rating: 4.1
        },
        {
          id: '41',
          name: 'Gulab Jamun (Ready to Eat)',
          description: 'Soft, syrupy gulab jamuns ready to serve',
          price: 120,
          image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300',
          category: 'sweets',
          brand: 'Haldiram\'s',
          unit: '250g (6 pieces)',
          inStock: true,
          rating: 4.5
        },
        {
          id: '42',
          name: 'Rasgulla',
          description: 'Soft, spongy Bengali rasgullas in sugar syrup',
          price: 110,
          image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300',
          category: 'sweets',
          brand: 'Haldiram\'s',
          unit: '250g (6 pieces)',
          inStock: true,
          rating: 4.4
        },
        {
          id: '43',
          name: 'Kaju Katli',
          description: 'Premium cashew fudge, diamond-shaped',
          price: 350,
          image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300',
          category: 'sweets',
          brand: 'Haldiram\'s',
          unit: '250g',
          inStock: true,
          rating: 4.6
        },
        {
          id: '44',
          name: 'Barfi Assorted',
          description: 'Mixed barfi with different flavors',
          price: 180,
          image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300',
          category: 'sweets',
          brand: 'Bikaji',
          unit: '300g',
          inStock: true,
          rating: 4.3
        },
        {
          id: '45',
          name: 'Jalebi',
          description: 'Crispy, syrupy spiral-shaped sweet',
          price: 95,
          image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300',
          category: 'sweets',
          brand: 'Haldiram\'s',
          unit: '200g',
          inStock: true,
          rating: 4.2
        },
        {
          id: '46',
          name: 'Ladoo Mix',
          description: 'Assorted ladoos - besan, motichoor, boondi',
          price: 165,
          image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300',
          category: 'sweets',
          brand: 'Haldiram\'s',
          unit: '400g',
          inStock: true,
          rating: 4.4
        },
        {
          id: '47',
          name: 'Peda',
          description: 'Soft, milky peda with cardamom flavor',
          price: 200,
          image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300',
          category: 'sweets',
          brand: 'Bikaji',
          unit: '250g',
          inStock: true,
          rating: 4.5
        },
        {
          id: '48',
          name: 'Halwa Assorted',
          description: 'Mixed halwa - carrot, semolina, moong dal',
          price: 150,
          image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300',
          category: 'sweets',
          brand: 'Haldiram\'s',
          unit: '300g',
          inStock: true,
          rating: 4.3
        },

        // PICKLES & CONDIMENTS
        {
          id: '33',
          name: 'Mango Pickle (Aam Ka Achar)',
          description: 'Traditional spicy mango pickle',
          price: 125,
          image: 'https://images.unsplash.com/photo-1599909151466-de8f96a538a3?w=300',
          category: 'pickles',
          brand: 'Priya',
          unit: '300g',
          inStock: true,
          rating: 4.4
        },
        {
          id: '34',
          name: 'Tamarind Paste',
          description: 'Concentrated tamarind paste for authentic flavor',
          price: 75,
          image: 'https://images.unsplash.com/photo-1599909151466-de8f96a538a3?w=300',
          category: 'pickles',
          brand: 'Swad',
          unit: '200g',
          inStock: true,
          rating: 4.3
        },

        // READY-TO-EAT FOODS
        {
          id: '35',
          name: 'MTR Ready to Eat Sambar',
          description: 'Authentic South Indian sambar, ready in 2 minutes',
          price: 85,
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300',
          category: 'ready-to-eat',
          brand: 'MTR',
          unit: '300g',
          inStock: true,
          rating: 4.2
        },
        {
          id: '36',
          name: 'Frozen Samosas',
          description: 'Ready-to-fry samosas with potato filling',
          price: 165,
          image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300',
          category: 'frozen',
          brand: 'Haldiram\'s',
          unit: '400g (12 pieces)',
          inStock: true,
          rating: 4.3
        },

        // AYURVEDIC PRODUCTS
        {
          id: '37',
          name: 'Chyawanprash',
          description: 'Traditional Ayurvedic immunity booster',
          price: 385,
          image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300',
          category: 'ayurvedic',
          brand: 'Dabur',
          unit: '500g',
          inStock: true,
          rating: 4.5
        },
        {
          id: '38',
          name: 'Turmeric Milk Powder',
          description: 'Golden milk powder with turmeric and spices',
          price: 165,
          image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300',
          category: 'health-drinks',
          brand: 'Organic India',
          unit: '200g',
          inStock: true,
          rating: 4.3
        },

        // JAGGERY & SUGAR
        {
          id: '39',
          name: 'Organic Jaggery (Gur)',
          description: 'Pure organic jaggery from sugarcane',
          price: 125,
          image: 'https://images.unsplash.com/photo-1606728035253-49e8a23146de?w=300',
          category: 'sweeteners',
          brand: 'Organic Tattva',
          unit: '1kg',
          inStock: true,
          rating: 4.4
        },
        {
          id: '40',
          name: 'Rock Sugar (Mishri)',
          description: 'Crystallized sugar for traditional sweets',
          price: 85,
          image: 'https://images.unsplash.com/photo-1606728035253-49e8a23146de?w=300',
          category: 'sweeteners',
          brand: 'Tata',
          unit: '500g',
          inStock: true,
          rating: 4.1
        }
      ];

      // Filter products based on store category
      let filteredProducts = mockProducts;
      
      // Map store IDs to their categories (matching StoreListPage)
      const storeCategoryMap: Record<string, string> = {
        '1': 'traditional', '6': 'traditional', '7': 'traditional', '8': 'traditional', '9': 'traditional',
        '2': 'supermarket', '10': 'supermarket', '11': 'supermarket', '12': 'supermarket',
        '3': 'specialty', '13': 'specialty', '14': 'specialty', '15': 'specialty',
        '4': 'fresh', '16': 'fresh', '17': 'fresh', '18': 'fresh',
        '5': 'sweets', '19': 'sweets', '20': 'sweets', '21': 'sweets', '22': 'sweets'
      };

      const storeCategory = storeCategoryMap[storeId || '1'];
      
      // Filter products based on store category
      if (storeCategory === 'sweets') {
        // Show only sweets and snacks products
        filteredProducts = mockProducts.filter(p => 
          p.category === 'sweets' || p.category === 'snacks' || p.category === 'dry-fruits'
        );
      } else if (storeCategory === 'fresh') {
        // Show only fresh produce
        filteredProducts = mockProducts.filter(p => 
          p.category === 'vegetables' || p.category === 'fruits' || p.category === 'dairy'
        );
      } else if (storeCategory === 'specialty') {
        // Show specialty items
        filteredProducts = mockProducts.filter(p => 
          p.category === 'spices' || p.category === 'staples' || p.category === 'oils' || 
          p.category === 'dry-fruits' || p.category === 'ayurvedic'
        );
      } else if (storeCategory === 'supermarket') {
        // Show all products for supermarkets
        filteredProducts = mockProducts;
      } else {
        // Traditional stores - show traditional items
        filteredProducts = mockProducts.filter(p => 
          p.category === 'spices' || p.category === 'staples' || p.category === 'lentils' ||
          p.category === 'oils' || p.category === 'flour' || p.category === 'pickles' ||
          p.category === 'vegetables' || p.category === 'dairy'
        );
      }

      setStore(mockStore);
      setProducts(filteredProducts);
    } catch (error) {
      console.error('Error loading store data:', error);
      toast.error('Failed to load store data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: product.category,
        brand: product.brand,
        unit: product.unit,
        inStock: product.inStock,
        rating: product.rating,
        reviewCount: 0, // Default value since not in interface
        tags: [] // Default value since not in interface
      },
      quantity: 1
    }));
    toast.success(`${product.name} added to cart`);
  };

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'staples', name: 'Staples' },
    { id: 'spices', name: 'Spices' },
    { id: 'vegetables', name: 'Vegetables' },
    { id: 'fruits', name: 'Fruits' }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Store not found</h2>
          <p className="text-gray-600">The store you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Store Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-6">
            <img 
              src={store.image} 
              alt={store.name}
              className="w-full md:w-48 h-48 object-cover rounded-lg"
            />
            
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{store.name}</h1>
                  <p className="text-gray-600 mb-4">{store.description}</p>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center">
                      <span className="text-green-600 font-semibold mr-1">★ {store.rating}</span>
                      <span className="text-gray-500">({store.reviewCount} reviews)</span>
                    </div>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-600">{store.deliveryTime}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      store.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {store.isOpen ? 'Open' : 'Closed'}
                    </span>
                    <span className="text-gray-600">{store.openingHours}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {store.specialties.map((specialty, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Products</h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 hover:text-green-600 transition-colors">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.unit}</p>
                
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-yellow-400">★</span>
                  <span className="text-sm text-gray-600">{product.rating}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through ml-2">{formatPrice(product.originalPrice)}</span>
                    )}
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    disabled={!product.inStock}
                    className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {product.inStock ? 'Add' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StorePage; 