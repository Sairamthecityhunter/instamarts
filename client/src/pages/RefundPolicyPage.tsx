import React from 'react';
import { FiRefreshCw, FiClock, FiPackage, FiDollarSign } from 'react-icons/fi';

export const RefundPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <FiRefreshCw className="text-4xl text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900">Refund & Return Policy</h1>
            <p className="text-gray-600 mt-2">Last updated: December 2024</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Commitment</h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800">
                  At Instamart, we stand behind the quality of our authentic Indian products. If you're not completely 
                  satisfied with your purchase, we're here to help with our comprehensive return and refund policy.
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiClock className="text-blue-600" />
                Return Timeframe
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Standard Returns</h3>
                  <p className="text-blue-700">
                    <strong>30 days</strong> from delivery date for most products
                  </p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">Perishable Items</h3>
                  <p className="text-yellow-700">
                    <strong>48 hours</strong> from delivery for fresh/perishable products
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiPackage className="text-green-600" />
                Return Conditions
              </h2>
              
              <h3 className="text-xl font-medium text-gray-800 mb-3">Eligible for Return</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Items in original, unopened packaging</li>
                <li>Products in new, unused condition</li>
                <li>All original labels and tags intact</li>
                <li>Accompanied by original receipt or order confirmation</li>
                <li>Non-perishable items within 30-day window</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">Not Eligible for Return</h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <ul className="list-disc list-inside text-red-700 space-y-2">
                  <li>Opened food items or consumables</li>
                  <li>Perishable products beyond 48-hour window</li>
                  <li>Items damaged by misuse or normal wear</li>
                  <li>Custom or personalized products</li>
                  <li>Items without original packaging</li>
                </ul>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Return Process</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold">1</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Initiate Return Request</h3>
                    <p className="text-gray-700">
                      Contact our customer service team at <strong>returns@instamart.com</strong> or through your account 
                      dashboard. Provide your order number and reason for return.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold">2</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Return Authorization</h3>
                    <p className="text-gray-700">
                      We'll review your request and provide a Return Merchandise Authorization (RMA) number and 
                      return instructions within 24 hours.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold">3</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Package and Ship</h3>
                    <p className="text-gray-700">
                      Securely package the item(s) with the RMA number clearly marked. Use the provided return label 
                      or ship to our return facility.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold">4</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Processing & Refund</h3>
                    <p className="text-gray-700">
                      Once we receive and inspect your return, we'll process your refund within 5-10 business days.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiDollarSign className="text-green-600" />
                Refund Information
              </h2>
              
              <h3 className="text-xl font-medium text-gray-800 mb-3">Refund Methods</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li><strong>Original Payment Method:</strong> Refunds are processed to your original form of payment</li>
                <li><strong>Credit Card:</strong> 3-5 business days to appear on statement</li>
                <li><strong>Debit Card:</strong> 5-10 business days to appear in account</li>
                <li><strong>Digital Wallet:</strong> 1-3 business days</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">Refund Amount</h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>Product Cost:</strong> Full refund of item price</li>
                  <li><strong>Shipping Costs:</strong> Original shipping charges are non-refundable (except for our error)</li>
                  <li><strong>Return Shipping:</strong> Customer responsibility unless item is defective</li>
                  <li><strong>Taxes & Duties:</strong> Refunded proportionally</li>
                </ul>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Special Circumstances</h2>
              
              <h3 className="text-xl font-medium text-gray-800 mb-3">Damaged or Defective Items</h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <ul className="list-disc list-inside text-green-700 space-y-2">
                  <li>Full refund including original shipping costs</li>
                  <li>Free return shipping with prepaid label</li>
                  <li>Option for replacement or full refund</li>
                  <li>Expedited processing within 2-3 business days</li>
                </ul>
              </div>

              <h3 className="text-xl font-medium text-gray-800 mb-3">Wrong Item Received</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <ul className="list-disc list-inside text-blue-700 space-y-2">
                  <li>Free return of incorrect item</li>
                  <li>Free shipping of correct item</li>
                  <li>Full refund if correct item unavailable</li>
                  <li>Priority customer service handling</li>
                </ul>
              </div>

              <h3 className="text-xl font-medium text-gray-800 mb-3">Lost or Delayed Shipments</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <ul className="list-disc list-inside text-yellow-700 space-y-2">
                  <li>Investigation period: 15 business days after expected delivery</li>
                  <li>Full refund if shipment confirmed lost</li>
                  <li>Replacement shipment for delayed orders (when possible)</li>
                  <li>Expedited shipping for replacement orders</li>
                </ul>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">International Shipping Considerations</h2>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-orange-800 mb-3">
                  <strong>Important for India-to-USA Orders:</strong>
                </p>
                <ul className="list-disc list-inside text-orange-700 space-y-2">
                  <li>Return shipping for international orders may take 2-4 weeks</li>
                  <li>Customs duties on returned items are non-refundable</li>
                  <li>Some items may not be eligible for return due to import restrictions</li>
                  <li>We'll work with you on case-by-case basis for international return challenges</li>
                </ul>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Exchanges</h2>
              <p className="text-gray-700 mb-4">
                We currently process exchanges as returns followed by new orders:
              </p>
              <ol className="list-decimal list-inside text-gray-700 space-y-2">
                <li>Return the original item following our return process</li>
                <li>Receive refund to your original payment method</li>
                <li>Place a new order for the desired item</li>
                <li>Contact customer service for expedited processing of exchange orders</li>
              </ol>
            </div>

            <div className="bg-gray-100 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Need Help?</h2>
              <p className="text-gray-700 mb-4">
                Our customer service team is here to help with any return or refund questions:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> returns@instamart.com</p>
                <p><strong>Phone:</strong> 1-800-INSTAMART (Mon-Fri, 9 AM - 6 PM EST)</p>
                <p><strong>Live Chat:</strong> Available on our website during business hours</p>
                <p><strong>Response Time:</strong> Within 24 hours for all inquiries</p>
              </div>
              
              <div className="mt-4 p-3 bg-blue-100 rounded border-l-4 border-blue-500">
                <p className="text-blue-800 text-sm">
                  <strong>Pro Tip:</strong> Keep your order confirmation email and take photos of damaged items 
                  immediately upon delivery to expedite the return process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
