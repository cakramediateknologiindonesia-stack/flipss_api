const express = require('express');
const router = express.Router();

const authRouter = require('./authRouter');
const packageRouter = require('./packageRouter');
const subscriptionRouter = require('./subscriptionRouter');
const categoryRouter = require('./categoryRouter');
const contentRouter = require('./contentRouter');
const watchlistRouter = require('./watchlistRouter');
const uploadRouter = require('./uploadRouter');

router.get('/health', (_req, res) => {
  res.json({
    success: true,
    service: 'flips_api',
    platform: 'flipss.id',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRouter);
router.use('/packages', packageRouter);
router.use('/subscriptions', subscriptionRouter);
router.use('/categories', categoryRouter);
router.use('/contents', contentRouter);
router.use('/watchlist', watchlistRouter);
router.use('/storage', uploadRouter);

module.exports = router;
