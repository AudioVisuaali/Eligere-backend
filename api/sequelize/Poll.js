const { generateShortUUID } = require('../utils/random');

module.exports = (sequelize, DataTypes) => {
  const Poll = sequelize.define('Poll', {
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
    description: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    requireUserForSuggesting: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    totalVotes: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    voteDuplicationChecking: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    allowMovieSuggestions: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    opensAt: DataTypes.DATE,
    closesAt: DataTypes.DATE,
  });

  Poll.associate = models => {
    models.Poll.hasMany(models.Votes);
    models.Poll.belongsTo(models.User, { onDelete: 'CASCADE' });
    models.Poll.belongsTo(models.Community, { onDelete: 'CASCADE' });
    models.Poll.hasMany(models.Movie, {
      onDelete: 'CASCADE',
    });
  };

  return Poll;
};
