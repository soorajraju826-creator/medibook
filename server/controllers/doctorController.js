const User = require('../models/User');
exports.list = async (req, res) => {
  try {
    const filter = { role: 'doctor', isActive: true };
    if (req.query.specialization) filter.specialization = new RegExp(String(req.query.specialization).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    if (req.query.search) filter.name = new RegExp(String(req.query.search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    const doctors = await User.find(filter).select('name email specialization qualification consultationFee').sort({ name: 1 });
    res.json({ doctors });
  } catch (error) { res.status(500).json({ message: 'Could not load doctors.' }); }
};
