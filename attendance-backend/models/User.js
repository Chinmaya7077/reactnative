const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['teacher', 'admin'], default: 'teacher' },
  },
  { timestamps: true },
);

userSchema.methods.toSafeJSON = function () {
  const { _id, name, email, role } = this;
  return { id: _id, name, email, role };
};

module.exports = mongoose.model('User', userSchema);
