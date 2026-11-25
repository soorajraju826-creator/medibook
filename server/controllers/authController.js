const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const makeToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const safeUser = (user) => ({ id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, specialization: user.specialization, qualification: user.qualification, consultationFee: user.consultationFee });

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required.' });
    if (password.length < 8) return res.status(400).json({ message: 'Password must contain at least 8 characters.' });
    const normalizedEmail = email.trim().toLowerCase();
    if (await User.findOne({ email: normalizedEmail })) return res.status(409).json({ message: 'An account with this email already exists.' });
    const user = await User.create({ name: name.trim(), email: normalizedEmail, password: await bcrypt.hash(password, 12), phone, role: 'patient' });
    res.status(201).json({ token: makeToken(user._id), user: safeUser(user) });
  } catch (error) { res.status(500).json({ message: 'Could not create account.' }); }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: String(email || '').trim().toLowerCase() });
    if (!user || !user.isActive || !(await bcrypt.compare(password || '', user.password))) return res.status(401).json({ message: 'Invalid email or password.' });
    res.json({ token: makeToken(user._id), user: safeUser(user) });
  } catch (error) { res.status(500).json({ message: 'Could not log in.' }); }
};
exports.me = (req, res) => res.json({ user: safeUser(req.user) });
