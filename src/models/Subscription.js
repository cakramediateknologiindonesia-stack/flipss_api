const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Subscription = sequelize.define(
  'Subscription',
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
    packageId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    billingCycle: {
      type: DataTypes.ENUM('monthly', 'yearly'),
      defaultValue: 'monthly',
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'cancelled', 'expired'),
      defaultValue: 'active',
      allowNull: false,
    },
    startsAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: 'subscriptions',
  }
);

module.exports = Subscription;
