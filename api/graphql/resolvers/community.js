const { formatCommunity } = require('./formatters');
const models = require('../../sequelize');

module.exports = {
  community: async ({ identifier }) => {
    const community = await models.Community.findOne({
      where: { identifier },
    });

    if (!community) {
      throw new Error('Movie does not exist');
    }

    return formatCommunity(community);
  },

  communities: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Invalid session');
    }

    const user = await models.User.findOne({
      where: { identifier: req.userIdentifier },
    });

    const communities = await user.getCommunities();

    if (!communities) {
      throw new Error('Poll does not exist');
    }

    return communities.map(formatCommunity);
  },

  createCommunity: async (args, req) => {
    const { title, description } = args;

    if (!req.isAuth) {
      throw new Error('Invalid session');
    }

    const user = await models.User.findOne({
      where: { identifier: req.userIdentifier },
    });

    const community = await models.Community.create({ title, description });

    user.addCommunity(community.id);

    return formatCommunity(community);
  },

  updateCommunity: async (args, req) => {
    const { identifier, title, description } = args;

    if (!req.isAuth) {
      throw new Error('Invalid session');
    }

    const community = await models.Community.findOne({
      where: { identifier },
    });

    if (!community) {
      throw new Error('Community does not exist');
    }

    const user = await community.getUser();

    if (user.identifier !== req.userIdentifier) {
      throw new Error('No permissions to poll');
    }

    community.update({ title, description });

    return formatCommunity(community);
  },
};
