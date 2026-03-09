import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { setCredentials, hideAuthModal, setLoading, showAuthModal as showAuthModalAction } from '../../store/slices/authSlice';
import { toast } from 'react-hot-toast';
import { FiX, FiEye, FiEyeOff, FiPhone, FiMail, FiUser, FiDatabase } from 'react-icons/fi';

interface LoginForm {
  email: string;
  password: string;
}

interface SignupForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface StoredAccount {
  email: string;
  name: string;
  createdAt: string;
}

const AuthModal: React.FC = () => {
  const dispatch = useDispatch();
  const { showAuthModal, authMode, isLoading } = useSelector((state: RootState) => state.auth);
  
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: '',
    password: ''
  });
  
  const [signupForm, setSignupForm] = useState<SignupForm>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showStoredAccounts, setShowStoredAccounts] = useState(false);
  const [storedAccounts, setStoredAccounts] = useState<StoredAccount[]>([]);

  // Load stored accounts from localStorage
  useEffect(() => {
    loadStoredAccounts();
  }, []);

  const loadStoredAccounts = () => {
    try {
      const accounts = localStorage.getItem('freshbazaar_accounts');
      if (accounts) {
        setStoredAccounts(JSON.parse(accounts));
      }
    } catch (error) {
      console.error('Error loading stored accounts:', error);
    }
  };

  const saveAccountToHistory = (user: any) => {
    try {
      const accounts = JSON.parse(localStorage.getItem('freshbazaar_accounts') || '[]');
      const newAccount: StoredAccount = {
        email: user.email,
        name: user.name,
        createdAt: new Date().toISOString()
      };
      
      // Check if account already exists
      const existingIndex = accounts.findIndex((acc: StoredAccount) => acc.email === user.email);
      if (existingIndex >= 0) {
        accounts[existingIndex] = newAccount; // Update existing
      } else {
        accounts.unshift(newAccount); // Add new at beginning
      }
      
      // Keep only last 5 accounts
      const limitedAccounts = accounts.slice(0, 5);
      localStorage.setItem('freshbazaar_accounts', JSON.stringify(limitedAccounts));
      setStoredAccounts(limitedAccounts);
    } catch (error) {
      console.error('Error saving account to history:', error);
    }
  };

  const handleCloseModal = () => {
    dispatch(hideAuthModal());
    setLoginForm({ email: '', password: '' });
    setSignupForm({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
    setShowStoredAccounts(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginForm.email || !loginForm.password) {
      toast.error('Please fill in all fields');
      return;
    }

    dispatch(setLoading(true));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data - in real app, this would come from your API
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: loginForm.email,
        phone: '+91 98765 43210',
        avatar: 'https://via.placeholder.com/100',
        isInstamartPlus: false,
        addresses: []
      };
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      dispatch(setCredentials({ user: mockUser, token: mockToken }));
      saveAccountToHistory(mockUser);
      
      toast.success('✅ Welcome back to FreshBazaar! Your session is saved locally.', {
        duration: 4000,
      });
      handleCloseModal();
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signupForm.name || !signupForm.email || !signupForm.phone || !signupForm.password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (signupForm.password !== signupForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (signupForm.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    dispatch(setLoading(true));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock user data - in real app, this would come from your API
      const mockUser = {
        id: Date.now().toString(),
        name: signupForm.name,
        email: signupForm.email,
        phone: signupForm.phone,
        avatar: 'https://via.placeholder.com/100',
        isInstamartPlus: false,
        addresses: []
      };
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      dispatch(setCredentials({ user: mockUser, token: mockToken }));
      saveAccountToHistory(mockUser);
      
      toast.success('🎉 Account created successfully! Your data is saved locally for easy access.', {
        duration: 5000,
      });
      handleCloseModal();
    } catch (error) {
      toast.error('Signup failed. Please try again.');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleUseStoredAccount = (account: StoredAccount) => {
    setLoginForm({
      email: account.email,
      password: 'demo123' // Demo password
    });
    setShowStoredAccounts(false);
    toast(`Using stored account: ${account.name}`, {
      icon: 'ℹ️',
      duration: 3000,
    });
  };

  const clearStoredAccounts = () => {
    localStorage.removeItem('freshbazaar_accounts');
    setStoredAccounts([]);
    toast.success('Stored accounts cleared');
    setShowStoredAccounts(false);
  };

  if (!showAuthModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleCloseModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <FiX className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-green-600">🛒</span>
            <span className="ml-2 text-xl font-bold text-gray-900">FreshBazaar</span>
            <span className="ml-2 text-lg">🇮🇳</span>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-900">
            {authMode === 'login' ? 'Welcome Back!' : 'Join FreshBazaar'}
          </h2>
          <p className="text-center text-gray-600 mt-2">
            {authMode === 'login' 
              ? 'Sign in to continue shopping for Indian groceries' 
              : 'Create your account to start shopping'}
          </p>
          
          {/* Storage Info */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800 text-sm">
              <FiDatabase className="w-4 h-4" />
              <span>Your account data is safely stored locally</span>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {!showStoredAccounts ? (
            <>
              {authMode === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-green-400 transition-colors"
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </button>

                  {/* Stored Accounts Button */}
                  {storedAccounts.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowStoredAccounts(true)}
                      className="w-full bg-blue-50 text-blue-700 py-2 rounded-lg font-medium hover:bg-blue-100 transition-colors text-sm"
                    >
                      <FiDatabase className="inline w-4 h-4 mr-2" />
                      Use Stored Account ({storedAccounts.length})
                    </button>
                  )}

                  {/* Switch to Signup */}
                  <p className="text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => dispatch(showAuthModalAction('signup'))}
                      className="text-green-600 hover:text-green-700 font-medium"
                    >
                      Sign Up
                    </button>
                  </p>
                </form>
              ) : (
                <form onSubmit={handleSignup} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={signupForm.name}
                        onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={signupForm.email}
                        onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        value={signupForm.phone}
                        onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="+91 98765 43210"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={signupForm.password}
                        onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                        className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Create a password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={signupForm.confirmPassword}
                        onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                        className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Confirm your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>

                  {/* Signup Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-green-400 transition-colors"
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </button>

                  {/* Switch to Login */}
                  <p className="text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => dispatch(showAuthModalAction('login'))}
                      className="text-green-600 hover:text-green-700 font-medium"
                    >
                      Sign In
                    </button>
                  </p>
                </form>
              )}

              {/* Demo Credentials */}
              {authMode === 'login' && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800 font-medium mb-2">Demo Credentials:</p>
                  <p className="text-xs text-green-700">
                    Email: demo@freshbazaar.com<br />
                    Password: demo123
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginForm({
                        email: 'demo@freshbazaar.com',
                        password: 'demo123'
                      });
                    }}
                    className="mt-2 text-xs text-green-600 hover:text-green-700 underline"
                  >
                    Fill Demo Credentials
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Stored Accounts View */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Stored Accounts</h3>
                <button
                  onClick={() => setShowStoredAccounts(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Back
                </button>
              </div>
              
              <div className="space-y-3">
                {storedAccounts.map((account, index) => (
                  <button
                    key={index}
                    onClick={() => handleUseStoredAccount(account)}
                    className="w-full p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-left"
                  >
                    <div className="font-medium text-gray-900">{account.name}</div>
                    <div className="text-sm text-gray-600">{account.email}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Created: {new Date(account.createdAt).toLocaleDateString()}
                    </div>
                  </button>
                ))}
              </div>
              
              <button
                onClick={clearStoredAccounts}
                className="w-full py-2 text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Clear All Stored Accounts
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal; 