const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Watchlist = sequelize.define(
  'Watchlist',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    contentId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    progressSeconds: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
  },
  {
    tableName: 'watchlists',
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'content_id'],
      },
    ],
  }
);

module.exports = Watchlist;
