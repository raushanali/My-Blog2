// Authentication middleware
const User = require('../models/User');

const requireAuth = (req, res, next) => {
  const userId = req.session?.userId;
  if (!userId) {
    return res.redirect('/login');
  }
  
  const user = User.findById(userId);
  if (!user) {
    return res.redirect('/login');
  }
  
  req.user = user;
  next();
};

const requireGuest = (req, res, next) => {
  if (req.session?.userId) {
    return res.redirect('/');
  }
  next();
};

module.exports = {
  requireAuth,
  requireGuest
};
