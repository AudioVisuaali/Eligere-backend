const { generateLongUUID } = require('../utils/random');

module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define('Session', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    token: {
      type: DataTypes.STRING,
      defaultValue: generateLongUUID,
    },
    browser: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  Session.associate = models => {
    models.Session.belongsTo(models.User, { onDelete: 'CASCADE' });
  };

  return Session;
};
