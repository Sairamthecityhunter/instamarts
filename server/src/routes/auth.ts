import express from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// In-memory user storage for demo (use database in production)
const users: any[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91 9876543210',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LfHQH.vSU7XDNgUqG', // 'password123'
    isInstamartPlus: false,
    addresses: [
      {
        id: '1',
        type: 'home',
        address: '123 MG Road, Bangalore',
        city: 'Bangalore',
        pincode: '560001',
        coordinates: { lat: 12.9716, lng: 77.5946 },
        isDefault: true
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Generate JWT token
const generateToken = (userId: string) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-development-jwt-secret',
    { expiresIn: '7d' }
  );
};

// Register new user
router.post('/register', asyncHandler(async (req: Request, res: Response) => {
  const { name, email, phone, password } = req.body;

  // Validation
  if (!name || !email || !phone || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Check if user already exists
  const existingUser = users.find(user => user.email === email || user.phone === phone);
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists with this email or phone' });
  }

  // Hash password
  const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create new user
  const newUser = {
    id: (users.length + 1).toString(),
    name,
    email,
    phone,
    password: hashedPassword,
    isInstamartPlus: false,
    addresses: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  users.push(newUser);

  // Generate token
  const token = generateToken(newUser.id);

  // Return user data (without password)
  const { password: _, ...userWithoutPassword } = newUser;

  res.status(201).json({
    message: 'User registered successfully',
    user: userWithoutPassword,
    token
  });
}));

// Login user
router.post('/login', asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Find user
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate token
  const token = generateToken(user.id);

  // Return user data (without password)
  const { password: _, ...userWithoutPassword } = user;

  res.json({
    message: 'Login successful',
    user: userWithoutPassword,
    token
  });
}));

// Get current user profile
router.get('/me', authenticateToken, asyncHandler(async (req: any, res: Response) => {
  const user = users.find(u => u.id === req.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword });
}));

// Update user profile
router.put('/me', authenticateToken, asyncHandler(async (req: any, res: Response) => {
  const { name, phone } = req.body;

  const userIndex = users.findIndex(u => u.id === req.userId);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Update user
  if (name) users[userIndex].name = name;
  if (phone) users[userIndex].phone = phone;
  users[userIndex].updatedAt = new Date();

  const { password: _, ...userWithoutPassword } = users[userIndex];
  res.json({
    message: 'Profile updated successfully',
    user: userWithoutPassword
  });
}));

// Refresh token
router.post('/refresh', authenticateToken, asyncHandler(async (req: any, res: Response) => {
  const newToken = generateToken(req.userId);
  res.json({ token: newToken });
}));

// Logout (client-side token removal)
router.post('/logout', (req: Request, res: Response) => {
  res.json({ message: 'Logged out successfully' });
});

// Send OTP for phone verification (mock implementation)
router.post('/send-otp', asyncHandler(async (req: Request, res: Response) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  // Mock OTP generation
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // In production, send actual SMS via Twilio/AWS SNS
  console.log(`OTP for ${phone}: ${otp}`);

  res.json({
    message: 'OTP sent successfully',
    // In development, return OTP for testing
    ...(process.env.NODE_ENV === 'development' && { otp })
  });
}));

// Verify OTP
router.post('/verify-otp', asyncHandler(async (req: Request, res: Response) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ error: 'Phone and OTP are required' });
  }

  // Mock OTP verification (in production, verify against stored OTP)
  if (otp === '123456' || process.env.NODE_ENV === 'development') {
    res.json({ message: 'OTP verified successfully' });
  } else {
    res.status(400).json({ error: 'Invalid OTP' });
  }
}));

export default router; 