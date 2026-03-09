import React from 'react';

// Email notification system for order updates
export interface EmailNotification {
  type: 'order_confirmation' | 'payment_success' | 'shipping_update' | 'delivery_notification' | 'return_processed';
  to: string;
  subject: string;
  data: any;
}

// Order confirmation email template
export const OrderConfirmationEmail = {
  subject: (orderNumber: string) => `Order Confirmed - ${orderNumber} | Instamart`,
  template: (data: {
    customerName: string;
    orderNumber: string;
    items: any[];
    total: number;
    shippingAddress: string;
    estimatedDelivery: string;
  }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Order Confirmation</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
    .content { background: #f9fafb; padding: 20px; }
    .order-details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
    .item { border-bottom: 1px solid #e5e7eb; padding: 10px 0; }
    .total { font-weight: bold; font-size: 18px; color: #059669; }
    .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🛒 Order Confirmed!</h1>
      <p>Thank you for choosing Instamart</p>
    </div>
    
    <div class="content">
      <h2>Hi ${data.customerName},</h2>
      <p>Great news! Your order has been confirmed and we're preparing your authentic Indian products for shipment from India to USA.</p>
      
      <div class="order-details">
        <h3>Order Details</h3>
        <p><strong>Order Number:</strong> ${data.orderNumber}</p>
        <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
        
        <h4>Items Ordered:</h4>
        ${data.items.map(item => `
          <div class="item">
            <strong>${item.name}</strong><br>
            Quantity: ${item.quantity} | Price: $${item.price.toFixed(2)}
          </div>
        `).join('')}
        
        <div class="total">
          <p>Total Amount: $${data.total.toFixed(2)} USD</p>
          <p style="font-size: 14px; color: #6b7280;">*All taxes, duties, and customs fees included</p>
        </div>
      </div>
      
      <div class="order-details">
        <h3>Shipping Information</h3>
        <p><strong>Delivery Address:</strong><br>${data.shippingAddress}</p>
        <p><strong>Estimated Delivery:</strong> ${data.estimatedDelivery}</p>
        <p><strong>Shipping Method:</strong> International Express (India to USA)</p>
      </div>
      
      <div class="order-details">
        <h3>What Happens Next?</h3>
        <p>📦 <strong>Processing:</strong> 2-3 business days</p>
        <p>✈️ <strong>International Shipping:</strong> 7-15 business days</p>
        <p>📱 <strong>Tracking:</strong> You'll receive tracking information once shipped</p>
        <p>🏠 <strong>Delivery:</strong> Direct to your doorstep</p>
      </div>
      
      <p>Need help? Contact our support team at <strong>support@instamart.com</strong> or use our live chat feature.</p>
    </div>
    
    <div class="footer">
      <p>🇮🇳➡️🇺🇸 Authentic Indian products delivered to USA</p>
      <p>© 2024 Instamart. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `
};

// Shipping update email template
export const ShippingUpdateEmail = {
  subject: (orderNumber: string, status: string) => `Shipping Update - ${status} | ${orderNumber}`,
  template: (data: {
    customerName: string;
    orderNumber: string;
    trackingNumber: string;
    status: string;
    location: string;
    estimatedDelivery: string;
  }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Shipping Update</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #059669; color: white; padding: 20px; text-align: center; }
    .content { background: #f9fafb; padding: 20px; }
    .tracking-info { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
    .status { font-size: 18px; font-weight: bold; color: #059669; }
    .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📦 Shipping Update</h1>
      <p>Your order is on its way!</p>
    </div>
    
    <div class="content">
      <h2>Hi ${data.customerName},</h2>
      <p>We have an update on your order shipment from India to USA.</p>
      
      <div class="tracking-info">
        <h3>Tracking Information</h3>
        <p><strong>Order Number:</strong> ${data.orderNumber}</p>
        <p><strong>Tracking Number:</strong> ${data.trackingNumber}</p>
        <p class="status">Status: ${data.status}</p>
        <p><strong>Current Location:</strong> ${data.location}</p>
        <p><strong>Estimated Delivery:</strong> ${data.estimatedDelivery}</p>
      </div>
      
      <p>You can track your package in real-time using the tracking number above on our website or the carrier's website.</p>
      
      <p style="text-align: center; margin: 20px 0;">
        <a href="https://instamart.com/track/${data.orderNumber}" 
           style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
          Track Your Order
        </a>
      </p>
    </div>
    
    <div class="footer">
      <p>Questions? Contact us at support@instamart.com</p>
      <p>© 2024 Instamart. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `
};

// Email sending function
export const sendEmail = async (notification: EmailNotification): Promise<boolean> => {
  try {
    const response = await fetch('/api/notifications/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(notification)
    });
    
    return response.ok;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
};

// Email notification hooks for different events
export const useEmailNotifications = () => {
  const sendOrderConfirmation = async (orderData: any) => {
    const notification: EmailNotification = {
      type: 'order_confirmation',
      to: orderData.customerEmail,
      subject: OrderConfirmationEmail.subject(orderData.orderNumber),
      data: orderData
    };
    
    return await sendEmail(notification);
  };

  const sendShippingUpdate = async (shippingData: any) => {
    const notification: EmailNotification = {
      type: 'shipping_update',
      to: shippingData.customerEmail,
      subject: ShippingUpdateEmail.subject(shippingData.orderNumber, shippingData.status),
      data: shippingData
    };
    
    return await sendEmail(notification);
  };

  return {
    sendOrderConfirmation,
    sendShippingUpdate
  };
};
