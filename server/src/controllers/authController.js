const authService = require('../services/authService');

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const { user, token } = await authService.register({ username, email, password });
    res.status(201).json({ token, user });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login({ email, password });
    res.status(200).json({ token, user });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };
