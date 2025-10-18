import express from 'express';
import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// Get user preferences
router.get('/preferences', asyncHandler(async (req: any, res: Response) => {
  // Mock user preferences
  const preferences = {
    notifications: {
      orderUpdates: true,
      offers: true,
      newsletter: false
    },
    delivery: {
      defaultAddress: null,
      preferredSlots: ['morning', 'evening']
    },
    dietary: {
      vegetarian: false,
      vegan: false,
      glutenFree: false
    }
  };

  res.json({ preferences });
}));

// Update user preferences
router.put('/preferences', asyncHandler(async (req: any, res: Response) => {
  const { preferences } = req.body;
  
  // In production, save to database
  console.log('Updated preferences:', preferences);
  
  res.json({ 
    message: 'Preferences updated successfully',
    preferences 
  });
}));

export default router; 