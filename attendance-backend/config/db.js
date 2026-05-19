const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri || process.env.IN_MEMORY === 'true') {
    console.log('Running in IN-MEMORY mode (no MongoDB). Data resets on restart.');
    return;
  }
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected:', uri);
  } catch (err) {
    console.error('MongoDB connection failed, falling back to IN-MEMORY mode:', err.message);
  }
}

module.exports = connectDB;
