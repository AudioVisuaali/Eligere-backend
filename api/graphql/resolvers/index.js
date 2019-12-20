const auth = require('./auth');
const version = require('./version');
const user = require('./user');
const poll = require('./poll');

module.exports = {
  ...auth,
  ...version,
  ...user,
  ...poll,
};
