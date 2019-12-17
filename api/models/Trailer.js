module.exports = (sequelize, DataTypes) => {
  const Trailer = sequelize.define('Trailer', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    platform: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  Trailer.associate = models => {
    models.Trailer.belongsTo(models.Movie, {
      as: 'trailer',
      onDelete: 'CASCADE',
    });
  };

  return Trailer;
};
