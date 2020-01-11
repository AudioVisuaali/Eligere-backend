const { generateShortUUID } = require('../utils/random');

module.exports = (sequelize, DataTypes) => {
  const Trailer = sequelize.define('Trailer', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    identifier: {
      type: DataTypes.STRING,
      defaultValue: generateShortUUID,
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
    thumbnailURL: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  Trailer.associate = models => {
    models.Trailer.belongsTo(models.Movie, {
      onDelete: 'CASCADE',
    });
  };

  return Trailer;
};
