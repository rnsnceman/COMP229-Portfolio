import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import asyncHandler from './asyncHandler.js';

export const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token || req.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return res.status(401).json({ message: 'Sign in is required.' });
  let payload;
  try { payload = jwt.verify(token, process.env.JWT_SECRET); }
  catch { return res.status(401).json({ message: 'Your session is invalid or expired.' }); }
  const user = await User.findById(payload.sub);
  if (!user) return res.status(401).json({ message: 'Account not found.' });
  req.user = user;
  next();
});
