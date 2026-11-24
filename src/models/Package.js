const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Package = sequelize.define(
  'Package',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(80),
      allowNull: false,
      unique: true,
    },
    tagline: {
      type: DataTypes.STRING(160),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    priceMonthly: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Price in IDR (e.g. 54000)',
    },
    priceYearly: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Discounted yearly price in IDR',
    },
    currency: {
      type: DataTypes.STRING(10),
      defaultValue: 'IDR',
      allowNull: false,
    },
    resolution: {
      type: DataTypes.STRING(40),
      defaultValue: '1080p Full HD',
      allowNull: false,
    },
    maxDevices: {
      type: DataTypes.INTEGER,
      defaultValue: 2,
      allowNull: false,
    },
    downloadsAllowed: {
      type: DataTypes.INTEGER,
      defaultValue: 2,
      allowNull: false,
    },
    adsFree: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    tierLevel: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
    },
    features: {
      type: DataTypes.JSON,
      defaultValue: [],
      allowNull: false,
    },
    isPopular: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    tableName: 'packages',
  }
);

module.exports = Package;
