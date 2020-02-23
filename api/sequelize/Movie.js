const { generateShortUUID } = require('../utils/random');

module.exports = (sequelize, DataTypes) => {
  const Movie = sequelize.define('Movie', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    identifier: {
      type: DataTypes.STRING,
      defaultValue: generateShortUUID,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    released: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    imdb: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    rottenTomatoes: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    metacritic: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    googleUsers: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  Movie.associate = models => {
    models.Movie.hasMany(models.Votes);
    models.Movie.belongsTo(models.Poll, { onDelete: 'CASCADE' });
    models.Movie.hasMany(models.Trailer, {
      onDelete: 'CASCADE',
    });
    models.Movie.belongsToMany(models.Genre, {
      through: 'movie_genres',
    });
  };

  return Movie;
};
