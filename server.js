import 'dotenv/config';
import mongoose from 'mongoose';
import { seed } from './scripts/seed.js';
import { createApp } from './server/app.js';
try {
  const app = createApp();
  if (!process.env.MONGODB_URI) throw new Error('Set MONGODB_URI in .env.');
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  if (process.env.SEED_ON_START === 'true') await seed();
  const port = Number(process.env.PORT) || 5001;
  const server = app.listen(port, '0.0.0.0', () => console.log(`Portfolio running on port ${port}`));
  server.on('error', error => { console.error(`Server could not start: ${error.message}`); process.exit(1); });
  const shutdown = () => server.close(async () => { await mongoose.disconnect(); process.exit(0); });
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
