import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store/store';
import { addToCart, removeFromCart, clearCart } from '../../store/slices/cartSlice';

const CartSidebar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalAmount = useSelector((state: RootState) => state.cart.totalAmount);

  const handleAddItem = (product: any) => {
    dispatch(addToCart({ product, quantity: 1 }));
  };

  const handleRemoveItem = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Cart</h3>
        <div className="text-center py-8">
          <div className="text-gray-400 text-6xl mb-4">🛒</div>
          <p className="text-gray-600">Your cart is empty</p>
          <p className="text-gray-500 text-sm">Add items to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Your Cart</h3>
        <button
          onClick={() => dispatch(clearCart())}
          className="text-red-500 text-sm hover:text-red-700"
        >
          Clear All
        </button>
      </div>

      {/* Cart Items */}
      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
        {cartItems.map((item) => (
          <div key={item.product.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
            <img
              src={item.product.image}
              alt={item.product.name}
              className="w-12 h-12 object-cover rounded"
            />
            <div className="flex-1">
              <h4 className="font-medium text-gray-800 text-sm">{item.product.name}</h4>
              <p className="text-gray-600 text-sm">₹{item.product.price}</p>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => handleRemoveItem(item.product.id)}
                  className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-orange-600"
                >
                  -
                </button>
                <span className="font-medium">{item.quantity}</span>
                <button
                  onClick={() => handleAddItem(item.product)}
                  className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-orange-600"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bill Details */}
      <div className="border-t pt-4 mb-6">
        <h4 className="font-semibold text-gray-800 mb-3">Bill Details</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Item Total</span>
            <span>₹{totalAmount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Delivery Fee</span>
            <span>₹40</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Platform Fee</span>
            <span>₹2</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-semibold">
            <span>To Pay</span>
            <span>₹{totalAmount + 42}</span>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default CartSidebar; 