const router = require('express').Router();
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');

router.post('/', protect, upload.array('images', 10), (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      const err = new Error('No files uploaded');
      err.statusCode = 400;
      throw err;
    }
    const urls = req.files.map((f) => `/uploads/${f.filename}`);
    res.status(201).json({ urls });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
