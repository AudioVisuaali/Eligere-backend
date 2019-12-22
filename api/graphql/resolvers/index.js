const auth = require('./auth');
const version = require('./version');
const user = require('./user');
const poll = require('./poll');
const genre = require('./genre');

module.exports = {
  ...auth,
  ...version,
  ...user,
  ...genre,
  ...poll,
};
