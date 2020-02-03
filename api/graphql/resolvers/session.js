const { formatUser } = require('./formatters');
const models = require('../../sequelize');

module.exports = {
  checkSession: async (args, req) => {
    if (!req.isAuth) {
      return null;
    }

    const user = await models.User.findOne({
      where: { identifier: req.userIdentifier },
    });

    if (!user) {
      return null;
    }

    return formatUser(user);
  },

  deleteSession: async ({ identifier }) => {
    return;
  },
};
