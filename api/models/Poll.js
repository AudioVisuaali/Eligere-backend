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
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    userRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    opensAt: DataTypes.DATE,
    closesAt: DataTypes.DATE,
  });

  Poll.associate = models => {
    models.Poll.belongsTo(models.User, { as: 'user', onDelete: 'CASCADE' });
    models.Poll.hasMany(models.Movie, {
      onDelete: 'CASCADE',
    });
  };

  return Poll;
};

/*
type Poll {
  community: Community
  prevPoll: Poll
}
*/
