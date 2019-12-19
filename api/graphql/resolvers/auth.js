const bcrypt = require('bcryptjs');

const models = require('../../models/user');

module.exports = {
  createUser: async ({ username, password }) => {
    const existingUser = models.Poll.findOne({
      where: { username },
    });

    if (existingUser) {
      throw new Error('User exists already.');
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await models.User.create({
      username,
      displayName: username,
      password: hashedPassword,
    });

    return { user };
  },
};
