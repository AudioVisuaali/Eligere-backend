const { generateShortUUID } = require('../utils/random');

module.exports = (sequelize, DataTypes) => {
  const Community = sequelize.define('Community', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    identifier: {
      type: DataTypes.STRING(500),
      defaultValue: generateShortUUID,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  Community.associate = models => {
    models.Community.belongsTo(models.User, { onDelete: 'CASCADE' });
    models.Community.hasMany(models.Poll, {
      onDelete: 'CASCADE',
    });
  };

  return Community;
};
