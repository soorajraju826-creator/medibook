require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',').map(v => v.trim()) : 'http://localhost:4200' }));
app.use(express.json({ limit: '1mb' }));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-7', legacyHeaders: false }));
app.get('/', (req, res) => res.json({ name: 'MediBook API', status: 'running', health: '/api/health' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok', database: require('mongoose').connection.readyState === 1 ? 'connected' : 'disconnected' }));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use((req, res) => res.status(404).json({ message: 'Route not found.' }));
app.use((err, req, res, next) => { console.error(err); res.status(500).json({ message: 'Internal server error.' }); });

const PORT = process.env.PORT || 5000;
connectDB().then(() => app.listen(PORT, () => console.log(`MediBook API listening on port ${PORT}`))).catch(error => {
  console.error('\nDatabase connection failed. Check server/.env and your Atlas Network Access allowlist.');
  console.error(error.message);
  process.exit(1);
});
