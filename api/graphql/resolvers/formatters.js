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
    movies: () =>
      poll
        .getMovies({
          order: [['updatedAt', 'DESC']],
        })
        .map(formatMovie),
    community: () => poll.getCommunity(formatCommunity),
    opensAt: opensAt ? new Date(opensAt).toString() : null,
    closesAt: closesAt ? new Date(closesAt).toString() : null,
    createdAt: createdAt ? new Date(createdAt).toString() : null,
    votes: () => poll.getVotes(formatVote).map(formatVote),
  };
}

function formatMovie(movie) {
  const {
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
    poll: () => movie.getPoll().then(formatPoll),
    genres: () => movie.getGenres().map(formatGenre),
    trailers: () => movie.getTrailers().map(formatTrailer),
    createdAt: createdAt ? new Date(createdAt).toString() : null,
    votes: () => movie.getVotes().map(formatVote),
  };
}

function formatVote(vote) {
  return {
    ...vote.dataValues,
    user: () => vote.getUser(),
    poll: () => vote.getPoll(),
    movie: () => vote.getMovie(),
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

module.exports = {
  movieFromJSON,
  formatPoll,
  formatMovie,
  formatTrailer,
  formatGenre,
  formatUser,
  formatCommunity,
};
