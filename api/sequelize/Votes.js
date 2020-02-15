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
    ip: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  Votes.associate = models => {
    models.Votes.belongsTo(models.User);
    models.Poll.hasMany(models.Votes);
    models.Votes.belongsTo(models.Poll);
    models.Movie.hasMany(models.Votes);
    models.Votes.belongsTo(models.Movie);
  };

  return Votes;
};
