const mongoose = require('mongoose');
const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  reason: { type: String, trim: true, maxlength: 500, default: '' },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rejected'], default: 'pending' }
}, { timestamps: true });
appointmentSchema.index({ doctor: 1, date: 1, time: 1 }, { unique: true, partialFilterExpression: { status: { $in: ['pending', 'confirmed'] } } });
module.exports = mongoose.model('Appointment', appointmentSchema);
