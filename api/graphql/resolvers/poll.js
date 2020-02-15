const { formatPoll } = require('./formatters');
const models = require('../../sequelize');
const { unAuthenticated } = require('../../utils/responses');

module.exports = {
  poll: async (args, req) => {
    const { identifier, requestModify } = args;
    const poll = await models.Poll.findOne({
      where: { identifier: identifier },
    });

    if (!poll) {
      throw new Error('Poll does not exist');
    }

    const user = await poll.getUser();

    if (requestModify && user.identifier !== req.userIdentifier) {
      throw new Error('No permissions to poll');
    }

    return formatPoll(poll);
  },

  polls: async (args, req) => {
    if (!req.isAuth) {
      return unAuthenticated();
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
      allowMovieSuggestions,
      voteDuplicationChecking,
      requireUserForSuggesting,
    } = args;

    if (!['IP', 'USER', 'COOKIE'].includes(voteDuplicationChecking)) {
      throw new Error();
    }
    if (!req.isAuth) {
      return unAuthenticated();
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
      allowMovieSuggestions,
      voteDuplicationChecking,
      requireUserForSuggesting,
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
      return unAuthenticated();
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
      return unAuthenticated();
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
