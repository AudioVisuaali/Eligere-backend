const models = require('../../models');

module.exports = {
  poll: async ({ identifier }) => {
    const existingUser = await models.Poll.findOne({
      where: { id: identifier },
    });
    return existingUser.dataValues;
  },
};
