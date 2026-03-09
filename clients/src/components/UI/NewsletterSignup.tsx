import React, { useState } from 'react';
import { FiMail, FiX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

interface NewsletterSignupProps {
  onClose?: () => void;
  showCloseButton?: boolean;
}

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  onClose,
  showCloseButton = false,
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // TODO: Implement API call to subscribe
      // await apiClient.newsletter.subscribe({ email });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Successfully subscribed! Check your email for a 10% discount code.');
      setEmail('');
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg p-6 relative">
      {showCloseButton && onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-200"
        >
          <FiX className="h-5 w-5" />
        </button>
      )}
      
      <div className="flex items-start gap-4">
        <div className="bg-white bg-opacity-20 rounded-full p-3">
          <FiMail className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2">Subscribe to Our Newsletter</h3>
          <p className="text-green-100 mb-4">
            Get exclusive deals, new product alerts, and a 10% discount on your first order!
          </p>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:outline-none"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-white text-green-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSignup;
