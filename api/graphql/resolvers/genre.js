const models = require('../../models');

module.exports = {
  genres: async () => {
    const genres = await models.Genre.findAll();

    return genres;
  },
};
