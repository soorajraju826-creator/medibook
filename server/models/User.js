const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8 },
  role: { type: String, enum: ['patient', 'doctor', 'admin'], default: 'patient' },
  phone: { type: String, trim: true, default: '' },
  specialization: { type: String, trim: true, default: '' },
  qualification: { type: String, trim: true, default: '' },
  consultationFee: { type: Number, min: 0, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
module.exports = mongoose.model('User', userSchema);
