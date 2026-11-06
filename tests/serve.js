import { randomBytes } from 'node:crypto';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createApp } from '../server/app.js';
import { seed } from '../scripts/seed.js';
process.env.JWT_SECRET = randomBytes(32).toString('hex');
const mongo = await MongoMemoryServer.create({ binary: { version: '7.0.14' }, instance: { args: ['--nounixsocket', '--setParameter', 'diagnosticDataCollectionEnabled=false'] } });
await mongoose.connect(mongo.getUri());
await seed({ adminPassword: process.env.TEST_ADMIN_PASSWORD });
const server = createApp({ rateLimits: false }).listen(5000, '127.0.0.1', () => console.log('Browser test server ready on port 5000'));
async function close() { server.close(); await mongoose.disconnect(); await mongo.stop(); process.exit(); }
process.on('SIGTERM', close); process.on('SIGINT', close);
