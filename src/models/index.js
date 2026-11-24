const { sequelize } = require('../utils/database');
const User = require('./User');
const Package = require('./Package');
const Subscription = require('./Subscription');
const Category = require('./Category');
const Content = require('./Content');
const Episode = require('./Episode');
const Watchlist = require('./Watchlist');

// Associations
User.hasMany(Subscription, { foreignKey: 'userId', as: 'subscriptions' });
Subscription.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Package.hasMany(Subscription, { foreignKey: 'packageId', as: 'subscriptions' });
Subscription.belongsTo(Package, { foreignKey: 'packageId', as: 'package' });

Category.hasMany(Content, { foreignKey: 'categoryId', as: 'contents' });
Content.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

Content.hasMany(Episode, { foreignKey: 'contentId', as: 'episodes', onDelete: 'CASCADE' });
Episode.belongsTo(Content, { foreignKey: 'contentId', as: 'content' });

User.hasMany(Watchlist, { foreignKey: 'userId', as: 'watchlist' });
Watchlist.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Content.hasMany(Watchlist, { foreignKey: 'contentId', as: 'watchlistEntries', onDelete: 'CASCADE' });
Watchlist.belongsTo(Content, { foreignKey: 'contentId', as: 'content' });

module.exports = {
  sequelize,
  User,
  Package,
  Subscription,
  Category,
  Content,
  Episode,
  Watchlist,
};
