function movieFromJSON(movie) {
  const { imdb, rottenTomatoes, metacritic, googleUsers } = movie.ratings;
  return {
    ...movie,
    imdb,
    rottenTomatoes,
    metacritic,
    googleUsers,
  };
}

function formatPoll(poll) {
  const { createdAt, opensAt, closesAt, ...rest } = poll.dataValues;
  return {
    ...rest,
    movies: () => poll.getMovies().map(formatMovie),
    communities: () => poll.getCommunities(formatCommunity),
    opensAt: opensAt ? new Date(opensAt).toString() : null,
    closesAt: closesAt ? new Date(closesAt).toString() : null,
    createdAt: createdAt ? new Date(createdAt).toString() : null,
  };
}

function formatMovie(movie) {
  const {
    released,
    createdAt,
    imdb,
    rottenTomatoes,
    metacritic,
    googleUsers,
    ...rest
  } = movie.dataValues;
  return {
    ...rest,
    ratings: {
      imdb,
      rottenTomatoes,
      metacritic,
      googleUsers,
    },
    genres: () => movie.getGenres().map(formatGenre),
    trailers: () => movie.getTrailers().map(formatTrailer),
    released: released ? new Date(released).toString() : null,
    createdAt: createdAt ? new Date(createdAt).toString() : null,
  };
}

function formatCommunity(community) {
  const { createdAt, ...rest } = community.dataValues;
  return {
    ...rest,
    polls: () => community.getPolls().map(formatPoll),
    createdAt: createdAt ? new Date(createdAt).toString() : null,
  };
}

function formatUser(user) {
  const { createdAt, ...rest } = user.dataValues;

  const polls = () =>
    user.getPolls({ order: [['createdAt', 'DESC']] }).map(formatPoll);
  const communities = () =>
    user
      .getCommunities({ order: [['updatedAt', 'DESC']] })
      .map(formatCommunity);

  return {
    ...rest,
    polls,
    communities,
    createdAt: createdAt ? new Date(createdAt).toString() : null,
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
  formatCommunity,
  getPlatform,
};
