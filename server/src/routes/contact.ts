import express from 'express';
import nodemailer from 'nodemailer';
import { asyncHandler } from '../middleware/errorHandler';
import { Request, Response } from 'express';

const router = express.Router();

// Create email transporter
const createTransporter = () => {
  // Try Gmail SMTP first (for development)
  if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  
  // Fallback to SendGrid if configured
  if (process.env.SENDGRID_API_KEY) {
    return nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY,
      },
    });
  }
  
  // Development fallback - logs email instead of sending
  return {
    sendMail: async (options: any) => {
      console.log('📧 Email would be sent (development mode):');
      console.log('To:', options.to);
      console.log('Subject:', options.subject);
      console.log('Body:', options.html || options.text);
      return { messageId: 'dev-mode' };
    },
  };
};

// Contact form submission
router.post('/', asyncHandler(async (req: Request, res: Response) => {
  const { firstName, lastName, email, subject, message } = req.body;

  // Validation
  if (!firstName || !lastName || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      error: 'All fields are required',
    });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid email address',
    });
  }

  try {
    const transporter = createTransporter();
    const recipientEmail = 'mandavasairam64@gmail.com';

    // Create HTML email content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
          .field { margin: 15px 0; }
          .label { font-weight: bold; color: #059669; }
          .value { margin-top: 5px; padding: 10px; background: white; border-radius: 4px; border-left: 3px solid #059669; }
          .message-box { padding: 15px; background: white; border-radius: 4px; border-left: 3px solid #059669; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📧 New Contact Form Submission</h1>
            <p>From Instamart Website</p>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Name:</div>
              <div class="value">${firstName} ${lastName}</div>
            </div>
            <div class="field">
              <div class="label">Email:</div>
              <div class="value">${email}</div>
            </div>
            <div class="field">
              <div class="label">Subject:</div>
              <div class="value">${subject}</div>
            </div>
            <div class="field">
              <div class="label">Message:</div>
              <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
            </div>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
              <p>This message was sent from the Instamart contact form.</p>
              <p>Submitted on: ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.FROM_EMAIL || email,
      to: recipientEmail,
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: htmlContent,
      text: `
New Contact Form Submission

Name: ${firstName} ${lastName}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
Submitted on: ${new Date().toLocaleString()}
      `.trim(),
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: 'Your message has been sent successfully! We will get back to you soon.',
    });
  } catch (error: any) {
    console.error('Email sending failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send message. Please try again later.',
    });
  }
}));

export default router;

