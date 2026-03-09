import React, { useState } from 'react';
import { FiBell, FiBellOff } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { addPriceAlert, removePriceAlert } from '../../store/slices/priceAlertsSlice';
import { RootState } from '../../store/store';
import { toast } from 'react-hot-toast';
import CurrencyConverter from '../International/CurrencyConverter';

interface PriceDropAlertProps {
  productId: string;
  productName: string;
  productImage: string;
  currentPrice: number;
}

const PriceDropAlert: React.FC<PriceDropAlertProps> = ({
  productId,
  productName,
  productImage,
  currentPrice,
}) => {
  const dispatch = useDispatch();
  const alerts = useSelector((state: RootState) => state.priceAlerts.alerts);
  const existingAlert = alerts.find(alert => alert.productId === productId);
  const [targetPrice, setTargetPrice] = useState(
    existingAlert?.targetPrice || Math.round(currentPrice * 0.9)
  );
  const [showInput, setShowInput] = useState(false);

  const handleSetAlert = () => {
    if (targetPrice >= currentPrice) {
      toast.error('Target price must be lower than current price');
      return;
    }

    dispatch(addPriceAlert({
      productId,
      productName,
      productImage,
      currentPrice,
      targetPrice,
    }));

    toast.success(`Price alert set! We'll notify you when price drops to ₹${targetPrice}`);
    setShowInput(false);
  };

  const handleRemoveAlert = () => {
    if (existingAlert) {
      dispatch(removePriceAlert(existingAlert.id));
      toast.success('Price alert removed');
    }
  };

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      {existingAlert ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FiBell className="h-5 w-5 text-yellow-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Price Alert Active</p>
              <p className="text-xs text-gray-600">
                Notify me when price drops to{' '}
                <CurrencyConverter inrPrice={existingAlert.targetPrice} className="font-medium" />
              </p>
            </div>
          </div>
          <button
            onClick={handleRemoveAlert}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
          >
            <FiBellOff className="h-4 w-4" />
            Remove
          </button>
        </div>
      ) : (
        <div>
          {!showInput ? (
            <button
              onClick={() => setShowInput(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              <FiBell className="h-5 w-5" />
              <span>Set Price Drop Alert</span>
            </button>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notify me when price drops to:
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">₹</span>
                  <input
                    type="number"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(Number(e.target.value))}
                    min={1}
                    max={currentPrice - 1}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Current price: <CurrencyConverter inrPrice={currentPrice} className="font-medium" />
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSetAlert}
                  className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Set Alert
                </button>
                <button
                  onClick={() => {
                    setShowInput(false);
                    setTargetPrice(Math.round(currentPrice * 0.9));
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PriceDropAlert;
