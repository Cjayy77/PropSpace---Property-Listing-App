const bcrypt = require('bcryptjs');
const userRepo = require('../repositories/userRepository');

const getProfile = async (userId) => {
  const user = await userRepo.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  return user;
};

const updateProfile = async (userId, { name, phone, avatarUrl }) => {
  const allowed = {};
  if (name !== undefined) allowed.name = name;
  if (phone !== undefined) allowed.phone = phone;
  if (avatarUrl !== undefined) allowed.avatarUrl = avatarUrl;

  const user = await userRepo.updateById(userId, allowed);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  return user;
};

const changePassword = async (userId, { oldPassword, newPassword }) => {
  if (!oldPassword || !newPassword) {
    const err = new Error('oldPassword and newPassword are required');
    err.statusCode = 400;
    throw err;
  }
  if (newPassword.length < 6) {
    const err = new Error('New password must be at least 6 characters');
    err.statusCode = 400;
    throw err;
  }

  const user = await userRepo.findByIdWithPassword(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) {
    const err = new Error('Old password is incorrect');
    err.statusCode = 401;
    throw err;
  }

  user.password = newPassword;
  await user.save();
  return { message: 'Password updated successfully' };
};

module.exports = { getProfile, updateProfile, changePassword };
