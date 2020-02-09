const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { formatUser } = require('./formatters');
const models = require('../../sequelize');
const { passwordCheck, usernameCheck } = require('../../utils/checks');

const loginErrorMsg = 'User or password incorrect!';

module.exports = {
  createUser: async ({ username, password, name }) => {
    const existingUser = await models.User.findOne({
      where: {
        username: {
          [models.Sequelize.Op.iLike]: username,
        },
      },
    });

    if (existingUser) {
      throw new Error('User exists already.');
    }

    const { error: pError, msg: pMsg } = passwordCheck(password);
    if (pError) {
      throw new Error(pMsg);
    }

    const { uError, uMsg } = usernameCheck(username);
    if (uError) {
      throw new Error(uMsg);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await models.User.create({
      username,
      name,
      displayName: username,
      createdAt: new Date(),
      password: hashedPassword,
    });

    return user.dataValues;
  },

  login: async ({ username, password }) => {
    const user = await models.User.findOne({
      where: {
        username: {
          [models.Sequelize.Op.iLike]: username,
        },
      },
    });

    if (!user) {
      throw new Error(loginErrorMsg);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error(loginErrorMsg);
    }

    const token = jwt.sign(
      { userIdentifier: user.identifier, username: user.username },
      'somesupersecretkey',
      { expiresIn: '1h' }
    );

    return { user: formatUser(user), token: token, tokenExpiration: 1 };
  },
};
