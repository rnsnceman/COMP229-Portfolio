import 'dotenv/config';
import mongoose from 'mongoose';
import { createApp } from './server/app.js';
try {
  const app = createApp();
  if (!process.env.MONGODB_URI) throw new Error('Set MONGODB_URI in .env.');
  await mongoose.connect(process.env.MONGODB_URI);
  const port = Number(process.env.PORT) || 5000;
  app.listen(port, () => console.log(`Portfolio running at http://localhost:${port}`));
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
