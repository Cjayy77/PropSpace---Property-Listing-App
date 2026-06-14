const router = require('express').Router();
const { getWatchlist, getFavoriteIds, toggle } = require('../controllers/favoriteController');
const { protect } = require('../middleware/auth');

router.get('/',     protect, getWatchlist);
router.get('/ids',  protect, getFavoriteIds);
router.post('/:propertyId', protect, toggle);

module.exports = router;
