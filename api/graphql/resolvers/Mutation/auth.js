const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../../models/User');

const auth = {
  async signup(parent, { username, password }) {
    const passwordHashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      username: username,
      displayName: username,
      password: passwordHashed,
      createdAt: new Date(),
    });

    return {
      token: jwt.sign({ userId: user.id }, process.env.APP_SECRET),
      user: user.dataValues,
    };
  },

  async login(parent, { username, password }) {
    const user = await User.getOne({ where: { username } });
    if (!user) {
      throw new Error(`No user found for username: ${username}`);
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new Error('Invalid password');
    }

    return {
      token: jwt.sign({ userId: user.id }, process.env.APP_SECRET),
      user: user.dataValues,
    };
  },
};

module.exports = { auth };
