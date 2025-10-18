import express from 'express';
import nodemailer from 'nodemailer';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Email transporter configuration (using SendGrid)
const createTransporter = () => {
  if (process.env.SENDGRID_API_KEY) {
    return nodemailer.createTransporter({
      service: 'SendGrid',
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
      }
    });
  } else {
    // Fallback to Gmail SMTP (for development)
    return nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }
};

// Send email notification
router.post('/email', authenticateToken, async (req, res) => {
  try {
    const { type, to, subject, data } = req.body;

    if (!to || !subject) {
      return res.status(400).json({
        success: false,
        error: 'Email address and subject are required'
      });
    }

    const transporter = createTransporter();
    let htmlContent = '';

    // Generate email content based on type
    switch (type) {
      case 'order_confirmation':
        htmlContent = generateOrderConfirmationEmail(data);
        break;
      case 'shipping_update':
        htmlContent = generateShippingUpdateEmail(data);
        break;
      case 'payment_success':
        htmlContent = generatePaymentSuccessEmail(data);
        break;
      case 'delivery_notification':
        htmlContent = generateDeliveryNotificationEmail(data);
        break;
      case 'return_processed':
        htmlContent = generateReturnProcessedEmail(data);
        break;
      default:
        htmlContent = `<p>Thank you for using Instamart!</p>`;
    }

    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@instamart.com',
      to: to,
      subject: subject,
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: 'Email sent successfully'
    });

  } catch (error: any) {
    console.error('Email sending failed:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send email'
    });
  }
});

// Send SMS notification (using Twilio or similar service)
router.post('/sms', authenticateToken, async (req, res) => {
  try {
    const { phone, message } = req.body;

    if (!phone || !message) {
      return res.status(400).json({
        success: false,
        error: 'Phone number and message are required'
      });
    }

    // SMS implementation would go here
    // const client = twilio(accountSid, authToken);
    // await client.messages.create({
    //   body: message,
    //   from: '+1234567890',
    //   to: phone
    // });

    res.json({
      success: true,
      message: 'SMS sent successfully (simulated)'
    });

  } catch (error: any) {
    console.error('SMS sending failed:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send SMS'
    });
  }
});

// Email template generators
function generateOrderConfirmationEmail(data: any): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Order Confirmation</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
    .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 20px; }
    .order-details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #2563eb; }
    .item { border-bottom: 1px solid #e5e7eb; padding: 10px 0; }
    .total { font-weight: bold; font-size: 18px; color: #059669; }
    .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
    .button { background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🛒 Order Confirmed!</h1>
    <p>Thank you for choosing Instamart</p>
  </div>
  
  <div class="content">
    <h2>Hi ${data.customerName || 'Valued Customer'},</h2>
    <p>Great news! Your order has been confirmed and we're preparing your authentic Indian products for shipment from India to USA.</p>
    
    <div class="order-details">
      <h3>📦 Order Details</h3>
      <p><strong>Order Number:</strong> ${data.orderNumber}</p>
      <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
      
      <h4>Items Ordered:</h4>
      ${data.items ? data.items.map((item: any) => `
        <div class="item">
          <strong>${item.name}</strong><br>
          Quantity: ${item.quantity} | Price: $${item.price?.toFixed(2) || '0.00'}
        </div>
      `).join('') : '<p>Order items will be processed shortly.</p>'}
      
      <div class="total">
        <p>💰 Total Amount: $${data.total?.toFixed(2) || '0.00'} USD</p>
        <p style="font-size: 14px; color: #6b7280;">*All taxes, duties, and customs fees included</p>
      </div>
    </div>
    
    <div class="order-details">
      <h3>🚚 Shipping Information</h3>
      <p><strong>Delivery Address:</strong><br>${data.shippingAddress || 'Address on file'}</p>
      <p><strong>Estimated Delivery:</strong> ${data.estimatedDelivery || '7-15 business days'}</p>
      <p><strong>Shipping Method:</strong> International Express (India to USA)</p>
    </div>
    
    <div class="order-details">
      <h3>📋 What Happens Next?</h3>
      <p>📦 <strong>Processing:</strong> 2-3 business days</p>
      <p>✈️ <strong>International Shipping:</strong> 7-15 business days</p>
      <p>📱 <strong>Tracking:</strong> You'll receive tracking information once shipped</p>
      <p>🏠 <strong>Delivery:</strong> Direct to your doorstep</p>
    </div>
    
    <div style="text-align: center; margin: 20px 0;">
      <a href="https://instamart.com/track/${data.orderNumber}" class="button">
        Track Your Order
      </a>
    </div>
    
    <p>Need help? Contact our support team at <strong>support@instamart.com</strong> or use our live chat feature.</p>
  </div>
  
  <div class="footer">
    <p>🇮🇳➡️🇺🇸 Authentic Indian products delivered to USA</p>
    <p>© 2024 Instamart. All rights reserved.</p>
  </div>
</body>
</html>
  `;
}

function generateShippingUpdateEmail(data: any): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Shipping Update</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
    .header { background: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 20px; }
    .tracking-info { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #059669; }
    .status { font-size: 18px; font-weight: bold; color: #059669; }
    .button { background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0; }
    .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>📦 Shipping Update</h1>
    <p>Your order is on its way!</p>
  </div>
  
  <div class="content">
    <h2>Hi ${data.customerName || 'Valued Customer'},</h2>
    <p>We have an update on your order shipment from India to USA.</p>
    
    <div class="tracking-info">
      <h3>🚚 Tracking Information</h3>
      <p><strong>Order Number:</strong> ${data.orderNumber}</p>
      <p><strong>Tracking Number:</strong> ${data.trackingNumber || 'Will be provided soon'}</p>
      <p class="status">📍 Status: ${data.status || 'In Transit'}</p>
      <p><strong>Current Location:</strong> ${data.location || 'International Hub'}</p>
      <p><strong>Estimated Delivery:</strong> ${data.estimatedDelivery || '7-15 business days'}</p>
    </div>
    
    <p>You can track your package in real-time using the tracking number above on our website or the carrier's website.</p>
    
    <div style="text-align: center; margin: 20px 0;">
      <a href="https://instamart.com/track/${data.orderNumber}" class="button">
        Track Your Order
      </a>
    </div>
  </div>
  
  <div class="footer">
    <p>Questions? Contact us at support@instamart.com</p>
    <p>© 2024 Instamart. All rights reserved.</p>
  </div>
</body>
</html>
  `;
}

function generatePaymentSuccessEmail(data: any): string {
  return `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #059669; color: white; padding: 20px; text-align: center;">
    <h1>💳 Payment Successful!</h1>
  </div>
  <div style="padding: 20px;">
    <h2>Hi ${data.customerName || 'Valued Customer'},</h2>
    <p>Your payment of <strong>$${data.amount?.toFixed(2) || '0.00'} USD</strong> has been successfully processed.</p>
    <p>Order Number: <strong>${data.orderNumber}</strong></p>
    <p>Your order is now being prepared for shipment from India to USA.</p>
  </div>
</body>
</html>
  `;
}

function generateDeliveryNotificationEmail(data: any): string {
  return `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #2563eb; color: white; padding: 20px; text-align: center;">
    <h1>🏠 Package Delivered!</h1>
  </div>
  <div style="padding: 20px;">
    <h2>Hi ${data.customerName || 'Valued Customer'},</h2>
    <p>Great news! Your order <strong>${data.orderNumber}</strong> has been successfully delivered.</p>
    <p>We hope you enjoy your authentic Indian products!</p>
    <p>Please consider leaving a review to help other customers.</p>
  </div>
</body>
</html>
  `;
}

function generateReturnProcessedEmail(data: any): string {
  return `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #059669; color: white; padding: 20px; text-align: center;">
    <h1>↩️ Return Processed</h1>
  </div>
  <div style="padding: 20px;">
    <h2>Hi ${data.customerName || 'Valued Customer'},</h2>
    <p>Your return for order <strong>${data.orderNumber}</strong> has been processed.</p>
    <p>Refund amount: <strong>$${data.refundAmount?.toFixed(2) || '0.00'} USD</strong></p>
    <p>The refund will appear in your account within 5-10 business days.</p>
  </div>
</body>
</html>
  `;
}

export default router;
