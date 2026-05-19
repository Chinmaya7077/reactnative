const mongoose = require('mongoose');
const Attendance = require('../models/Attendance');
const asyncHandler = require('../utils/asyncHandler');
const mem = require('../utils/memoryStore');

const usingMongo = () => mongoose.connection.readyState === 1;

function format(r) {
  return {
    id: r._id,
    studentName: r.studentName,
    className: r.className,
    status: r.status,
    note: r.note,
    photoUri: r.photoUri,
    createdAt: r.createdAt,
  };
}

exports.list = asyncHandler(async (req, res) => {
  if (usingMongo()) {
    const rows = await Attendance.find().sort({ createdAt: -1 }).limit(100).lean();
    return res.json(rows.map(format));
  }
  res.json(mem.listAttendance().map(format));
});

exports.create = asyncHandler(async (req, res) => {
  const { studentName, className, status, note, photoUri } = req.body;
  if (!studentName || !className || !status) {
    return res
      .status(400)
      .json({ message: 'studentName, className, status are required' });
  }
  if (usingMongo()) {
    const record = await Attendance.create({
      studentName, className, status, note, photoUri,
      createdBy: req.user._id,
    });
    return res.status(201).json(format(record));
  }
  const record = mem.createAttendance({
    studentName, className, status, note: note || '', photoUri: photoUri || null,
    createdBy: req.user._id,
  });
  res.status(201).json(format(record));
});
