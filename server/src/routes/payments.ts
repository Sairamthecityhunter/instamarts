import express from 'express';
import { Request, Response } from 'express';
import Stripe from 'stripe';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Create payment intent
router.post('/create-intent', authenticateToken, async (req: any, res: Response) => {
  try {
    const { amount, currency = 'usd', metadata = {} } = req.body;

    // Validate amount
    if (!amount || amount < 50) { // Minimum $0.50
      return res.status(400).json({
        success: false,
        error: 'Amount must be at least $0.50 USD'
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Amount in cents
      currency: currency.toLowerCase(),
      metadata: {
        userId: req.user.id,
        userEmail: req.user.email,
        ...metadata
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      success: true,
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id
    });

  } catch (error: any) {
    console.error('Stripe payment intent creation failed:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Payment processing failed'
    });
  }
});

// Confirm payment
router.post('/confirm/:paymentIntentId', authenticateToken, async (req, res) => {
  try {
    const { paymentIntentId } = req.params;

    // Retrieve payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Payment successful - you can now fulfill the order
      res.json({
        success: true,
        status: paymentIntent.status,
        amount_received: paymentIntent.amount_received,
        payment_method: paymentIntent.payment_method
      });
    } else {
      res.json({
        success: false,
        status: paymentIntent.status,
        error: 'Payment not completed'
      });
    }

  } catch (error: any) {
    console.error('Payment confirmation failed:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Payment confirmation failed'
    });
  }
});

// Webhook endpoint for Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('Stripe webhook secret not configured');
    return res.status(400).send('Webhook secret not configured');
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig as string, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('Payment succeeded:', paymentIntent.id);

      // Update order status, send confirmation email, etc.
      // You can add your order fulfillment logic here

      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object as Stripe.PaymentIntent;
      console.log('Payment failed:', failedPayment.id);

      // Handle failed payment - notify user, update order status

      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Get payment methods for customer
router.get('/payment-methods', authenticateToken, async (req, res) => {
  try {
    const { customer_id } = req.query;

    if (!customer_id) {
      return res.status(400).json({
        success: false,
        error: 'Customer ID required'
      });
    }

    const paymentMethods = await stripe.paymentMethods.list({
      customer: customer_id as string,
      type: 'card',
    });

    res.json({
      success: true,
      payment_methods: paymentMethods.data
    });

  } catch (error: any) {
    console.error('Failed to retrieve payment methods:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve payment methods'
    });
  }
});

// Create customer in Stripe
router.post('/create-customer', authenticateToken, async (req: any, res: Response) => {
  try {
    const { name, email, phone } = req.body;

    const customer = await stripe.customers.create({
      name: name || req.user.name,
      email: email || req.user.email,
      phone: phone,
      metadata: {
        userId: req.user.id
      }
    });

    res.json({
      success: true,
      customer_id: customer.id
    });

  } catch (error: any) {
    console.error('Failed to create Stripe customer:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create customer'
    });
  }
});

// Calculate taxes for order
router.post('/calculate-taxes', async (req, res) => {
  try {
    const { amount, state, productCategories = [] } = req.body;

    // Import tax calculation functions
    // const { calculateTotalTax } = require('../../../client/src/utils/taxCalculator');

    // Mock tax calculation for now as client code is not accessible
    const calculateTotalTax = (amount: number, state: string, categories: any[]) => {
      return { totalTax: 0, breakdown: {} };
    };

    const taxCalculation = calculateTotalTax(amount, state, productCategories);

    res.json({
      success: true,
      calculation: taxCalculation
    });

  } catch (error: any) {
    console.error('Tax calculation failed:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Tax calculation failed'
    });
  }
});

export default router;
