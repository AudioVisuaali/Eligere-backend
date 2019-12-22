const { movieFromJSON, formatPoll, getPlatform } = require('./formatters');
const models = require('../../models');

module.exports = {
  poll: async ({ identifier }) => {
    const poll = await models.Poll.findOne({
      where: { identifier: identifier },
    });

    return formatPoll(poll);
  },

  createPoll: async (args, req) => {
    const { title, description, userRequired, movies } = args;

    //const user = await models.User.findOne({
    //  where: { identifier: req.userIdentifier },
    //});

    const poll = await models.Poll.create({
      title,
      description,
      createdAt: new Date(),
      userRequired,
    });

    for (const movieJson of movies) {
      const movie = await models.Movie.create(movieFromJSON(movieJson));

      const genres = await models.Genre.findAll({
        where: { id: movieJson.genres },
      });
      await movie.addGenres(genres);

      const trailers = await models.Trailer.bulkCreate(
        movieJson.trailers.map(getPlatform)
      );
      await movie.addTrailers(trailers);

      await poll.addMovie(movie.id);
    }

    return formatPoll(poll);
  },
};
