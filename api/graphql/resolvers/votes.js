const models = require('../../sequelize');
const { formatVote } = require('./formatters');

module.exports = {
  createVote: async (args, req) => {
    const { movie: movieId, poll: pollIdentifier } = args;

    const user = await models.User.findOne({
      where: { identifier: req.userIdentifier },
    });

    const poll = await models.Poll.findOne({
      where: { identifier: pollIdentifier },
    });

    const votes = await models.Poll.findOne({
      where: { user_id: user.id, poll_id: poll.id },
    });

    if (votes.length >= poll.totalVotes) {
      throw new Error();
    }

    const movie = await models.Movie.findOne({
      where: { identifier: movieId },
    });

    if (!movie) {
      throw new Error();
    }

    const vote = await models.Votes.create({
      createdAt: new Date(),
    });

    vote.addUser(user.id);
    vote.addPoll(poll.id);
    vote.addPoll(movie.id);

    return formatVote(vote);
  },

  deleteVote: async (args, req) => {
    const { vote: voteIdentifier } = args;

    const user = await models.User.findOne({
      where: { identifier: req.userIdentifier },
    });

    if (!user) {
      throw new Error();
    }

    const vote = await models.User.findOne({
      where: { identifier: voteIdentifier },
    });

    vote.destroy();
  },
};
