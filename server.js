import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import Contact from './server/models/contact.js';
import Project from './server/models/project.js';
import Qualification from './server/models/qualification.js';
import { protect } from './server/middleware/auth.js';
import resourceRoutes from './server/routes/resourceRoutes.js';
import authRoutes from './server/routes/authRoutes.js';
import userRoutes from './server/routes/userRoutes.js';

const app = express();
const port = Number(process.env.PORT) || 5000;

if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET must be set in the root .env file.');
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '20kb' }));
app.use(cookieParser());
app.use('/api/auth/signin', rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-8', legacyHeaders: false }));

app.get('/', (_req, res) => res.send('Welcome to my portfolio application!'));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' }));
app.use('/api/contacts', resourceRoutes(Contact, { publicCreate: true }));
app.use('/api/projects', resourceRoutes(Project));
app.use('/api/qualifications', resourceRoutes(Qualification));
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use((_req, res) => res.status(404).json({ message: 'Route not found.' }));
app.use((err, _req, res, _next) => {
  if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid record id.' });
  if (err.code === 11000) return res.status(409).json({ message: 'A record with that unique value already exists.' });
  console.error(err);
  res.status(500).json({ message: 'An unexpected server error occurred.' });
});

try {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log(`MongoDB connected: ${mongoose.connection.name}`);
  app.listen(port, () => console.log(`Portfolio API is running at http://localhost:${port}`));
} catch (error) {
  console.error(`Could not connect to MongoDB: ${error.message}`);
  process.exit(1);
}
