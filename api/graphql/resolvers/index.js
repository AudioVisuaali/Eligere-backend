const auth = require('./auth');
const version = require('./version');
const user = require('./user');
const poll = require('./poll');
const genre = require('./genre');
const movie = require('./movie');
const trailer = require('./trailer');
const session = require('./session');
const community = require('./community');
const imdb = require('./imdb');
const votes = require('./votes');

module.exports = {
  ...auth,
  ...version,
  ...user,
  ...genre,
  ...poll,
  ...movie,
  ...trailer,
  ...session,
  ...community,
  ...imdb,
  ...votes,
};
