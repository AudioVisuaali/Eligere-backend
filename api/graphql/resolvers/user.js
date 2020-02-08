const bcrypt = require('bcryptjs');
const models = require('../../sequelize');
const { passwordCheck } = require('../../utils/checks');
const { unAuthenticated } = require('../../utils/responses');

module.exports = {
  usernameExists: async ({ username }) => {
    const existingUser = await models.User.findOne({
      where: {
        username: {
          [models.Sequelize.Op.iLike]: username,
        },
      },
    });

    return !!existingUser;
  },

  updateProfile: async ({ displayName, firstName, surname }, req) => {
    if (!req.isAuth) {
      return unAuthenticated();
    }

    const user = await models.User.findOne({
      where: { identifier: req.userIdentifier },
    });

    await user.update({ displayName, firstName, surname });

    return {
      displayName,
      firstName,
      surname,
    };
  },

  updatePassword: async ({ oldPassword, newPassword }, req) => {
    if (!req.isAuth) {
      return unAuthenticated();
    }

    const user = await models.User.findOne({
      where: { identifier: req.userIdentifier },
    });

    const { error, msg } = passwordCheck(newPassword);
    if (error) {
      throw new Error(`new-password: ${msg}`);
    }

    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      throw new Error('Invalid oldPassword');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await user.update({ password: hashedPassword });

    return null;
  },
};
