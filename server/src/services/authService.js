const jwt = require('jsonwebtoken');
const userRepo = require('../repositories/userRepository');

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const register = async ({ username, email, password }) => {
  if (!username || !email || !password) {
    const err = new Error('Username, email, and password are required');
    err.statusCode = 400;
    throw err;
  }

  const existing = await userRepo.findByEmailOrUsername(email, username);
  if (existing) {
    const field = existing.email === email.toLowerCase() ? 'email' : 'username';
    const err = new Error(`An account with that ${field} already exists`);
    err.statusCode = 400;
    throw err;
  }

  const user = await userRepo.create({ username, email, password });
  const token = signToken(user._id);
  return { user, token };
};

const login = async ({ email, password }) => {
  if (!email || !password) {
    const err = new Error('Email and password are required');
    err.statusCode = 400;
    throw err;
  }

  const user = await userRepo.findByEmailWithPassword(email);
  if (!user || !(await user.comparePassword(password))) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const token = signToken(user._id);
  return { user, token };
};

module.exports = { register, login };
