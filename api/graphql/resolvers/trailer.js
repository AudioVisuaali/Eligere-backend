const { formatTrailer, getPlatform } = require('./formatters');
const models = require('../../models');

module.exports = {
  trailer: async ({ identifier }) => {
    const trailer = await models.Movie.findOne({
      where: { identifier },
    });

    if (!trailer) {
      throw new Error('Movie does not exist');
    }

    return formatTrailer(trailer);
  },

  updateTrailer: async (args, req) => {
    const { identifier, url } = args;

    if (!req.isAuth) {
      throw new Error('Invalid session');
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

    const newVideo = getPlatform(url);

    if (newVideo) {
      trailer.update(newVideo);
    }

    return formatTrailer(trailer);
  },

  deleteTrailer: async (args, req) => {
    const { identifier } = args;

    if (!req.isAuth) {
      throw new Error('Invalid session');
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
