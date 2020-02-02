const { formatPoll } = require('./formatters');
const models = require('../../sequelize');

module.exports = {
  poll: async ({ identifier }) => {
    const poll = await models.Poll.findOne({
      where: { identifier: identifier },
    });

    if (!poll) {
      throw new Error('Poll does not exist');
    }

    return formatPoll(poll);
  },

  polls: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Invalid session');
    }

    const user = await models.User.findOne({
      where: { identifier: req.userIdentifier },
    });

    const polls = await user.getPolls();

    if (!polls) {
      throw new Error('Poll does not exist');
    }

    return polls.map(formatPoll);
  },

  createPoll: async (args, req) => {
    const {
      title,
      description,
      userRequired,
      opensAt,
      closesAt,
      community,
      totalVotes,
      allowComments,
      allowMovieSuggestions,
    } = args;

    if (!req.isAuth) {
      throw new Error('Invalid session');
    }

    const user = await models.User.findOne({
      where: { identifier: req.userIdentifier },
    });

    const poll = await models.Poll.create({
      title,
      description,
      createdAt: new Date(),
      opensAt: new Date(opensAt),
      closesAt: new Date(closesAt),
      userRequired,
      totalVotes,
      allowComments,
      allowMovieSuggestions,
    });

    user.addPoll(poll.id);

    if (community) {
      const communityDB = await models.Community.findOne({
        where: { identifier: community.identifier },
      });
      await poll.setCommunity(communityDB.id);
    }

    return formatPoll(poll);
  },

  updatePoll: async (args, req) => {
    const { identifier, community, ...rest } = args;

    if (!req.isAuth) {
      throw new Error('Invalid session');
    }

    const poll = await models.Poll.findOne({
      where: { identifier },
    });

    if (!poll) {
      throw new Error('Poll does not exist');
    }

    const user = await poll.getUser();

    if (user.identifier !== req.userIdentifier) {
      throw new Error('No permissions to poll');
    }

    await poll.update(rest);

    if (community) {
      const communityDB = await models.Community.findOne({
        where: { identifier: community.identifier },
      });
      await poll.setCommunity(communityDB.id);
    } else {
      await poll.setCommunity(null);
    }

    return formatPoll(poll);
  },

  deletePoll: async (args, req) => {
    const { identifier } = args;

    if (!req.isAuth) {
      throw new Error('Invalid session');
    }

    const poll = await models.Poll.findOne({
      where: { identifier },
    });

    if (!poll) {
      throw new Error('Trailer does not exist');
    }

    const user = await poll.getUser();

    if (user.identifier !== req.userIdentifier) {
      throw new Error('No permissions to poll');
    }

    poll.destroy();
  },
};
