import React from 'react';
import { FiShield, FiLock, FiEye, FiMail } from 'react-icons/fi';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <FiShield className="text-4xl text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
            <p className="text-gray-600 mt-2">Last updated: December 2024</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Overview</h2>
              <p className="text-gray-700 leading-relaxed">
                At Instamart, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our 
                e-commerce platform for purchasing authentic Indian products delivered from India to the USA.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiEye className="text-blue-600" />
                Information We Collect
              </h2>
              
              <h3 className="text-xl font-medium text-gray-800 mb-3">Personal Information</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Name, email address, phone number</li>
                <li>Shipping and billing addresses</li>
                <li>Payment information (processed securely through Stripe)</li>
                <li>Account credentials (username, encrypted password)</li>
                <li>Purchase history and preferences</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">Automatically Collected Information</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>IP address and browser information</li>
                <li>Device information and operating system</li>
                <li>Website usage data and analytics</li>
                <li>Cookies and similar tracking technologies</li>
                <li>Location data (with your permission)</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Order Processing:</strong> To process and fulfill your orders, including payment processing and shipping</li>
                <li><strong>Communication:</strong> To send order confirmations, shipping updates, and customer service communications</li>
                <li><strong>Account Management:</strong> To create and manage your account, including authentication and security</li>
                <li><strong>Personalization:</strong> To provide personalized product recommendations and improve your shopping experience</li>
                <li><strong>Legal Compliance:</strong> To comply with US customs, tax, and import regulations</li>
                <li><strong>Marketing:</strong> To send promotional emails and offers (with your consent)</li>
                <li><strong>Analytics:</strong> To analyze website usage and improve our services</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiLock className="text-green-600" />
                Information Security
              </h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-medium text-green-800 mb-2">Security Measures</h3>
                <ul className="list-disc list-inside text-green-700 space-y-1">
                  <li>SSL/TLS encryption for all data transmission</li>
                  <li>Secure payment processing through Stripe (PCI DSS compliant)</li>
                  <li>Password hashing using industry-standard bcrypt</li>
                  <li>Regular security audits and updates</li>
                  <li>Access controls and employee training</li>
                </ul>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information Sharing</h2>
              <p className="text-gray-700 mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Service Providers:</strong> With trusted partners who help us operate our business (payment processors, shipping companies, email services)</li>
                <li><strong>Legal Requirements:</strong> When required by law, court order, or government regulation</li>
                <li><strong>Business Transfer:</strong> In the event of a merger, acquisition, or sale of assets</li>
                <li><strong>Consent:</strong> With your explicit consent for specific purposes</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">International Data Transfer</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800">
                  <strong>India to USA Operations:</strong> As we ship products from India to the USA, your information may be 
                  processed in both countries. We ensure appropriate safeguards are in place to protect your data during 
                  international transfers, including compliance with applicable data protection laws.
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
              <p className="text-gray-700 mb-4">You have the following rights regarding your personal information:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal obligations)</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications at any time</li>
                <li><strong>Cookies:</strong> Manage cookie preferences through your browser settings</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookies Policy</h2>
              <p className="text-gray-700 mb-4">
                We use cookies and similar technologies to enhance your browsing experience:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Essential Cookies:</strong> Required for website functionality and security</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how you use our website</li>
                <li><strong>Marketing Cookies:</strong> Used for personalized advertising (with consent)</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Children's Privacy</h2>
              <p className="text-gray-700">
                Our service is not intended for children under 13 years of age. We do not knowingly collect personal 
                information from children under 13. If you are a parent or guardian and believe your child has provided 
                us with personal information, please contact us to have it removed.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to This Policy</h2>
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the 
                new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this 
                Privacy Policy periodically for any changes.
              </p>
            </div>

            <div className="bg-gray-100 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiMail className="text-blue-600" />
                Contact Us
              </h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> privacy@instamart.com</p>
                <p><strong>Address:</strong> Instamart Privacy Team, [Your Business Address]</p>
                <p><strong>Phone:</strong> 1-800-INSTAMART</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
