// Simple in-memory store used when MongoDB isn't running.
// Data resets every server restart — fine for demos and the assessment.
const bcrypt = require('bcryptjs');

const users = [];
const attendance = [];
let userId = 1;
let attendanceId = 1;

// Seed demo teacher
(async () => {
  const hash = await bcrypt.hash('123456', 10);
  users.push({
    _id: String(userId++),
    name: 'Demo Teacher',
    email: 'teacher@school.com',
    password: hash,
    role: 'teacher',
  });

  const seedStudents = [
    ['Aarav Sharma', 'Class 6', 'present'],
    ['Priya Patel', 'Class 7', 'absent'],
    ['Rohan Gupta', 'Class 8', 'late'],
    ['Sneha Iyer', 'Class 9', 'present'],
  ];
  for (const [studentName, className, status] of seedStudents) {
    attendance.push({
      _id: String(attendanceId++),
      studentName,
      className,
      status,
      note: 'Seeded record',
      photoUri: null,
      createdBy: '1',
      createdAt: new Date(),
    });
  }
})();

module.exports = {
  // user ops
  findUserByEmail: email =>
    users.find(u => u.email === (email || '').toLowerCase()) || null,
  findUserById: id => users.find(u => u._id === String(id)) || null,
  createUser: ({ name, email, password, role = 'teacher' }) => {
    const user = {
      _id: String(userId++),
      name,
      email: email.toLowerCase(),
      password,
      role,
    };
    users.push(user);
    return user;
  },
  // attendance ops
  listAttendance: () =>
    [...attendance].sort((a, b) => b.createdAt - a.createdAt).slice(0, 100),
  createAttendance: doc => {
    const record = {
      _id: String(attendanceId++),
      ...doc,
      createdAt: new Date(),
    };
    attendance.push(record);
    return record;
  },
};

module.exports.toSafeUser = u => ({
  id: u._id,
  name: u.name,
  email: u.email,
  role: u.role,
});
