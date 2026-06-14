const favoriteService = require('../services/favoriteService');

const getWatchlist = async (req, res, next) => {
  try {
    const favorites = await favoriteService.getWatchlist(req.user.id);
    res.status(200).json({ favorites });
  } catch (err) { next(err); }
};

const getFavoriteIds = async (req, res, next) => {
  try {
    const ids = await favoriteService.getFavoriteIds(req.user.id);
    res.status(200).json({ ids });
  } catch (err) { next(err); }
};

const toggle = async (req, res, next) => {
  try {
    const result = await favoriteService.toggle(req.user.id, req.params.propertyId);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

module.exports = { getWatchlist, getFavoriteIds, toggle };
