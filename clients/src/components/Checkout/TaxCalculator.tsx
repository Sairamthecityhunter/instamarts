import React, { useState, useEffect } from 'react';
import { FiInfo, FiDollarSign } from 'react-icons/fi';
import { US_STATES, calculateTotalTax, formatCurrency, TaxCalculation } from '../../utils/taxCalculator';

interface TaxCalculatorProps {
  subtotal: number;
  productCategories: string[];
  onTaxCalculated: (calculation: TaxCalculation) => void;
  selectedState?: string;
}

export const TaxCalculator: React.FC<TaxCalculatorProps> = ({
  subtotal,
  productCategories,
  onTaxCalculated,
  selectedState = ''
}) => {
  const [stateCode, setStateCode] = useState(selectedState);
  const [calculation, setCalculation] = useState<TaxCalculation | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);

  useEffect(() => {
    if (stateCode && subtotal > 0) {
      const calc = calculateTotalTax(subtotal, stateCode, productCategories);
      setCalculation(calc);
      onTaxCalculated(calc);
    }
  }, [subtotal, stateCode, productCategories, onTaxCalculated]);

  const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStateCode(event.target.value);
  };

  return (
    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
      <div className="flex items-center gap-2 mb-4">
        <FiDollarSign className="text-blue-600" />
        <h3 className="text-lg font-semibold text-blue-800">Tax & Duty Calculator</h3>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Your State (for sales tax calculation)
        </label>
        <select
          value={stateCode}
          onChange={handleStateChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select a state...</option>
          {US_STATES.map((state) => (
            <option key={state.code} value={state.code}>
              {state.name}
            </option>
          ))}
        </select>
      </div>

      {calculation && (
        <div className="space-y-3">
            <div className="bg-white rounded-lg p-4 border">
              <h4 className="font-semibold text-gray-900 mb-3 text-center">
                📋 Tax & Duty Breakdown
              </h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Product Subtotal</span>
                  <span className="font-medium">{formatCurrency(calculation.subtotal)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    {calculation.stateName} Sales Tax ({(calculation.salesTaxRate * 100).toFixed(2)}%)
                  </span>
                  <span className="font-medium text-blue-600">{formatCurrency(calculation.salesTax)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">US Customs Duty</span>
                  <span className="font-medium text-orange-600">{formatCurrency(calculation.customsDuty)}</span>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-gray-600">Import Processing Fee</span>
                  <span className="font-medium text-purple-600">{formatCurrency(calculation.importFee)}</span>
                </div>
                
                <div className="pt-2">
                  <div className="text-center text-xs text-gray-500 mb-2">
                    💡 Total calculated automatically in order summary
                  </div>
                </div>
              </div>
            </div>

          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
          >
            <FiInfo />
            {showBreakdown ? 'Hide' : 'Show'} Tax Breakdown Details
          </button>

          {showBreakdown && (
            <div className="bg-gray-50 rounded-lg p-4 text-sm">
              <h4 className="font-semibold mb-2">Tax & Duty Information:</h4>
              <ul className="space-y-1 text-gray-700">
                <li>• <strong>Sales Tax:</strong> Applied based on your state's tax rate</li>
                <li>• <strong>Customs Duty:</strong> US import duty on Indian products (varies by category)</li>
                <li>• <strong>Processing Fee:</strong> US Customs processing fee (0.3464% of value, min $25, max $485)</li>
                <li>• <strong>All Inclusive:</strong> No hidden fees - this is your final amount</li>
              </ul>
              
              <div className="mt-3 p-3 bg-blue-100 rounded border-l-4 border-blue-500">
                <p className="text-blue-800 text-xs">
                  <strong>Note:</strong> Tax rates are estimates based on current US regulations. 
                  Actual duties may vary slightly based on specific product classification and current trade agreements.
                </p>
              </div>
            </div>
          )}

          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
            <div className="flex items-start gap-2">
              <div className="text-green-600 mt-0.5">✓</div>
              <div className="text-sm text-green-800">
                <strong>Transparent Pricing:</strong> All taxes, duties, and fees are calculated upfront. 
                No surprises at delivery - this is exactly what you'll pay.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
