require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');
const Attendance = require('../models/Attendance');

async function seed() {
  await connectDB();
  await User.deleteMany();
  await Attendance.deleteMany();

  const hash = await bcrypt.hash('123456', 10);
  const teacher = await User.create({
    name: 'Demo Teacher',
    email: 'teacher@school.com',
    password: hash,
    role: 'teacher',
  });

  const students = ['Aarav Sharma', 'Priya Patel', 'Rohan Gupta', 'Sneha Iyer'];
  const docs = students.map((studentName, i) => ({
    studentName,
    className: `Class ${(i % 5) + 6}`,
    status: ['present', 'absent', 'late'][i % 3],
    note: 'Seeded record',
    createdBy: teacher._id,
  }));
  await Attendance.insertMany(docs);

  console.log('Seeded. Login with teacher@school.com / 123456');
  await mongoose.connection.close();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
