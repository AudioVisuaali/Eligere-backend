module.exports = (sequelize, DataTypes) => {
  const Movie = sequelize.define('Movie', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    releaseYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    releaseMonth: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    releaseDay: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    length: {
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
    models.Movie.belongsTo(models.Poll, { as: 'movie', onDelete: 'CASCADE' });
    models.Movie.hasMany(models.Trailer, {
      onDelete: 'CASCADE',
    });
  };

  return Movie;
};

/*
type Movie {
  release: Release!
  length: Int!
  ratings: [Rating!]!
  trailers: [Trailer!]!
}
*/
