const { formatTrailer } = require('./formatters');
const { getPlatform } = require('../../utils/video');
const models = require('../../sequelize');
const { unAuthenticated } = require('../../utils/responses');

module.exports = {
  trailer: async ({ identifier }) => {
    const trailer = await models.Trailer.findOne({
      where: { identifier },
    });

    if (!trailer) {
      throw new Error('Movie does not exist');
    }

    return formatTrailer(trailer);
  },

  createTrailer: async (args, req) => {
    // Movie identifier
    const { movieIdentifier, url } = args;

    if (!req.isAuth) {
      return unAuthenticated();
    }

    const movie = await models.Movie.findOne({
      where: { identifier: movieIdentifier },
    });

    if (!movie) {
      throw new Error('Movie does not exist');
    }

    const poll = await movie.getPoll();
    const user = await poll.getUser();

    if (user.identifier !== req.userIdentifier) {
      throw new Error('No permissions to poll');
    }

    const trailerJSON = await getPlatform(url);

    if (!trailerJSON) {
      throw new Error('Invalid url');
    }

    const trailer = await models.Trailer.create(trailerJSON);

    await movie.addTrailer(trailer);

    return formatTrailer(trailer);
  },

  updateTrailer: async (args, req) => {
    const { identifier, url } = args;

    if (!req.isAuth) {
      return unAuthenticated();
    }

    const trailer = await models.Trailer.findOne({
      where: { identifier },
    });

    if (!trailer) {
      throw new Error('Trailer does not exist');
    }

    const movie = await trailer.getMovie();
    const poll = await movie.getPoll();
    const user = await poll.getUser();

    if (user.identifier !== req.userIdentifier) {
      throw new Error('No permissions to poll');
    }

    const trailerJSON = await getPlatform(url);

    if (trailerJSON) {
      trailer.update(trailerJSON);
    }

    return formatTrailer(trailer);
  },

  deleteTrailer: async (args, req) => {
    const { identifier } = args;

    if (!req.isAuth) {
      return unAuthenticated();
    }

    const trailer = await models.Trailer.findOne({
      where: { identifier },
    });

    if (!trailer) {
      throw new Error('Trailer does not exist');
    }

    const user = await trailer
      .getMovie()
      .getPoll()
      .getUser();

    if (user.identifier !== req.userIdentifier) {
      throw new Error('No permissions to poll');
    }

    trailer.destroy();
  },
};
