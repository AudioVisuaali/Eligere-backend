const { generateUUID } = require('../utils/random');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    identifier: {
      type: DataTypes.STRING,
      defaultValue: generateUUID,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  User.associate = models => {
    models.User.hasMany(models.Poll, {
      onDelete: 'CASCADE',
    });
    models.User.hasMany(models.Community, {
      onDelete: 'CASCADE',
    });
    models.User.hasMany(models.Session, {
      onDelete: 'CASCADE',
    });
  };

  return User;
};
