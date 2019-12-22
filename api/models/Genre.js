module.exports = (sequelize, DataTypes) => {
  const Genre = sequelize.define('Genre', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Genre.associate = models => {
    models.Genre.belongsToMany(models.Movie, {
      through: 'movie_genres',
    });
  };

  return Genre;
};
