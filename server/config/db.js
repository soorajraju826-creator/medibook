const mongoose = require('mongoose');
const dns = require('dns');

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI missing in .env');
  }

  dns.setServers([
    '1.1.1.1',
    '8.8.8.8'
  ]);

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10
    });

    console.log('MongoDB Connected:', mongoose.connection.host);
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    throw error;
  }
}

module.exports = connectDB;