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

  createPoll: async (args, req) => {
    const {
      title,
      description,
      userRequired,
      opensAt,
      closesAt,
      community,
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
    });

    user.addPoll(poll.id);

    return formatPoll(poll);
  },

  updatePoll: async (args, req) => {
    const { identifier, ...rest } = args;

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
