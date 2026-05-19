const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true, trim: true },
    className: { type: String, required: true },
    status: {
      type: String,
      enum: ['present', 'absent', 'late'],
      required: true,
    },
    note: { type: String, default: '' },
    photoUri: { type: String, default: null },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

attendanceSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
