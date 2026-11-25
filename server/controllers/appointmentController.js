const Appointment = require('../models/Appointment');
const User = require('../models/User');

exports.create = async (req, res) => {
  try {
    const { doctorId, date, time, reason } = req.body;
    if (!doctorId || !date || !time) return res.status(400).json({ message: 'Doctor, date and time are required.' });
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < new Date().toISOString().slice(0, 10)) return res.status(400).json({ message: 'Choose a valid future date.' });
    const doctor = await User.findOne({ _id: doctorId, role: 'doctor', isActive: true });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found.' });
    const appointment = await Appointment.create({ patient: req.user._id, doctor: doctorId, date, time, reason });
    await appointment.populate('doctor', 'name specialization qualification consultationFee');
    res.status(201).json({ appointment });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'This time slot is already booked. Please choose another.' });
    res.status(500).json({ message: 'Could not book appointment.' });
  }
};

exports.mine = async (req, res) => {
  try {
    const filter = req.user.role === 'doctor' ? { doctor: req.user._id } : req.user.role === 'admin' ? {} : { patient: req.user._id };
    const appointments = await Appointment.find(filter).populate('patient', 'name email phone').populate('doctor', 'name specialization').sort({ date: -1, time: -1 });
    res.json({ appointments });
  } catch (error) { res.status(500).json({ message: 'Could not load appointments.' }); }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['confirmed', 'completed', 'cancelled', 'rejected'].includes(status)) return res.status(400).json({ message: 'Invalid appointment status.' });
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found.' });
    const ownsAppointment = req.user.role === 'doctor' && String(appointment.doctor) === String(req.user._id);
    const isPatientCancel = req.user.role === 'patient' && String(appointment.patient) === String(req.user._id) && status === 'cancelled';
    if (req.user.role !== 'admin' && !ownsAppointment && !isPatientCancel) return res.status(403).json({ message: 'Not allowed to update this appointment.' });
    appointment.status = status;
    await appointment.save();
    res.json({ appointment });
  } catch (error) { res.status(500).json({ message: 'Could not update appointment.' }); }
};
