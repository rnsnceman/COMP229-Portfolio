import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../server/models/user.js';
import Project from '../server/models/project.js';
import Qualification from '../server/models/qualification.js';
import { projects, qualifications } from '../server/portfolioData.js';

// The admin identity and role are fixed; its password is supplied locally, then hashed in MongoDB.
export const adminIdentity = { name: 'Yuri Koller', email: 'admin@portfolio.local', role: 'admin' };
export async function seed({ adminPassword = process.env.ADMIN_PASSWORD } = {}) {
  const existing = await User.findOne({ email: adminIdentity.email });
  if (!existing) {
    if (typeof adminPassword !== 'string' || adminPassword.length < 8) throw new Error('Set ADMIN_PASSWORD to at least 8 characters in .env before seeding.');
    await User.create({ ...adminIdentity, password: adminPassword });
  }
  const owner = { firstname: 'Yuri', lastname: 'Koller', email: 'yurikoller@gmail.com' };
  for (const project of projects) {
    if (!await Project.exists({ title: project.title })) await Project.create({ ...owner, ...project, completion: `${project.year.slice(-4)}-12-31` });
  }
  for (const qualification of qualifications) {
    if (!await Qualification.exists({ title: qualification.title })) await Qualification.create({ ...owner, ...qualification });
  }
}
if (process.argv[1]?.endsWith('/scripts/seed.js')) {
  try {
    if (!process.env.MONGODB_URI) throw new Error('Set MONGODB_URI in .env first.');
    await mongoose.connect(process.env.MONGODB_URI);
    await seed();
    console.log('Seed complete. Admin: admin@portfolio.local. Use the ADMIN_PASSWORD you set in .env.');
  } catch (error) { console.error(error.message); process.exitCode = 1; }
  finally { await mongoose.disconnect(); }
}
