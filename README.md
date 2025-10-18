# FreshBazaar - Indian Grocery E-Commerce Platform

A comprehensive, full-stack Indian grocery delivery platform built with React and Node.js, featuring extensive Indian product catalogs, multi-store selection, and seamless shopping experience for authentic Indian groceries.

## 🚀 Features

### Core Functionality
- **Comprehensive Indian Product Catalog**: Browse staples (rice, flour, lentils), masalas/spices, snacks, fresh produce, dairy, kitchenware, and home essentials
- **Multi-Store Selection**: Order from multiple local stores or select preferred vendors
- **Smart Search & Filters**: Search by category, product, brand with filters for dietary preferences (vegan, gluten-free), packaging, price, and discounts
- **Real-time Order Tracking**: Live delivery tracking with ETA updates and shopper communication
- **Cart & Checkout**: Persistent cart with multiple payment options including UPI, net banking, and cash on delivery
- **User Authentication**: Secure JWT-based authentication system

### User Experience
- **Personalized Homepage**: AI-based recommendations for Indian groceries and trending products
- **FreshBazaar Premium**: Membership with exclusive benefits and faster delivery
- **Order History**: Complete order tracking and easy reorder functionality
- **Address Management**: Multiple delivery addresses with smart defaults
- **Rating & Reviews**: User feedback system for stores and products

### Advanced Features
- **Real-time Notifications**: Order status updates and delivery alerts
- **Multi-language Support**: Hindi, English, and major regional languages
- **Responsive Design**: Optimized for desktop and mobile browsers
- **Accessibility**: ARIA roles, keyboard navigation, screen-reader support
- **Contactless Delivery**: "Leave at my door" options for safe deliveries

### Indian Grocery Specialization
- **Regional Specialties**: Products from different Indian states and regions
- **Festival Collections**: Special collections for Indian festivals and occasions
- **Bulk Buying Options**: Family packs and bulk quantities for Indian households
- **Fresh Produce**: Daily fresh vegetables, fruits, and dairy products
- **Authentic Brands**: Partnerships with authentic Indian grocery brands

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, React Query
- **Backend**: Node.js, Express, TypeScript
- **State Management**: Redux Toolkit
- **Authentication**: JWT tokens with refresh mechanism
- **Real-time**: Socket.io for live tracking and shopper communication
- **Payments**: Razorpay, UPI, Paytm integration
- **Maps**: Google Maps API integration for delivery tracking
- **Search**: Elasticsearch for product search and filtering

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd freshbazaar
```

2. Install all dependencies:
```bash
npm run install-all
```

3. Set up environment variables:
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

4. Start the development servers:
```bash
npm run dev
```

## 🏗️ Project Structure

```
freshbazaar/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Redux store and slices
│   │   └── types/         # TypeScript type definitions
├── server/                # Node.js backend
│   ├── src/
│   │   ├── routes/        # API route handlers
│   │   ├── middleware/    # Custom middleware
│   │   └── types/         # TypeScript type definitions
└── docs/                  # Documentation
```

## 🎯 Key Features Implemented

### Product Discovery
- Indian grocery categorization (staples, spices, snacks, fresh produce)
- Filter by dietary preferences, brand, price, and offers
- Store-wise product availability
- Regional product recommendations

### Order Management
- Real-time order tracking with shopper communication
- Order history with easy reorder functionality
- Multiple payment methods (UPI, cards, COD)
- Delivery and pickup options

### User Account
- Profile management with preferences
- FreshBazaar Premium subscription
- Saved addresses for quick checkout
- Wishlist and favorite products

### Store Management
- Vendor dashboard for inventory management
- Sales analytics and reporting
- Promotional tools for stores
- Real-time order notifications

## 🎯 Indian Market Focus

### Product Categories
- **Staples**: Rice, wheat flour, lentils, cooking oils
- **Spices & Masalas**: Whole spices, ground spices, spice mixes
- **Snacks**: Traditional Indian snacks, namkeens, sweets
- **Fresh Produce**: Vegetables, fruits, herbs used in Indian cooking
- **Dairy**: Milk, yogurt, paneer, traditional dairy products
- **Beverages**: Tea, coffee, traditional drinks
- **Personal Care**: Ayurvedic products, traditional beauty items
- **Kitchenware**: Traditional cooking utensils, appliances

### Regional Specialization
- State-specific products and brands
- Regional festival specials
- Local vendor partnerships
- Cultural dietary preferences

## 🔄 Development Workflow

1. Frontend runs on http://localhost:3000
2. Backend runs on http://localhost:5000
3. API documentation available at http://localhost:5000/api-docs

## 📱 Mobile Support

Progressive Web App (PWA) optimized for mobile-first Indian grocery shopping experience.

## 🌐 Deployment

Ready for deployment on AWS/GCP with Docker containerization supporting Indian market scale.

## 🔐 Security Features

- JWT token authentication
- Password hashing with bcrypt
- PCI-DSS compliance for payments
- UPI integration security
- Input validation and sanitization
- Rate limiting for API protection

## 📊 Success Metrics

- **Order Fulfillment**: 95% on-time delivery rate
- **User Retention**: 30%+ repeat order rate within 6 months
- **Platform Uptime**: 99.9% availability
- **Customer Satisfaction**: High ratings for product quality and delivery
- **Regional Coverage**: Expansion across Indian states

## 🚀 Performance Optimizations

- Code splitting and lazy loading
- Image optimization for product catalogs
- Caching strategies for frequently accessed products
- CDN integration for fast loading across India
- Lighthouse score optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Email: support@freshbazaar.com
- Phone: 1800-FRESH-BAZAAR
- Live Chat: Available 24/7 on the platform

---

**Built with ❤️ for Indian families and their grocery needs**
