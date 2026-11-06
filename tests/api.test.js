import { randomBytes } from 'node:crypto';
import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { createApp } from '../server/app.js';
import { seed, adminIdentity } from '../scripts/seed.js';
import User from '../server/models/user.js';
const adminCredentials = { ...adminIdentity, password: randomBytes(24).toString('base64url') };
let mongo, app, admin, user, token;
const owner = { firstname: 'Yuri', lastname: 'Koller', email: 'yuri@example.com' };
before(async () => {
  process.env.JWT_SECRET = randomBytes(32).toString('hex');
  mongo = await MongoMemoryServer.create({ binary: { version: '7.0.14' }, instance: { args: ['--nounixsocket', '--setParameter', 'diagnosticDataCollectionEnabled=false'] } });
  await mongoose.connect(mongo.getUri());
  await seed({ adminPassword: adminCredentials.password });
  app = createApp({ rateLimits: false });
  admin = request.agent(app); user = request.agent(app);
});
after(async () => { await mongoose.disconnect(); if (mongo) await mongo.stop(); });
test('health and seeded database-backed public reads', async () => {
  assert.equal((await request(app).get('/api/health')).body.database, 'connected');
  assert.equal((await request(app).get('/api/projects')).body.length, 6);
  assert.equal((await request(app).get('/api/qualifications')).body.length, 4);
});
test('signup hashes password and ignores requested admin role', async () => {
  const result = await user.post('/api/auth/signup').send({ name: 'Portfolio Reader', email: 'reader@example.com', password: 'ReaderPass!229', role: 'admin' }).expect(201);
  assert.equal(result.body.user.role, 'user'); assert.equal(result.body.user.password, undefined);
  const saved = await User.findOne({ email: 'reader@example.com' }).select('+password');
  assert.notEqual(saved.password, 'ReaderPass!229'); assert.ok(await saved.comparePassword('ReaderPass!229'));
  await user.get('/api/auth/me').expect(200);
});
test('invalid inputs and duplicate email are rejected', async () => {
  await request(app).post('/api/auth/signup').send({ name: 'X', email: 'bad', password: '12345678' }).expect(400);
  await request(app).post('/api/auth/signup').send({ name: 'X', email: 'short@example.com', password: '123' }).expect(400);
  await request(app).post('/api/auth/signup').send({ name: 'X', email: 'READER@example.com', password: '12345678' }).expect(409);
  await request(app).post('/api/auth/signin').send({ email: { $ne: null }, password: '123' }).expect(400);
  await request(app).post('/api/auth/signin').send({ email: adminCredentials.email, password: 'wrong' }).expect(401);
});
test('admin signs in with JWT and HttpOnly cookie', async () => {
  const result = await admin.post('/api/auth/signin').send(adminCredentials).expect(200);
  assert.equal(result.body.user.role, 'admin'); token = result.body.token;
  assert.ok(result.headers['set-cookie'][0].includes('HttpOnly'));
  await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`).expect(200);
});
test('guests cannot mutate records or read contacts', async () => {
  for (const resource of ['projects', 'qualifications', 'contacts']) {
    await request(app).put(`/api/${resource}/507f1f77bcf86cd799439011`).send({}).expect(401);
    await request(app).delete(`/api/${resource}`).expect(401);
    if (resource !== 'contacts') await request(app).post(`/api/${resource}`).send({}).expect(401);
  }
  await request(app).get('/api/contacts').expect(401);
});
test('users read all resource types but cannot write or promote themselves', async () => {
  for (const resource of ['projects', 'qualifications', 'contacts']) {
    await user.get(`/api/${resource}`).expect(200);
    await user.put(`/api/${resource}/507f1f77bcf86cd799439011`).send({}).expect(403);
    await user.delete(`/api/${resource}/507f1f77bcf86cd799439011`).expect(403);
    await user.delete(`/api/${resource}`).expect(403);
    if (resource !== 'contacts') await user.post(`/api/${resource}`).send({}).expect(403);
  }
  const me = (await user.get('/api/auth/me')).body.user;
  const changed = await user.put(`/api/users/${me._id}`).send({ role: 'admin' }).expect(200);
  assert.equal(changed.body.role, 'user');
  await user.get('/api/users').expect(403);
});
for (const resource of ['projects', 'qualifications', 'contacts']) {
  test(`admin creates, reads, updates and deletes ${resource}`, async () => {
    const body = resource === 'contacts' ? { ...owner, message: 'Integration test message' } : { ...owner, title: 'Integration test record', completion: '2026-10-31', description: 'Database persistence test' };
    const created = await admin.post(`/api/${resource}`).send(body).expect(201);
    const id = created.body._id;
    assert.ok(await mongoose.connection.collection(resource).findOne({ _id: new mongoose.Types.ObjectId(id) }));
    await admin.get(`/api/${resource}/${id}`).expect(200);
    const change = resource === 'contacts' ? { message: 'Updated message' } : { title: 'Updated title' };
    const updated = await admin.put(`/api/${resource}/${id}`).send(change).expect(200);
    for (const [key, value] of Object.entries(change)) assert.equal(updated.body[key], value);
    await admin.delete(`/api/${resource}/${id}`).expect(200);
    await admin.get(`/api/${resource}/${id}`).expect(404);
  });
}
test('public contact form creates a database record; validation and bad IDs return 400', async () => {
  await request(app).post('/api/contacts').send({ ...owner, message: 'Hello from the contact form.' }).expect(201);
  await request(app).post('/api/contacts').send({ ...owner, email: 'bad', message: 'Hello' }).expect(400);
  await request(app).post('/api/contacts').send(owner).expect(400);
  await request(app).get('/api/projects/invalid').expect(400);
  await admin.put('/api/projects/507f1f77bcf86cd799439011').send({ title: 'Missing record' }).expect(404);
  await request(app).post('/api/auth/signin').set('Content-Type', 'application/json').send('{bad').expect(400);
});
test('both signout methods clear cookies and invalidate bearer JWTs', async () => {
  await admin.get('/api/auth/signout').expect(200);
  await admin.get('/api/auth/me').expect(401);
  await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`).expect(401);
  await user.post('/api/auth/signout').expect(200);
  await user.get('/api/auth/me').expect(401);
});
