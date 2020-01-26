const { getImdb } = require('../../utils/movie');

module.exports = {
  imdb: async args => {
    const { query, max } = args;
    const movies = await getImdb(query);

    if (!movies) {
      throw new Error('Something went wrong');
    }

    if (max) {
      return movies.splice(0, max);
    }

    return movies;
  },
};
