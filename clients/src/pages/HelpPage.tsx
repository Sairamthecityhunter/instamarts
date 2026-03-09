import React, { useState } from 'react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface SupportOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: string;
}

const HelpPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('general');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    issue: '',
    description: ''
  });

  const categories = [
    { id: 'general', name: 'General', icon: '❓' },
    { id: 'orders', name: 'Orders', icon: '📦' },
    { id: 'payments', name: 'Payments', icon: '💳' },
    { id: 'delivery', name: 'Delivery', icon: '🚚' },
    { id: 'account', name: 'Account', icon: '👤' }
  ];

  const faqs: FAQItem[] = [
    {
      id: '1',
      question: 'How do I track my order?',
      answer: 'You can track your order in real-time through the "Track Order" feature in your order history. We\'ll also send you SMS updates about your order status.',
      category: 'orders'
    },
    {
      id: '2',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit/debit cards, UPI, digital wallets (Paytm, PhonePe, Google Pay), and cash on delivery.',
      category: 'payments'
    },
    {
      id: '3',
      question: 'How long does delivery take?',
      answer: 'Delivery time varies by location and restaurant. Typically, orders are delivered within 30-45 minutes. You can see the estimated delivery time when placing your order.',
      category: 'delivery'
    },
    {
      id: '4',
      question: 'Can I cancel my order?',
      answer: 'You can cancel your order within 1 minute of placing it. After that, please contact our support team for assistance.',
      category: 'orders'
    },
    {
      id: '5',
      question: 'How do I update my delivery address?',
      answer: 'Go to your profile section and select "My Addresses" to add, edit, or remove delivery addresses.',
      category: 'account'
    },
    {
      id: '6',
      question: 'What is FreshBazaar Premium?',
      answer: 'FreshBazaar Premium is our premium subscription service that offers unlimited free deliveries, exclusive offers, and priority customer support for Indian groceries.',
      category: 'general'
    },
    {
      id: '7',
      question: 'How do I report a missing item?',
      answer: 'If you find items missing from your order, please contact our support team within 24 hours of delivery. We\'ll help you get a refund or replacement.',
      category: 'orders'
    },
    {
      id: '8',
      question: 'Is there a minimum order value?',
      answer: 'Minimum order values vary by restaurant. You can see the minimum order requirement when browsing each restaurant\'s menu.',
      category: 'general'
    }
  ];

  const supportOptions: SupportOption[] = [
    {
      id: '1',
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      icon: '💬',
      action: 'Start Chat'
    },
    {
      id: '2',
      title: 'Call Us',
      description: 'Speak directly with our customer service',
      icon: '📞',
      action: 'Call Now'
    },
    {
      id: '3',
      title: 'Email Support',
      description: 'Send us an email and we\'ll respond within 24 hours',
      icon: '✉️',
      action: 'Send Email'
    },
    {
      id: '4',
      title: 'Report Issue',
      description: 'Report a problem with your order or account',
      icon: '🚨',
      action: 'Report Issue'
    }
  ];

  const filteredFAQs = faqs.filter(faq => faq.category === activeCategory);

  const handleFAQToggle = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleSupportAction = (option: SupportOption) => {
    switch (option.id) {
      case '1':
        alert('Opening live chat...');
        break;
      case '2':
        window.open('tel:1800-123-4567');
        break;
      case '3':
        window.open('mailto:support@freshbazaar.com');
        break;
      case '4':
        setShowContactForm(true);
        break;
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for contacting us. We\'ll get back to you within 24 hours.');
    setShowContactForm(false);
    setContactForm({ name: '', email: '', phone: '', issue: '', description: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Help & Support</h1>
            <p className="text-gray-600">
              Find answers to common questions or get in touch with our support team
            </p>
          </div>

          {/* Support Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {supportOptions.map((option) => (
              <div key={option.id} className="bg-white rounded-lg p-6 shadow-sm text-center">
                <div className="text-3xl mb-3">{option.icon}</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {option.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {option.description}
                </p>
                <button
                  onClick={() => handleSupportAction(option)}
                  className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  {option.action}
                </button>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
            
            {/* Category Tabs */}
            <div className="flex space-x-2 mb-6 overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap flex items-center gap-2 ${
                    activeCategory === category.id
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>

            {/* FAQ Items */}
            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <div key={faq.id} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => handleFAQToggle(faq.id)}
                    className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50"
                  >
                    <span className="font-medium text-gray-800">{faq.question}</span>
                    <span className="text-gray-500">
                      {expandedFAQ === faq.id ? '−' : '+'}
                    </span>
                  </button>
                  {expandedFAQ === faq.id && (
                    <div className="px-4 pb-3 text-gray-600">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form Modal */}
          {showContactForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Report an Issue</h3>
                  <button
                    onClick={() => setShowContactForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Issue Type
                    </label>
                    <select
                      value={contactForm.issue}
                      onChange={(e) => setContactForm({ ...contactForm, issue: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      required
                    >
                      <option value="">Select an issue</option>
                      <option value="missing_item">Missing Item</option>
                      <option value="wrong_item">Wrong Item</option>
                      <option value="delivery_issue">Delivery Issue</option>
                      <option value="payment_issue">Payment Issue</option>
                      <option value="account_issue">Account Issue</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={contactForm.description}
                      onChange={(e) => setContactForm({ ...contactForm, description: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      rows={3}
                      placeholder="Please describe your issue in detail..."
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowContactForm(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Additional Help */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Still Need Help?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Customer Service</h3>
                <p className="text-gray-600 text-sm mb-2">
                  Available 24/7 to help you with any questions or issues.
                </p>
                <p className="text-gray-600 text-sm">
                  📞 1800-123-4567<br />
                  ✉️ support@freshbazaar.com
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Response Time</h3>
                <p className="text-gray-600 text-sm mb-2">
                  We aim to respond to all inquiries within:
                </p>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Live Chat: Instant</li>
                  <li>• Phone: Within 5 minutes</li>
                  <li>• Email: Within 24 hours</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage; 