const { generateUUID } = require('../utils/random');

module.exports = (sequelize, DataTypes) => {
  const Votes = sequelize.define('Votes', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    identifier: {
      type: DataTypes.STRING,
      defaultValue: generateUUID,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  Votes.associate = models => {
    models.Votes.belongsTo(models.User);
    models.Votes.belongsTo(models.Poll);
    models.Votes.belongsTo(models.Movie);
  };

  return Votes;
};
