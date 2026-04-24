import React from 'react';
import { Link } from 'react-router-dom';
import { FiTwitter, FiFacebook, FiInstagram, FiLinkedin } from 'react-icons/fi';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-green-600">🛒</span>
              <span className="ml-2 text-xl font-bold text-white">Instamart</span>
              <span className="ml-2 text-lg">🇮🇳➡️🇺🇸</span>
            </div>
            <p className="text-gray-300 mb-4">
              Authentic Indian products delivered from India to USA. Bringing the taste of home to your doorstep.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <FiTwitter className="h-5 w-5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <FiFacebook className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <FiInstagram className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <FiLinkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-300 hover:text-white">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/partner" className="text-gray-300 hover:text-white">
                  Partner with Us
                </Link>
              </li>
              <li>
                <Link to="/sustainability" className="text-gray-300 hover:text-white">
                  Sustainability
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-gray-300 hover:text-white">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-300 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-gray-300 hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="text-gray-300 hover:text-white">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 pb-[max(1rem,env(safe-area-inset-bottom,0px))]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-gray-400 text-sm break-words px-2 md:px-0">
              © {currentYear} Instamart. All rights reserved.
            </p>
            <div className="flex items-center justify-center md:justify-end mt-0 md:mt-0 px-2">
              <span className="text-gray-400 text-sm break-words max-w-full">
                🇮🇳 India to 🇺🇸 USA • Authentic Products • Secure Shipping
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 