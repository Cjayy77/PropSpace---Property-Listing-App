const router = require('express').Router();
const { getMe, updateMe, changePassword } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);
router.put('/me/password', protect, changePassword);

module.exports = router;
