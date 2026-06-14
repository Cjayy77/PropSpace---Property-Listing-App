const Favorite = require('../models/Favorite');

const findByUser = (userId) =>
  Favorite.find({ user: userId })
    .populate({
      path: 'property',
      populate: { path: 'owner', select: 'username name email' },
    })
    .sort({ createdAt: -1 });

const findOne = (userId, propertyId) =>
  Favorite.findOne({ user: userId, property: propertyId });

const findAllPropertyIdsByUser = (userId) =>
  Favorite.find({ user: userId }, 'property').lean();

const create = (userId, propertyId) =>
  Favorite.create({ user: userId, property: propertyId });

const remove = (userId, propertyId) =>
  Favorite.findOneAndDelete({ user: userId, property: propertyId });

module.exports = { findByUser, findOne, findAllPropertyIdsByUser, create, remove };
