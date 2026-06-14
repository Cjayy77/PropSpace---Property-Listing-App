const Property = require('../models/Property');

const findAll = (filter = {}, sort = { createdAt: -1 }) =>
  Property.find(filter).populate('owner', 'username name email').sort(sort);

const findById = (id) =>
  Property.findById(id).populate('owner', 'username name email phone');

const findByOwner = (ownerId) =>
  Property.find({ owner: ownerId }).sort({ createdAt: -1 });

const create = (data) => Property.create(data);

const updateById = (id, data) =>
  Property.findByIdAndUpdate(id, data, { new: true, runValidators: true });

const deleteById = (id) => Property.findByIdAndDelete(id);

module.exports = {
  findAll,
  findById,
  findByOwner,
  create,
  updateById,
  deleteById,
};
