const models = require('../../sequelize');

module.exports = {
  genres: async () => {
    const genres = await models.Genre.findAll();

    return genres;
  },
};
