import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import asyncHandler from '../middleware/asyncHandler.js';

const publicUser = (user) => ({ _id: user._id, name: user.name, email: user.email, created: user.created, updated: user.updated });
const issueToken = (user, res) => {
  const token = jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
  res.cookie('token', token, {
    httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  });
  return token;
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Name, email, and password are required.' });
  const exists = await User.exists({ email: email.toLowerCase().trim() });
  if (exists) return res.status(409).json({ message: 'An account with this email already exists.' });
  const user = await User.create({ name, email, password });
  const token = issueToken(user, res);
  res.status(201).json({ user: publicUser(user), token });
});

export const signIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email?.toLowerCase().trim() }).select('+password');
  if (!user || !password || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Email or password is incorrect.' });
  }
  const token = issueToken(user, res);
  res.json({ user: publicUser(user), token });
});

export const signOut = (_req, res) => {
  res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
  res.json({ message: 'Signed out successfully.' });
};

export const me = (req, res) => res.json({ user: publicUser(req.user) });
export const listUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().sort({ created: -1 });
  res.json(users.map(publicUser));
});
export const getUser = asyncHandler(async (req, res) => {
  if (req.params.id !== req.user.id) return res.status(403).json({ message: 'You can only view your own account.' });
  res.json(publicUser(req.user));
});
export const updateUser = asyncHandler(async (req, res) => {
  if (req.params.id !== req.user.id) return res.status(403).json({ message: 'You can only update your own account.' });
  const { name, email, password } = req.body;
  if (email && await User.exists({ email: email.toLowerCase().trim(), _id: { $ne: req.user._id } })) {
    return res.status(409).json({ message: 'An account with this email already exists.' });
  }
  if (name !== undefined) req.user.name = name;
  if (email !== undefined) req.user.email = email;
  if (password) req.user.password = password;
  await req.user.save();
  res.json(publicUser(req.user));
});
export const deleteUser = asyncHandler(async (req, res) => {
  if (req.params.id !== req.user.id) return res.status(403).json({ message: 'You can only delete your own account.' });
  await req.user.deleteOne();
  signOut(req, res);
});
export const deleteAllUsers = (_req, res) => res.status(403).json({ message: 'Bulk user deletion is disabled for security.' });
