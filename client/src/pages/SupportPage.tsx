import React, { useState } from 'react';
import { FiMail, FiPhone, FiMessageCircle, FiHelpCircle, FiClock, FiGlobe } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

export const SupportPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orderNumber: '',
    subject: '',
    message: '',
    priority: 'medium'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Support ticket submitted successfully! We\'ll get back to you within 24 hours.');
      setFormData({
        name: '',
        email: '',
        orderNumber: '',
        subject: '',
        message: '',
        priority: 'medium'
      });
    } catch (error) {
      toast.error('Failed to submit support ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const supportChannels = [
    {
      icon: <FiMail className="w-6 h-6" />,
      title: 'Email Support',
      description: 'support@instamart.com',
      responseTime: 'Response within 24 hours',
      color: 'bg-blue-50 border-blue-200 text-blue-700'
    },
    {
      icon: <FiPhone className="w-6 h-6" />,
      title: 'Phone Support',
      description: '1-800-INSTAMART',
      responseTime: 'Mon-Fri, 9 AM - 6 PM EST',
      color: 'bg-green-50 border-green-200 text-green-700'
    },
    {
      icon: <FiMessageCircle className="w-6 h-6" />,
      title: 'Live Chat',
      description: 'Chat with our team',
      responseTime: 'Usually replies instantly',
      color: 'bg-purple-50 border-purple-200 text-purple-700'
    }
  ];

  const commonIssues = [
    {
      icon: '📦',
      title: 'Order Tracking',
      description: 'Track your international shipment from India to USA'
    },
    {
      icon: '💳',
      title: 'Payment Issues',
      description: 'Problems with payments, refunds, or billing'
    },
    {
      icon: '🚚',
      title: 'Shipping & Delivery',
      description: 'Questions about international shipping and customs'
    },
    {
      icon: '↩️',
      title: 'Returns & Refunds',
      description: 'Return products or request refunds'
    },
    {
      icon: '🏷️',
      title: 'Product Information',
      description: 'Questions about Indian products and authenticity'
    },
    {
      icon: '🔐',
      title: 'Account Issues',
      description: 'Login problems, password reset, account settings'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            How can we help you?
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Get support for your India-to-USA grocery orders
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <FiClock className="text-green-600" />
              <span>24/7 Support Available</span>
            </div>
            <div className="flex items-center gap-2">
              <FiGlobe className="text-blue-600" />
              <span>International Shipping Experts</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Support Channels */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Us</h2>
            <div className="space-y-4">
              {supportChannels.map((channel, index) => (
                <div key={index} className={`border rounded-lg p-4 ${channel.color}`}>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {channel.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{channel.title}</h3>
                      <p className="font-medium mb-1">{channel.description}</p>
                      <p className="text-sm opacity-75">{channel.responseTime}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Common Issues */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Issues</h3>
              <div className="space-y-2">
                {commonIssues.map((issue, index) => (
                  <button
                    key={index}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{issue.icon}</span>
                      <div>
                        <h4 className="font-medium text-gray-900">{issue.title}</h4>
                        <p className="text-sm text-gray-600">{issue.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Support Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit a Support Ticket</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order Number (if applicable)
                    </label>
                    <input
                      type="text"
                      name="orderNumber"
                      value={formData.orderNumber}
                      onChange={handleInputChange}
                      placeholder="ORD123456789"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority Level
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low - General inquiry</option>
                      <option value="medium">Medium - Order issue</option>
                      <option value="high">High - Urgent problem</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    placeholder="Brief description of your issue"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    placeholder="Please provide as much detail as possible about your issue..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Submitting...
                    </div>
                  ) : (
                    'Submit Support Ticket'
                  )}
                </button>
              </form>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <FiHelpCircle className="text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Need faster help?</p>
                    <p>
                      For urgent issues with international orders, customs, or payments, 
                      use our live chat feature for immediate assistance from our India-USA 
                      shipping specialists.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">
              Quick answers to common questions about India-to-USA shipping
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                🚚 How long does international shipping take?
              </h3>
              <p className="text-gray-700">
                Orders typically arrive in 7-15 business days from India to USA. This includes 
                processing time, international transit, and customs clearance.
              </p>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                💰 Are customs duties included in the price?
              </h3>
              <p className="text-gray-700">
                Yes! All customs duties, import fees, and US sales tax are calculated and included 
                in your total at checkout. No surprise fees upon delivery.
              </p>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                ↩️ What is your return policy?
              </h3>
              <p className="text-gray-700">
                We offer a 30-day return policy for most items. Items must be unopened and in 
                original packaging. Perishable items have a 48-hour return window.
              </p>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                💳 What payment methods do you accept?
              </h3>
              <p className="text-gray-700">
                We accept all major credit cards (Visa, MasterCard, American Express) through 
                our secure Stripe payment system. All payments are processed in USD.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
