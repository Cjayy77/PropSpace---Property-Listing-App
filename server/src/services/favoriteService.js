const favoriteRepo = require('../repositories/favoriteRepository');
const propertyRepo = require('../repositories/propertyRepository');

const getWatchlist = (userId) => favoriteRepo.findByUser(userId);

const getFavoriteIds = async (userId) => {
  const favs = await favoriteRepo.findAllPropertyIdsByUser(userId);
  return favs.map((f) => f.property.toString());
};

const toggle = async (userId, propertyId) => {
  const property = await propertyRepo.findById(propertyId);
  if (!property) {
    const err = new Error('Property not found');
    err.statusCode = 404;
    throw err;
  }

  const existing = await favoriteRepo.findOne(userId, propertyId);
  if (existing) {
    await favoriteRepo.remove(userId, propertyId);
    return { favorited: false };
  }
  await favoriteRepo.create(userId, propertyId);
  return { favorited: true };
};

module.exports = { getWatchlist, getFavoriteIds, toggle };
