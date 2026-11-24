const { Subscription, Package } = require('../models');
const { sendSuccess, sendError } = require('../utils/response');

const subscribe = async (req, res) => {
  try {
    const { packageId, billingCycle = 'monthly' } = req.body;
    if (!packageId) {
      return sendError(res, 'packageId is required', 400);
    }
    if (!['monthly', 'yearly'].includes(billingCycle)) {
      return sendError(res, 'billingCycle must be monthly or yearly', 400);
    }

    const pkg = await Package.findByPk(packageId);
    if (!pkg || !pkg.isActive) {
      return sendError(res, 'Package not found or inactive', 404);
    }

    // Cancel any existing active subscription for this user
    await Subscription.update(
      { status: 'cancelled' },
      { where: { userId: req.user.id, status: 'active' } }
    );

    const startsAt = new Date();
    const expiresAt = new Date(startsAt);
    if (billingCycle === 'yearly') {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    } else {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    }

    const subscription = await Subscription.create({
      userId: req.user.id,
      packageId: pkg.id,
      billingCycle,
      status: 'active',
      startsAt,
      expiresAt,
    });

    const hydrated = await Subscription.findByPk(subscription.id, {
      include: [{ model: Package, as: 'package' }],
    });

    return sendSuccess(res, hydrated, 'Subscription activated', 201);
  } catch (err) {
    return sendError(res, err.message || 'Failed to subscribe', 500);
  }
};

const getMySubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      where: { userId: req.user.id, status: 'active' },
      include: [{ model: Package, as: 'package' }],
      order: [['createdAt', 'DESC']],
    });
    return sendSuccess(res, subscription, 'Active subscription retrieved');
  } catch (err) {
    return sendError(res, err.message || 'Failed to fetch subscription', 500);
  }
};

const cancelSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      where: { userId: req.user.id, status: 'active' },
    });
    if (!subscription) {
      return sendError(res, 'No active subscription found', 404);
    }
    await subscription.update({ status: 'cancelled' });
    return sendSuccess(res, subscription, 'Subscription cancelled');
  } catch (err) {
    return sendError(res, err.message || 'Failed to cancel subscription', 500);
  }
};

module.exports = { subscribe, getMySubscription, cancelSubscription };
