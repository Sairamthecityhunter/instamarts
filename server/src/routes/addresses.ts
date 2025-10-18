import express from 'express';
import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// In-memory address storage for demo
const addresses: { [userId: string]: any[] } = {
  '1': [
    {
      id: '1',
      type: 'home',
      address: '123 MG Road, Bangalore',
      city: 'Bangalore',
      pincode: '560001',
      coordinates: { lat: 12.9716, lng: 77.5946 },
      isDefault: true
    }
  ]
};

// Get user addresses
router.get('/', asyncHandler(async (req: any, res: Response) => {
  const userId = req.userId;
  const userAddresses = addresses[userId] || [];
  
  res.json({ addresses: userAddresses });
}));

// Add new address
router.post('/', asyncHandler(async (req: any, res: Response) => {
  const userId = req.userId;
  const { type, address, city, pincode, coordinates, isDefault } = req.body;

  if (!address || !city || !pincode) {
    return res.status(400).json({ error: 'Address, city, and pincode are required' });
  }

  // Initialize user addresses if doesn't exist
  if (!addresses[userId]) {
    addresses[userId] = [];
  }

  const newAddress = {
    id: (addresses[userId].length + 1).toString(),
    type: type || 'other',
    address,
    city,
    pincode,
    coordinates: coordinates || { lat: 0, lng: 0 },
    isDefault: isDefault || false
  };

  // If this is default, make others non-default
  if (newAddress.isDefault) {
    addresses[userId].forEach(addr => addr.isDefault = false);
  }

  addresses[userId].push(newAddress);

  res.status(201).json({
    message: 'Address added successfully',
    address: newAddress
  });
}));

// Update address
router.put('/:addressId', asyncHandler(async (req: any, res: Response) => {
  const userId = req.userId;
  const { addressId } = req.params;
  const updates = req.body;

  if (!addresses[userId]) {
    return res.status(404).json({ error: 'No addresses found' });
  }

  const addressIndex = addresses[userId].findIndex(addr => addr.id === addressId);
  if (addressIndex === -1) {
    return res.status(404).json({ error: 'Address not found' });
  }

  // If setting as default, make others non-default
  if (updates.isDefault) {
    addresses[userId].forEach(addr => addr.isDefault = false);
  }

  // Update address
  addresses[userId][addressIndex] = {
    ...addresses[userId][addressIndex],
    ...updates
  };

  res.json({
    message: 'Address updated successfully',
    address: addresses[userId][addressIndex]
  });
}));

// Delete address
router.delete('/:addressId', asyncHandler(async (req: any, res: Response) => {
  const userId = req.userId;
  const { addressId } = req.params;

  if (!addresses[userId]) {
    return res.status(404).json({ error: 'No addresses found' });
  }

  const addressIndex = addresses[userId].findIndex(addr => addr.id === addressId);
  if (addressIndex === -1) {
    return res.status(404).json({ error: 'Address not found' });
  }

  addresses[userId].splice(addressIndex, 1);

  res.json({ message: 'Address deleted successfully' });
}));

export default router; 