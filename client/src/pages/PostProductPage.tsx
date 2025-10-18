import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { addProduct } from '../store/slices/productsSlice';
import { toast } from 'react-hot-toast';
import { FiUpload, FiX, FiDollarSign, FiPackage, FiImage, FiTag, FiFileText, FiStar } from 'react-icons/fi';

interface ProductFormData {
  name: string;
  description: string;
  category: string;
  subcategory: string;
  brand: string;
  price: string;
  originalPrice: string;
  unit: string;
  weight: string;
  images: File[];
  tags: string[];
  organic: boolean;
  glutenFree: boolean;
  vegan: boolean;
  ingredients: string;
  nutritionalInfo: string;
  storageInstructions: string;
  countryOfOrigin: string;
  manufacturingDate: string;
  expiryDate: string;
  contactEmail: string;
  contactPhone: string;
  businessName: string;
  businessAddress: string;
}

const categories = [
  {
    id: 'spices',
    name: '🌶️ Spices & Masalas',
    subcategories: ['Whole Spices', 'Ground Spices', 'Garam Masala', 'Regional Masalas', 'Organic Spices', 'Spice Blends']
  },
  {
    id: 'staples',
    name: '🌾 Staples & Grains',
    subcategories: ['Basmati Rice', 'Regional Rice', 'Lentils & Pulses', 'Cooking Oils', 'Flour & Grains', 'Sugar & Jaggery']
  },
  {
    id: 'snacks',
    name: '🥨 Snacks & Namkeens',
    subcategories: ['Namkeens', 'Traditional Sweets', 'Chips & Crackers', 'Dry Fruits', 'Ready-to-Eat', 'Frozen Foods']
  },
  {
    id: 'beverages',
    name: '☕ Tea & Coffee',
    subcategories: ['Assam Tea', 'Darjeeling Tea', 'South Indian Coffee', 'Green Tea', 'Health Drinks', 'Traditional Drinks']
  },
  {
    id: 'fresh-produce',
    name: '🥭 Fresh Produce',
    subcategories: ['Tropical Fruits', 'Indian Vegetables', 'Fresh Herbs', 'Organic Produce', 'Seasonal Fruits', 'Exotic Vegetables']
  },
  {
    id: 'dairy',
    name: '🥛 Dairy Products',
    subcategories: ['Paneer & Cheese', 'Milk Products', 'Yogurt & Curd', 'Butter & Ghee', 'Plant-based Alternatives']
  },
  {
    id: 'personal-care',
    name: '🌿 Ayurveda & Wellness',
    subcategories: ['Ayurvedic Medicine', 'Hair Care', 'Skin Care', 'Immunity Boosters', 'Herbal Teas', 'Traditional Beauty']
  },
  {
    id: 'kitchenware',
    name: '🍳 Indian Kitchenware',
    subcategories: ['Pressure Cookers', 'Traditional Utensils', 'Storage Containers', 'Spice Boxes', 'Cookware']
  }
];

const PostProductPage: React.FC = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    category: '',
    subcategory: '',
    brand: '',
    price: '',
    originalPrice: '',
    unit: '',
    weight: '',
    images: [],
    tags: [],
    organic: false,
    glutenFree: false,
    vegan: false,
    ingredients: '',
    nutritionalInfo: '',
    storageInstructions: '',
    countryOfOrigin: 'India',
    manufacturingDate: '',
    expiryDate: '',
    contactEmail: user?.email || '',
    contactPhone: user?.phone || '',
    businessName: '',
    businessAddress: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
      
      // Create previews
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setImagePreviews(prev => [...prev, e.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.name && formData.description && formData.category && formData.subcategory);
      case 2:
        return !!(formData.brand && formData.price && formData.unit);
      case 3:
        return formData.images.length > 0;
      case 4:
        return !!(formData.contactEmail && formData.businessName);
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please sign in to post a product');
      return;
    }

    if (!validateStep(4)) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      // Create product object for Redux store (matching Product interface)
      const productId = Date.now().toString();
      const newProduct = {
        id: productId,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        image: imagePreviews[0] || 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=300', // Use first uploaded image or placeholder
        category: formData.category,
        brand: formData.brand,
        unit: formData.unit,
        inStock: true,
        rating: 4.0, // Default rating for new products
        reviewCount: 0,
        tags: [
          ...formData.tags,
          ...(formData.organic ? ['Organic'] : []),
          ...(formData.vegan ? ['Vegan'] : []),
          ...(formData.glutenFree ? ['Gluten-Free'] : []),
          'New Product'
        ]
      };

      // Add product to Redux store
      dispatch(addProduct(newProduct));
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const categoryName = categories.find(c => c.id === formData.category)?.name || 'the selected category';
      toast.success(`🎉 Product added to ${categoryName}! Visit Instamart to see it.`, {
        duration: 5000,
      });
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        category: '',
        subcategory: '',
        brand: '',
        price: '',
        originalPrice: '',
        unit: '',
        weight: '',
        images: [],
        tags: [],
        organic: false,
        glutenFree: false,
        vegan: false,
        ingredients: '',
        nutritionalInfo: '',
        storageInstructions: '',
        countryOfOrigin: 'India',
        manufacturingDate: '',
        expiryDate: '',
        contactEmail: user?.email || '',
        contactPhone: user?.phone || '',
        businessName: '',
        businessAddress: ''
      });
      setImagePreviews([]);
      setCurrentStep(1);
      
      // Show additional success message with link
      setTimeout(() => {
        toast((t) => (
          <div className="flex items-center gap-3">
            <span>🛒 View your product in {categoryName}?</span>
            <button
              onClick={() => {
                window.location.href = '/instamart';
                toast.dismiss(t.id);
              }}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
            >
              View Store
            </button>
          </div>
        ), { duration: 8000 });
      }, 2000);
      
    } catch (error) {
      toast.error('Failed to submit product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In Required</h2>
          <p className="text-gray-600 mb-4">Please sign in to your account to post products on FreshBazaar.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const selectedCategory = categories.find(cat => cat.id === formData.category);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Promote Your Product</h1>
            <p className="text-xl text-green-100">
              Showcase your authentic Indian products to thousands of customers
            </p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step <= currentStep
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </div>
              {step < 4 && (
                <div
                  className={`w-16 h-1 mx-2 ${
                    step < currentStep ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-gray-900">
            {currentStep === 1 && 'Product Information'}
            {currentStep === 2 && 'Pricing & Specifications'}
            {currentStep === 3 && 'Images & Details'}
            {currentStep === 4 && 'Business Information'}
          </h2>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Product Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Premium Cardamom Green Pods"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Describe your product, its quality, origin, and what makes it special..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subcategory *
                    </label>
                    <select
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                      disabled={!formData.category}
                    >
                      <option value="">Select a subcategory</option>
                      {selectedCategory?.subcategories.map(subcat => (
                        <option key={subcat} value={subcat}>
                          {subcat}
                        </option>
                      ))}
                    </select>
                    
                    {formData.category && (
                      <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                          📍 Your product will appear in: <strong>{selectedCategory?.name}</strong>
                          <br />
                          👀 Customers can find it by filtering this category on the Instamart page.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Pricing & Specifications */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand Name *
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="e.g., Everest, MDH, or your brand name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Selling Price (₹) *
                    </label>
                    <div className="relative">
                      <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="299"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Original Price (₹)
                    </label>
                    <div className="relative">
                      <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        name="originalPrice"
                        value={formData.originalPrice}
                        onChange={handleInputChange}
                        placeholder="350"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit/Package Size *
                    </label>
                    <input
                      type="text"
                      name="unit"
                      value={formData.unit}
                      onChange={handleInputChange}
                      placeholder="e.g., 100g, 1kg, 500ml"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weight/Volume
                    </label>
                    <input
                      type="text"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      placeholder="e.g., 100g, 1.2kg"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Product Attributes
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="organic"
                        checked={formData.organic}
                        onChange={handleInputChange}
                        className="rounded text-green-600 mr-2"
                      />
                      <span className="text-sm">🌱 Organic</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="glutenFree"
                        checked={formData.glutenFree}
                        onChange={handleInputChange}
                        className="rounded text-green-600 mr-2"
                      />
                      <span className="text-sm">🌾 Gluten Free</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="vegan"
                        checked={formData.vegan}
                        onChange={handleInputChange}
                        className="rounded text-green-600 mr-2"
                      />
                      <span className="text-sm">🌿 Vegan</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Images & Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Images * (Upload 1-5 images)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Click to upload or drag and drop</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 cursor-pointer transition-colors"
                    >
                      Choose Images
                    </label>
                  </div>
                  
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-600"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Tags
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add a tag (e.g., Premium, Fresh, Traditional)"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ingredients
                    </label>
                    <textarea
                      name="ingredients"
                      value={formData.ingredients}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="List the main ingredients..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Storage Instructions
                    </label>
                    <textarea
                      name="storageInstructions"
                      value={formData.storageInstructions}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="How should customers store this product?"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Business Information */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business/Store Name *
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    placeholder="e.g., Sharma Spices & Groceries"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                      placeholder="business@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Address
                  </label>
                  <textarea
                    name="businessAddress"
                    value={formData.businessAddress}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Your business address..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Manufacturing Date
                    </label>
                    <input
                      type="date"
                      name="manufacturingDate"
                      value={formData.manufacturingDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">📋 Review Guidelines</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Products will be reviewed within 24-48 hours</li>
                    <li>• Ensure all product information is accurate and complete</li>
                    <li>• High-quality images improve acceptance rates</li>
                    <li>• Authentic Indian products are preferred</li>
                    <li>• Contact details must be valid for verification</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 transition-colors flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FiStar className="w-4 h-4" />
                      Submit Product
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostProductPage; 