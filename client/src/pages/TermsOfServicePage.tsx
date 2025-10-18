import React from 'react';
import { FiFileText, FiShield, FiTruck, FiCreditCard } from 'react-icons/fi';

export const TermsOfServicePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <FiFileText className="text-4xl text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
            <p className="text-gray-600 mt-2">Last updated: December 2024</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Agreement to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using Instamart ("we," "our," or "us"), you accept and agree to be bound by the terms 
                and provision of this agreement. These Terms of Service govern your use of our e-commerce platform that 
                facilitates the purchase and delivery of authentic Indian products from India to the United States.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Service Description</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-blue-800">
                  <strong>Instamart</strong> is an international e-commerce platform specializing in authentic Indian products 
                  shipped directly from India to customers in the United States. Our service includes product sourcing, 
                  international shipping, customs handling, and delivery coordination.
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Accounts</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>You must be at least 18 years old to create an account</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                <li>You must provide accurate and complete information during registration</li>
                <li>You are responsible for all activities that occur under your account</li>
                <li>We reserve the right to suspend or terminate accounts that violate these terms</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiTruck className="text-green-600" />
                Ordering and Shipping
              </h2>
              
              <h3 className="text-xl font-medium text-gray-800 mb-3">Order Processing</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>All orders are subject to product availability and acceptance</li>
                <li>We reserve the right to refuse or cancel any order at our discretion</li>
                <li>Order confirmation does not guarantee product availability</li>
                <li>Processing time: 2-3 business days before shipping from India</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">International Shipping</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Delivery timeframe: 7-15 business days from India to USA</li>
                <li>Shipping costs are calculated based on weight, destination, and service level</li>
                <li>We are not responsible for delays caused by customs, weather, or carrier issues</li>
                <li>Risk of loss passes to you upon delivery to the carrier</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">Customs and Duties</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">
                  <strong>Important:</strong> All applicable customs duties, taxes, and import fees are calculated and included 
                  in your total at checkout. However, in rare cases, additional fees may be required by US Customs, 
                  which would be the customer's responsibility.
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiCreditCard className="text-blue-600" />
                Pricing and Payment
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>All prices are displayed in USD and include applicable taxes and duties</li>
                <li>Payment is processed securely through Stripe</li>
                <li>We accept major credit cards, debit cards, and digital wallets</li>
                <li>Payment is charged when your order is confirmed</li>
                <li>We reserve the right to change prices without notice</li>
                <li>Promotional prices are subject to terms and conditions</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Returns and Refunds</h2>
              
              <h3 className="text-xl font-medium text-gray-800 mb-3">Return Policy</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Returns accepted within 30 days of delivery</li>
                <li>Items must be unopened, unused, and in original packaging</li>
                <li>Perishable items (fresh produce, dairy) cannot be returned</li>
                <li>Customer is responsible for return shipping costs</li>
                <li>Refund processing: 5-10 business days after we receive the returned item</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">Damaged or Defective Items</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Report damaged items within 48 hours of delivery</li>
                <li>Provide photos of damaged items and packaging</li>
                <li>We will provide prepaid return labels for damaged items</li>
                <li>Full refund or replacement provided for verified damage</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Product Information</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>We strive to provide accurate product descriptions and images</li>
                <li>Colors may vary due to monitor settings and photography</li>
                <li>Product specifications are provided by manufacturers</li>
                <li>We are not responsible for minor variations in product appearance</li>
                <li>Expiration dates are clearly marked for applicable products</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Prohibited Uses</h2>
              <p className="text-gray-700 mb-4">You may not use our service:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>To submit false or misleading information</li>
                <li>To upload or transmit viruses or any other type of malicious code</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiShield className="text-green-600" />
                Limitation of Liability
              </h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 mb-3">
                  <strong>DISCLAIMER:</strong> Our service is provided on an "as is" and "as available" basis. 
                  We make no representations or warranties of any kind, express or implied.
                </p>
                <p className="text-red-800">
                  In no case shall Instamart, our directors, officers, employees, affiliates, agents, contractors, 
                  interns, suppliers, service providers, or licensors be liable for any injury, loss, claim, 
                  or any direct, indirect, incidental, punitive, special, or consequential damages of any kind.
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Governing Law</h2>
              <p className="text-gray-700">
                These Terms of Service and any separate agreements whereby we provide you services shall be governed 
                by and construed in accordance with the laws of the United States and the state where our business 
                is registered.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to Terms</h2>
              <p className="text-gray-700">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                If a revision is material, we will try to provide at least 30 days notice prior to any new 
                terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Severability</h2>
              <p className="text-gray-700">
                In the event that any provision of these Terms of Service is determined to be unlawful, void, 
                or unenforceable, such provision shall nonetheless be enforceable to the fullest extent permitted 
                by applicable law, and the unenforceable portion shall be deemed to be severed from these Terms 
                of Service.
              </p>
            </div>

            <div className="bg-gray-100 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-700 mb-4">
                Questions about the Terms of Service should be sent to us at:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> legal@instamart.com</p>
                <p><strong>Address:</strong> Instamart Legal Department, [Your Business Address]</p>
                <p><strong>Phone:</strong> 1-800-INSTAMART</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
