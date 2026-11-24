import express from 'express';
import compression from 'compression';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'node:path';
import { existsSync } from 'node:fs';
import Contact from './models/contact.js';
import Project from './models/project.js';
import Qualification from './models/qualification.js';
import resourceRoutes from './routes/resourceRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

export function createApp({ rateLimits = true } = {}) {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) throw new Error('Set JWT_SECRET to at least 32 characters in .env.');
  const app = express();
  if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1);
  app.use(compression());
  app.use('/api', (_req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
  app.use(helmet({ contentSecurityPolicy: { directives: { imgSrc: ["'self'", 'data:', 'https:'], fontSrc: ["'self'", 'https:', 'data:'], styleSrc: ["'self'", 'https:', "'unsafe-inline'"] } } }));
  app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true }));
  app.use(express.json({ limit: '20kb' }));
  app.use(cookieParser());
  if (rateLimits) {
    app.use('/api/auth/signin', rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: 'draft-8', legacyHeaders: false }));
    app.use('/api/auth/signup', rateLimit({ windowMs: 15 * 60 * 1000, limit: 20 }));
    app.use('/api/contacts', (req, res, next) => req.method === 'POST' ? contactLimit(req, res, next) : next());
  }
  app.get('/api/health', (_req, res) => {
    const connected = mongoose.connection.readyState === 1;
    res.status(connected ? 200 : 503).json({ status: connected ? 'ok' : 'unavailable', database: connected ? 'connected' : 'disconnected', revision: process.env.RENDER_GIT_COMMIT || 'local' });
  });
  app.use('/api/contacts', resourceRoutes(Contact, { contact: true }));
  app.use('/api/projects', resourceRoutes(Project));
  app.use('/api/qualifications', resourceRoutes(Qualification));
  app.use('/api/users', userRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api', (_req, res) => res.status(404).json({ message: 'Route not found.' }));
  const dist = path.resolve('dist');
  if (existsSync(dist)) {
    app.use(express.static(dist, { maxAge: '1h', setHeaders(res, file) {
      if (/\.html$/.test(file)) res.set('Cache-Control', 'no-cache');
      else if (/-[a-zA-Z0-9_-]{8,}\.(js|css)$/.test(file)) res.set('Cache-Control', 'public, max-age=31536000, immutable');
    } }));
    app.get('*', (_req, res) => { res.set('Cache-Control', 'no-cache'); return res.sendFile(path.join(dist, 'index.html')); });
  }
  app.use((_req, res) => res.status(404).json({ message: 'Route not found.' }));
  app.use((err, _req, res, _next) => {
    if (err.name === 'ValidationError') return res.status(400).json({ message: Object.values(err.errors).map(e => e.message).join(' ') });
    if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid record id or field value.' });
    if (err.code === 11000) return res.status(409).json({ message: 'An account with this email already exists.' });
    if (err.type === 'entity.parse.failed') return res.status(400).json({ message: 'Invalid JSON body.' });
    if (err.status === 413) return res.status(413).json({ message: 'Request is too large.' });
    console.error(err);
    res.status(500).json({ message: 'An unexpected server error occurred.' });
  });
  return app;
}
const contactLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30 });
