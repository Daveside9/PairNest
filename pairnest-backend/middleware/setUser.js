const User = require('../models/User');

module.exports = async (req, res, next) => {
  const email = req.headers['x-user-email'];
  if (email) {
    const user = await User.findOne({ email });
    if (user) {
      req.user = user;
    }
  }
  next();
};
