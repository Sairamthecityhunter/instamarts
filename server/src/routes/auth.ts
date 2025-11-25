import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticateToken } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-development-jwt-secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || JWT_SECRET;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || '15m';
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d';

// Generate access token (short-lived)
const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY as any });
};

// Generate refresh token (long-lived, stored in DB)
const generateRefreshToken = () => {
  return crypto.randomBytes(40).toString('hex');
};

// Set refresh token as httpOnly cookie
const setRefreshTokenCookie = (res: Response, token: string) => {
  const expiresIn = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: expiresIn,
    path: '/api/auth',
  });
};

// Clear refresh token cookie
const clearRefreshTokenCookie = (res: Response) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/auth',
  });
};

// Register new user
router.post('/register', asyncHandler(async (req: Request, res: Response) => {
  const { name, email, phone, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  // Check if user already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        ...(phone ? [{ phone }] : []),
      ],
    },
  });

  if (existingUser) {
    return res.status(400).json({ error: 'User already exists with this email or phone' });
  }

  // Hash password
  const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create new user
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      phone: phone || null,
      password: hashedPassword,
      isInstamartPlus: false,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      isInstamartPlus: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  // Generate tokens
  const accessToken = generateAccessToken(newUser.id);
  const refreshToken = generateRefreshToken();

  // Store refresh token in database
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

  await prisma.refreshToken.create({
    data: {
      userId: newUser.id,
      token: refreshToken,
      expiresAt,
    },
  });

  // Set refresh token as httpOnly cookie
  setRefreshTokenCookie(res, refreshToken);

  res.status(201).json({
    message: 'User registered successfully',
    user: newUser,
    accessToken,
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
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate tokens
  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken();

  // Store refresh token in database
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt,
    },
  });

  // Set refresh token as httpOnly cookie
  setRefreshTokenCookie(res, refreshToken);

  // Return user data (without password)
  const { password: _, ...userWithoutPassword } = user;

  res.json({
    message: 'Login successful',
    user: userWithoutPassword,
    accessToken,
  });
}));

// Refresh access token using refresh token from cookie
router.post('/refresh', asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token required' });
  }

  // Find refresh token in database
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  });

  if (!storedToken) {
    clearRefreshTokenCookie(res);
    return res.status(401).json({ error: 'Invalid refresh token' });
  }

  // Check if token is expired
  if (storedToken.expiresAt < new Date()) {
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });
    clearRefreshTokenCookie(res);
    return res.status(401).json({ error: 'Refresh token expired' });
  }

  // Generate new access token
  const accessToken = generateAccessToken(storedToken.userId);

  res.json({
    accessToken,
  });
}));

// Get current user profile
router.get('/me', authenticateToken, asyncHandler(async (req: any, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      isInstamartPlus: true,
      addresses: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({ user });
}));

// Update user profile
router.put('/me', authenticateToken, asyncHandler(async (req: any, res: Response) => {
  const { name, phone, avatar } = req.body;

  const updatedUser = await prisma.user.update({
    where: { id: req.userId },
    data: {
      ...(name && { name }),
      ...(phone && { phone }),
      ...(avatar !== undefined && { avatar }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      isInstamartPlus: true,
      addresses: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.json({
    message: 'Profile updated successfully',
    user: updatedUser,
  });
}));

// Logout - invalidate refresh token
router.post('/logout', authenticateToken, asyncHandler(async (req: any, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;

  if (refreshToken) {
    await prisma.refreshToken.deleteMany({
      where: {
        userId: req.userId,
        token: refreshToken,
      },
    });
  }

  clearRefreshTokenCookie(res);

  res.json({ message: 'Logged out successfully' });
}));

// Logout from all devices
router.post('/logout-all', authenticateToken, asyncHandler(async (req: any, res: Response) => {
  await prisma.refreshToken.deleteMany({
    where: { userId: req.userId },
  });

  clearRefreshTokenCookie(res);

  res.json({ message: 'Logged out from all devices successfully' });
}));

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
    ...(process.env.NODE_ENV === 'development' && { otp }),
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
