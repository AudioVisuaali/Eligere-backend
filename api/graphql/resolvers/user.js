const bcrypt = require('bcryptjs');
const models = require('../../models');
const { passwordCheck } = require('../../utils/checks');

module.exports = {
  updateDisplayName: async ({ displayName }, req) => {
    const user = await models.User.findOne({
      where: { identifier: req.userIdentifier },
    });

    await user.update({ displayName });

    return user.displayName;
  },

  updatePassword: async ({ oldPassword, newPassword }, req) => {
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

    return user.displayName;
  },
};
