const bcrypt = require('bcryptjs');
const models = require('../../models');

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

    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      throw new Error('Invalid password');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await user.update({ password: hashedPassword });

    return user.displayName;
  },
};
