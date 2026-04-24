import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { store } from './store/store';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import MobileSidebar from './components/Layout/MobileSidebar';
import HomePage from './pages/HomePage';
import GroceryPage from './pages/GroceryPage';
import SearchPage from './pages/SearchPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import AddressesPage from './pages/AddressesPage';
import PremiumPage from './pages/PremiumPage';
import HelpPage from './pages/HelpPage';
import StorePage from './pages/StorePage';
import StoreListPage from './pages/StoreListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AuthModal from './components/Auth/AuthModal';
import PostProductPage from './pages/PostProductPage';
import InstamartPage from './pages/InstamartPage';
import SubscriptionPage from './pages/SubscriptionPage';
import GroupOrderPage from './pages/GroupOrderPage';
import AdminDashboard from './pages/AdminDashboard';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsOfServicePage } from './pages/TermsOfServicePage';
import { RefundPolicyPage } from './pages/RefundPolicyPage';
import { SupportPage } from './pages/SupportPage';
import ContactPage from './pages/ContactPage';
import MenuPage from './pages/MenuPage';
import { StripeProvider } from './components/Payment/StripeProvider';
import { LiveChat } from './components/Support/LiveChat';
import { GoogleAnalyticsTracker, initGA } from './components/Analytics/GoogleAnalytics';
import { FacebookPixelTracker } from './components/Analytics/FacebookPixel';
import { initializeExchangeRate } from './utils/currency';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function App() {
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  
  // Initialize analytics and exchange rate
  React.useEffect(() => {
    initGA();
    initializeExchangeRate();
  }, []);
  
  return (
    <HelmetProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <StripeProvider>
            <Router>
              <div className="App min-h-screen bg-gray-50 w-full max-w-[100vw] overflow-x-hidden">
                <Header />
                <MobileSidebar />
                <main className="min-h-screen w-full overflow-x-hidden">
                  <Routes>
                  {/* Main Pages */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/menu" element={<MenuPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  
                  {/* Instamart Features */}
                  <Route path="/instamart" element={<InstamartPage />} />
                  <Route path="/subscriptions" element={<SubscriptionPage />} />
                  <Route path="/group-orders" element={<GroupOrderPage />} />
                  <Route path="/group-order/join/:orderId" element={<GroupOrderPage />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  
                  {/* Grocery & Products */}
                  <Route path="/groceries" element={<GroceryPage />} />
                  <Route path="/groceries/:category" element={<GroceryPage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  
                  {/* Stores */}
                  <Route path="/stores" element={<StoreListPage />} />
                  <Route path="/store/:storeId" element={<StorePage />} />
                  
                  {/* Cart & Checkout */}
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  
                  {/* Order Management */}
                  <Route path="/track-order/:orderId" element={<OrderTrackingPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  
                  {/* User Account */}
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/addresses" element={<AddressesPage />} />
                  <Route path="/premium" element={<PremiumPage />} />
                  <Route path="/post-product" element={<PostProductPage />} />
                  
                  {/* Support & Legal */}
                  <Route path="/help" element={<HelpPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                  <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                  <Route path="/refund-policy" element={<RefundPolicyPage />} />
                  <Route path="/support" element={<SupportPage />} />
                  
                  {/* Category Routes for Indian Groceries */}
                  <Route path="/staples" element={<GroceryPage />} />
                  <Route path="/spices" element={<GroceryPage />} />
                  <Route path="/snacks" element={<GroceryPage />} />
                  <Route path="/fresh-produce" element={<GroceryPage />} />
                  <Route path="/dairy" element={<GroceryPage />} />
                  <Route path="/beverages" element={<GroceryPage />} />
                  <Route path="/personal-care" element={<GroceryPage />} />
                  <Route path="/kitchenware" element={<GroceryPage />} />
                  
                  {/* Regional Specialties */}
                  <Route path="/regional/:region" element={<GroceryPage />} />
                  <Route path="/festival-specials" element={<GroceryPage />} />
                </Routes>
              </main>
              <Footer />
              <AuthModal />
              <LiveChat 
                isOpen={isChatOpen} 
                onToggle={() => setIsChatOpen(!isChatOpen)} 
              />
              <GoogleAnalyticsTracker />
              <FacebookPixelTracker />
              <Toaster 
                position="bottom-center"
                containerStyle={{
                  bottom: 'max(1rem, env(safe-area-inset-bottom, 0px))',
                  left: 'max(0.5rem, env(safe-area-inset-left, 0px))',
                  right: 'max(0.5rem, env(safe-area-inset-right, 0px))',
                }}
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#2D7D32',
                    color: '#fff',
                    maxWidth: 'min(100vw - 2rem, 24rem)',
                  },
                }}
              />
              </div>
            </Router>
          </StripeProvider>
        </QueryClientProvider>
      </Provider>
    </HelmetProvider>
  );
}

export default App; 