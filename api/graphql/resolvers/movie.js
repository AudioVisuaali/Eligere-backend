const { formatMovie } = require('./formatters');
const models = require('../../models');

module.exports = {
  movie: async ({ identifier }) => {
    const movie = await models.Movie.findOne({
      where: { identifier },
    });

    if (!movie) {
      throw new Error('Movie does not exist');
    }

    return formatMovie(movie);
  },

  updateMovie: async (args, req) => {
    const {
      identifier,
      title,
      thumbnail,
      description,
      release,
      length,
      genres,
      ratings,
    } = args;

    if (!req.isAuth) {
      throw new Error('Invalid session');
    }

    const movie = await models.Movie.findOne({
      where: { identifier },
    });

    if (!movie) {
      throw new Error('Movie does not exist');
    }

    const user = await movie.getPoll().getUser();

    if (user.identifier !== req.userIdentifier) {
      throw new Error('No permissions to poll');
    }

    // Basic properties
    let modifiedMovie = {
      title,
      thumbnail,
      description,
      release,
      length,
    };

    // Turning ratings object to properties
    if (ratings) {
      modifiedMovie = {
        ...modifiedMovie,
        ...ratings,
      };
    }

    movie.update(modifiedMovie);

    // Set genres
    if (genres && genres.length) {
      const newGenres = await models.Genre.findAll({
        where: { id: genres },
      });

      await movie.setGenres(newGenres);
    }

    return formatMovie(movie);
  },

  deleteMovie: async (args, req) => {
    const { identifier } = args;

    if (!req.isAuth) {
      throw new Error('Invalid session');
    }

    const movie = await models.Movie.findOne({
      where: { identifier },
    });

    if (!movie) {
      throw new Error('Trailer does not exist');
    }

    const user = await movie.getPoll().getUser();

    if (user.identifier !== req.userIdentifier) {
      throw new Error('No permissions to poll');
    }

    movie.destroy();
  },
};
