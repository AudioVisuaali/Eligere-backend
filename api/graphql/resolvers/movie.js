const { formatMovie, movieFromJSON } = require('./formatters');
const { getImdbMovie } = require('../../utils/movie');
const models = require('../../sequelize');

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

  createMovie: async (args, req) => {
    const { pollIdentifier, movie: movieJSON } = args;

    if (!req.isAuth) {
      throw new Error('Invalid session');
    }

    const poll = await models.Poll.findOne({
      where: { identifier: pollIdentifier },
    });

    if (!poll) {
      throw new Error('Movie does not exist');
    }

    const user = await poll.getUser();
    if (user.identifier !== req.userIdentifier) {
      throw new Error('No permissions to poll');
    }

    const movie = await models.Movie.create(movieFromJSON(movieJSON));

    const genres = await models.Genre.findAll({
      where: { id: movieJSON.genres },
    });
    await movie.addGenres(genres);

    await poll.addMovie(movie.id);

    return formatMovie(movie);
  },

  createMovieImdb: async (args, req) => {
    const { pollIdentifier, id } = args;

    if (!req.isAuth) {
      throw new Error('Invalid session');
    }

    const poll = await models.Poll.findOne({
      where: { identifier: pollIdentifier },
    });

    if (!poll) {
      throw new Error('Movie does not exist');
    }

    const user = await poll.getUser();
    if (user.identifier !== req.userIdentifier) {
      throw new Error('No permissions to poll');
    }

    const imdbMovieJson = await getImdbMovie(id);

    if (!imdbMovieJson) {
      throw new Error('Invalid imdb movie');
    }

    const movie = await models.Movie.create(imdbMovieJson);

    // const genres = await models.Genre.findAll({
    //   where: { id: movieJSON.genres },
    // });
    // await movie.addGenres(genres);

    await poll.addMovie(movie.id);

    return formatMovie(movie);
  },

  updateMovie: async (args, req) => {
    const {
      identifier,
      title,
      thumbnail,
      description,
      released,
      duration,
      genres,
      ratings,
    } = args;

    if (!req.isAuth) {
      throw new Error('Invalid session');
    }
    const movie = await models.Movie.findOne({
      where: { identifier },
    });

    console.log(identifier);
    if (!movie) {
      throw new Error('Movie does not exist');
    }

    const poll = await movie.getPoll();
    const user = await poll.getUser();

    if (user.identifier !== req.userIdentifier) {
      throw new Error('No permissions to poll');
    }

    // Basic properties
    let modifiedMovie = {
      title,
      thumbnail,
      description,
      released,
      duration,
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

    const poll = await movie.getPoll();
    const user = await poll.getUser();

    if (user.identifier !== req.userIdentifier) {
      throw new Error('No permissions to poll');
    }

    movie.destroy();
  },
};
