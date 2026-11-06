import mongoose from 'mongoose';

const qualificationSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  firstname: { type: String, required: true, trim: true },
  lastname: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true, match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Enter a valid email address.'] },
  completion: { type: Date },
  description: { type: String, required: true, trim: true },
}, { timestamps: true });

export default mongoose.model('Qualification', qualificationSchema, 'qualifications');
