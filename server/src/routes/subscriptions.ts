import express from 'express';
import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// In-memory subscription storage for demo
const subscriptions: { [userId: string]: any } = {};

// Get subscription plans
router.get('/plans', asyncHandler(async (req: Request, res: Response) => {
  const plans = [
    {
      id: 'monthly',
      name: 'Instamart+ Monthly',
      price: 99,
      duration: 30,
      benefits: [
        'Free delivery on all orders',
        'Exclusive member-only deals',
        'Priority delivery slots',
        'Extended return policy',
        '24/7 priority support'
      ],
      popular: true
    },
    {
      id: 'quarterly',
      name: 'Instamart+ Quarterly',
      price: 249,
      duration: 90,
      originalPrice: 297,
      savings: 48,
      benefits: [
        'Free delivery on all orders',
        'Exclusive member-only deals',
        'Priority delivery slots',
        'Extended return policy',
        '24/7 priority support',
        'Early access to sales'
      ],
      popular: false
    },
    {
      id: 'yearly',
      name: 'Instamart+ Yearly',
      price: 899,
      duration: 365,
      originalPrice: 1188,
      savings: 289,
      benefits: [
        'Free delivery on all orders',
        'Exclusive member-only deals',
        'Priority delivery slots',
        'Extended return policy',
        '24/7 priority support',
        'Early access to sales',
        'Special birthday offers',
        'Personalized recommendations'
      ],
      popular: false
    }
  ];

  res.json({ plans });
}));

// Get user's current subscription
router.get('/current', asyncHandler(async (req: any, res: Response) => {
  const userId = req.userId;
  const subscription = subscriptions[userId];

  if (!subscription) {
    return res.json({ subscription: null });
  }

  res.json({ subscription });
}));

// Subscribe to a plan
router.post('/subscribe', asyncHandler(async (req: any, res: Response) => {
  const userId = req.userId;
  const { planId, paymentMethod } = req.body;

  if (!planId) {
    return res.status(400).json({ error: 'Plan ID is required' });
  }

  // Mock plan validation
  const plans = ['monthly', 'quarterly', 'yearly'];
  if (!plans.includes(planId)) {
    return res.status(400).json({ error: 'Invalid plan ID' });
  }

  // Check if user already has active subscription
  const existingSubscription = subscriptions[userId];
  if (existingSubscription && existingSubscription.status === 'active') {
    return res.status(400).json({ error: 'User already has an active subscription' });
  }

  // Create new subscription
  const planDetails = {
    monthly: { price: 99, duration: 30 },
    quarterly: { price: 249, duration: 90 },
    yearly: { price: 899, duration: 365 }
  };

  const plan = planDetails[planId as keyof typeof planDetails];
  const startDate = new Date();
  const endDate = new Date(startDate.getTime() + plan.duration * 24 * 60 * 60 * 1000);

  const subscription = {
    id: `SUB${Date.now()}`,
    userId,
    planId,
    planName: `Instamart+ ${planId.charAt(0).toUpperCase() + planId.slice(1)}`,
    price: plan.price,
    status: 'active',
    startDate,
    endDate,
    autoRenew: true,
    paymentMethod: paymentMethod || 'card',
    createdAt: new Date()
  };

  subscriptions[userId] = subscription;

  res.status(201).json({
    message: 'Subscription activated successfully',
    subscription
  });
}));

// Cancel subscription
router.post('/cancel', asyncHandler(async (req: any, res: Response) => {
  const userId = req.userId;
  const { reason } = req.body;

  const subscription = subscriptions[userId];
  if (!subscription) {
    return res.status(404).json({ error: 'No active subscription found' });
  }

  if (subscription.status !== 'active') {
    return res.status(400).json({ error: 'Subscription is not active' });
  }

  // Update subscription status
  subscription.status = 'cancelled';
  subscription.cancelledAt = new Date();
  subscription.cancellationReason = reason || 'User requested cancellation';
  subscription.autoRenew = false;

  res.json({
    message: 'Subscription cancelled successfully',
    subscription
  });
}));

// Reactivate subscription
router.post('/reactivate', asyncHandler(async (req: any, res: Response) => {
  const userId = req.userId;

  const subscription = subscriptions[userId];
  if (!subscription) {
    return res.status(404).json({ error: 'No subscription found' });
  }

  if (subscription.status === 'active') {
    return res.status(400).json({ error: 'Subscription is already active' });
  }

  // Check if subscription hasn't expired
  const now = new Date();
  if (now > subscription.endDate) {
    return res.status(400).json({ error: 'Subscription has expired. Please subscribe to a new plan.' });
  }

  // Reactivate subscription
  subscription.status = 'active';
  subscription.autoRenew = true;
  subscription.reactivatedAt = new Date();

  res.json({
    message: 'Subscription reactivated successfully',
    subscription
  });
}));

// Get subscription benefits
router.get('/benefits', asyncHandler(async (req: any, res: Response) => {
  const userId = req.userId;
  const subscription = subscriptions[userId];

  const benefits = {
    freeDelivery: subscription?.status === 'active',
    prioritySupport: subscription?.status === 'active',
    exclusiveDeals: subscription?.status === 'active',
    extendedReturns: subscription?.status === 'active',
    earlyAccess: subscription?.status === 'active' && ['quarterly', 'yearly'].includes(subscription.planId)
  };

  res.json({ benefits });
}));

// Get subscription usage stats
router.get('/stats', asyncHandler(async (req: any, res: Response) => {
  const userId = req.userId;
  const subscription = subscriptions[userId];

  if (!subscription) {
    return res.json({ stats: null });
  }

  // Mock usage statistics
  const stats = {
    totalSaved: 450, // Mock savings
    freeDeliveries: 23,
    exclusiveDealsUsed: 8,
    daysRemaining: Math.max(0, Math.ceil((subscription.endDate.getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000)))
  };

  res.json({ stats });
}));

export default router; 