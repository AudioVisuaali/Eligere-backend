const { getImdb } = require('../../utils/movie');

module.exports = {
  imdb: async args => {
    const { query } = args;
    const movies = await getImdb(query);

    if (!movies) {
      throw new Error('Something went wrong');
    }

    return movies;
  },
};
