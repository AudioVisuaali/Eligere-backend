const models = require('../../models');

module.exports = {
  poll: async ({ identifier }) => {
    const existingUser = await models.Poll.findOne({
      where: { identifier: identifier },
    });

    return existingUser.dataValues;
  },

  createPoll: async (args, req) => {
    const { title, description, userRequired } = args;

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }

    const event = await models.Poll.create({
      title,
      description,
      createdAt: new Date(),
      userRequired,
    });

    return event.dataValues;
  },
};
