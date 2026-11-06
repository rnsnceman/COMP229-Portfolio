import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  url: { type: String, trim: true, validate: { validator: v => !v || /^https?:\/\//i.test(v), message: 'Project URL must start with http:// or https://.' } },
  image: { type: String, trim: true, validate: { validator: v => !v || /^\/assets\//.test(v) || /^https?:\/\//i.test(v), message: 'Use an asset path or HTTP image URL.' } },
  role: { type: String, trim: true },
  year: { type: String, trim: true },
  title: { type: String, required: true, trim: true },
  firstname: { type: String, required: true, trim: true },
  lastname: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true, match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Enter a valid email address.'] },
  completion: { type: Date, required: true },
  description: { type: String, required: true, trim: true },
}, { timestamps: true });

export default mongoose.model('Project', projectSchema, 'projects');
