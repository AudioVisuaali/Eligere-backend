function movieFromJSON(movie) {
  const { imdb, rottenTomatoes, metacritic, googleUsers } = movie.ratings;
  return {
    ...movie,
    imdb,
    rottenTomatoes,
    metacritic,
    googleUsers,
    createdAt: new Date(),
  };
}

function formatPoll(poll) {
  return {
    ...poll.dataValues,
    movies: () => poll.getMovies().map(formatMovie),
  };
}

function formatMovie(movie) {
  return {
    ...movie.dataValues,
    ratings: {
      imdb: movie.imdb,
      rottenTomatoes: movie.rottenTomatoes,
      metacritic: movie.metacritic,
      googleUsers: movie.googleUsers,
    },
    genres: () => movie.getGenres().map(formatGenre),
    trailers: () => movie.getTrailers().map(formatTrailer),
  };
}

function formatUser(user) {
  return {
    ...user.dataValues,
    polls: () => user.getPolls({ limit: 20 }).map(formatPoll),
  };
}

function formatGenre(genre) {
  return genre.dataValues;
}

function formatTrailer(preview) {
  return preview.dataValues;
}

function getPlatform(url) {
  const MATCH_URL = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})|youtube\.com\/playlist\?list=/;

  if (!url) {
    return;
  }

  const canPlay = MATCH_URL.test(url);
  if (!canPlay) {
    return;
  }

  const slug = url.match(MATCH_URL)[1];
  return {
    platform: 'youtube',
    url,
    slug,
  };
}

module.exports = {
  movieFromJSON,
  formatPoll,
  formatMovie,
  formatTrailer,
  formatGenre,
  formatUser,
  getPlatform,
};