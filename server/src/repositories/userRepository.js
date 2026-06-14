const User = require('../models/User');

const findById = (id) => User.findById(id);

const findByEmail = (email) => User.findOne({ email });

const findByEmailWithPassword = (email) => User.findOne({ email }).select('+password');

const findByUsername = (username) => User.findOne({ username });

const findByEmailOrUsername = (email, username) =>
  User.findOne({ $or: [{ email }, { username }] });

const create = (data) => User.create(data);

const updateById = (id, data) =>
  User.findByIdAndUpdate(id, data, { new: true, runValidators: true });

const findByIdWithPassword = (id) => User.findById(id).select('+password');

module.exports = {
  findById,
  findByEmail,
  findByEmailWithPassword,
  findByUsername,
  findByEmailOrUsername,
  create,
  updateById,
  findByIdWithPassword,
};
