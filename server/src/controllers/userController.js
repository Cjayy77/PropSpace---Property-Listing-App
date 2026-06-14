const userService = require('../services/userService');

const getMe = async (req, res, next) => {
  try {
    const user = await userService.getProfile(req.user.id);
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};

const updateMe = async (req, res, next) => {
  try {
    const { name, phone, avatarUrl } = req.body;
    const user = await userService.updateProfile(req.user.id, { name, phone, avatarUrl });
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const result = await userService.changePassword(req.user.id, { oldPassword, newPassword });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = { getMe, updateMe, changePassword };
