const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const mem = require('../utils/memoryStore');

const usingMongo = () => mongoose.connection.readyState === 1;

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'name, email, password are required' });
  }
  const hash = await bcrypt.hash(password, 10);

  if (usingMongo()) {
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: 'Email already registered' });
    const user = await User.create({ name, email, password: hash });
    return res.status(201).json({ token: signToken(user._id), user: user.toSafeJSON() });
  }
  if (mem.findUserByEmail(email)) return res.status(409).json({ message: 'Email already registered' });
  const user = mem.createUser({ name, email, password: hash });
  res.status(201).json({ token: signToken(user._id), user: mem.toSafeUser(user) });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (usingMongo()) {
    const user = await User.findOne({ email: (email || '').toLowerCase() });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    return res.json({ token: signToken(user._id), user: user.toSafeJSON() });
  }
  const user = mem.findUserByEmail(email);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  res.json({ token: signToken(user._id), user: mem.toSafeUser(user) });
});

exports.me = asyncHandler(async (req, res) => {
  res.json({ user: req.user.toSafeJSON ? req.user.toSafeJSON() : mem.toSafeUser(req.user) });
});
