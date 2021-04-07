const bcrypt = require('bcryptjs');
const models = require('../models/sickBayModels');

const userController = {};

// ADD USER TO DATABASE
userController.addUser = (req, res, next) => {
  const { username, password } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  models.User.create({ username, password: hash },
    (err) => {
      if (err) return next({ log: err, message: 'userController.addUser failed' });
      return next();
    });
};

// VERIFY USER INFORMATION IN DB
userController.verifyUser = (req, res, next) => {
  const { username, password } = req.body;
  models.User.findOne({ username }, 
    (err, user) => {
      if (err) return next({ log: err, message: 'userController.verifyUser failed' });
      if (user === null) {
        res.locals = 'The username and password you entered did not match our records. Please double-check and try again.'; // previous
        return next();
      }
      const verified = bcrypt.compareSync(password, user.password);
      // res should be user from line 22
      if (verified) res.locals.user = user// (PREVIOUS) res.locals = 'You have been successfully logged in. Welcome Back!';
      else res.locals = 'The username and password you entered did not match our records. Please double-check and try again.';
      return next();
    });
}

module.exports = userController;
