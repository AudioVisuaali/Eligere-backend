const { formatUser } = require('./formatters');
const models = require('../../sequelize');

module.exports = {
  checkSession: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Invalid session');
    }

    const user = await models.User.findOne({
      where: { identifier: req.userIdentifier },
    });

    if (!user) {
      throw new Error('Invalid session');
    }

    return formatUser(user);
  },

  deleteSession: async ({ identifier }) => {
    return;
  },
};
