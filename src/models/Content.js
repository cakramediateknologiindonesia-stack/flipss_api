const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Content = sequelize.define(
  'Content',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(180),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: true,
    },
    synopsis: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('movie', 'series'),
      defaultValue: 'movie',
      allowNull: false,
    },
    releaseYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    durationMinutes: {
      type: DataTypes.INTEGER,
      defaultValue: 110,
      allowNull: false,
    },
    maturityRating: {
      type: DataTypes.STRING(16),
      defaultValue: '16+',
      allowNull: false,
    },
    imdbRating: {
      type: DataTypes.DECIMAL(3, 1),
      defaultValue: 8.2,
      allowNull: false,
    },
    genres: {
      type: DataTypes.JSON,
      defaultValue: [],
      allowNull: false,
    },
    cast: {
      type: DataTypes.JSON,
      defaultValue: [],
      allowNull: false,
    },
    posterUrl: {
      type: DataTypes.STRING(512),
      allowNull: false,
    },
    backdropUrl: {
      type: DataTypes.STRING(512),
      allowNull: false,
    },
    trailerUrl: {
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
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    isTrending: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    isOriginal: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    requiredPackageTier: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    tableName: 'contents',
  }
);

module.exports = Content;
