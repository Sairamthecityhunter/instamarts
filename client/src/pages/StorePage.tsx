import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/UI/LoadingSpinner';

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
  const dispatch = useDispatch();
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadStoreData();
  }, [storeId]);

  const loadStoreData = async () => {
    setLoading(true);
    try {
      // Mock store data
      const mockStore: Store = {
        id: storeId || '1',
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
      };

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

      setStore(mockStore);
      setProducts(mockProducts);
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
            <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.unit}</p>
                
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-yellow-400">★</span>
                  <span className="text-sm text-gray-600">{product.rating}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through ml-2">₹{product.originalPrice}</span>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleAddToCart(product)}
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