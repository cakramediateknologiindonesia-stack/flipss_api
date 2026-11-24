const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Episode = sequelize.define(
  'Episode',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    contentId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    seasonNumber: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
    },
    episodeNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(180),
      allowNull: false,
    },
    synopsis: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    durationMinutes: {
      type: DataTypes.INTEGER,
      defaultValue: 48,
      allowNull: false,
    },
    thumbnailUrl: {
      type: DataTypes.STRING(512),
      allowNull: true,
    },
    videoUrl: {
      type: DataTypes.STRING(512),
      allowNull: true,
    },
    r2VideoKey: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: 'episodes',
  }
);

module.exports = Episode;
