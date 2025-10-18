import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store/store';
import { addAddress, updateAddress, deleteAddress } from '../store/slices/authSlice';
import { toast } from 'react-hot-toast';

const AddressesPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);
  const [newAddress, setNewAddress] = useState({
    type: 'home' as 'home' | 'work' | 'other',
    address: '',
    city: '',
    pincode: ''
  });

  // Check if user is authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Please Sign In</h1>
            <p className="text-gray-600 mb-8">You need to be logged in to manage addresses</p>
            <button
              onClick={() => navigate('/')}
              className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const userAddresses = user.addresses || [];

  const handleAddAddress = () => {
    if (!newAddress.address || !newAddress.city || !newAddress.pincode) {
      toast.error('Please fill in all required fields');
      return;
    }

    const addressToAdd = {
      id: `addr_${Date.now()}`,
      type: newAddress.type,
      address: newAddress.address,
      city: newAddress.city,
      pincode: newAddress.pincode,
      coordinates: { lat: 0, lng: 0 }, // Would be set by geocoding in real app
      isDefault: userAddresses.length === 0, // First address is default
    };

    dispatch(addAddress(addressToAdd));
    setNewAddress({
      type: 'home',
      address: '',
      city: '',
      pincode: ''
    });
    setShowAddForm(false);
    toast.success('Address added successfully!');
  };

  const handleEditAddress = (addressId: string) => {
    const address = userAddresses.find(addr => addr.id === addressId);
    if (address) {
      setNewAddress({
        type: address.type,
        address: address.address,
        city: address.city,
        pincode: address.pincode
      });
      setEditingAddress(addressId);
      setShowAddForm(true);
    }
  };

  const handleUpdateAddress = () => {
    if (!newAddress.address || !newAddress.city || !newAddress.pincode || !editingAddress) {
      toast.error('Please fill in all required fields');
      return;
    }

    const updates = {
      type: newAddress.type,
      address: newAddress.address,
      city: newAddress.city,
      pincode: newAddress.pincode,
    };

    dispatch(updateAddress({ id: editingAddress, updates }));
    setNewAddress({
      type: 'home',
      address: '',
      city: '',
      pincode: ''
    });
    setShowAddForm(false);
    setEditingAddress(null);
    toast.success('Address updated successfully!');
  };

  const handleDeleteAddress = (addressId: string) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      dispatch(deleteAddress(addressId));
      toast.success('Address deleted successfully!');
    }
  };

  const handleSetDefault = (addressId: string) => {
    // First, update all addresses to not be default
    userAddresses.forEach(address => {
      if (address.isDefault && address.id !== addressId) {
        dispatch(updateAddress({ id: address.id, updates: { isDefault: false } }));
      }
    });
    
    // Then set the selected address as default
    const address = userAddresses.find(addr => addr.id === addressId);
    if (address) {
      dispatch(updateAddress({ id: address.id, updates: { isDefault: true } }));
      toast.success('Default address updated!');
    }
  };

  const handleCancelForm = () => {
    setNewAddress({
      type: 'home',
      address: '',
      city: '',
      pincode: ''
    });
    setShowAddForm(false);
    setEditingAddress(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Addresses</h1>
          <p className="text-gray-600">Manage your delivery addresses</p>
        </div>

        {/* Add Address Button */}
        {!showAddForm && (
          <div className="mb-6">
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              + Add New Address
            </button>
          </div>
        )}

        {/* Add/Edit Address Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Address Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Type
                </label>
                <select
                  value={newAddress.type}
                  onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value as any })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Pincode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pincode *
                </label>
                <input
                  type="text"
                  value={newAddress.pincode}
                  onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                  placeholder="Enter pincode"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Complete Address *
                </label>
                <textarea
                  value={newAddress.address}
                  onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                  placeholder="House/Flat/Floor No., Building Name/Street name, Area"
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  placeholder="Enter city"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={editingAddress ? handleUpdateAddress : handleAddAddress}
                className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors"
              >
                {editingAddress ? 'Update Address' : 'Save Address'}
              </button>
              <button
                onClick={handleCancelForm}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Addresses List */}
        <div className="space-y-4">
          {userAddresses.length > 0 ? (
            userAddresses.map((address) => (
              <div key={address.id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-gray-900">{user.name}</span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {address.type}
                      </span>
                      {address.isDefault && (
                        <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded font-medium">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-1">{address.address}</p>
                    <p className="text-gray-600 mb-2">{address.city} - {address.pincode}</p>
                    <p className="text-gray-600 text-sm">Phone: {user.phone}</p>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => handleEditAddress(address.id)}
                      className="text-green-600 hover:text-green-800 text-sm font-medium"
                    >
                      Edit
                    </button>
                    {!address.isDefault && (
                      <>
                        <button
                          onClick={() => handleSetDefault(address.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Set Default
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(address.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📍</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No addresses saved</h3>
              <p className="text-gray-600 mb-4">Add your first delivery address to get started</p>
              {!showAddForm && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                >
                  Add Address
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressesPage; 