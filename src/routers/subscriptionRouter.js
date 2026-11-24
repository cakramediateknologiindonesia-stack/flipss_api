const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const { authenticate } = require('../utils/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Subscriptions
 *   description: User package subscriptions
 */

/**
 * @swagger
 * /api/subscriptions:
 *   post:
 *     summary: Subscribe authenticated user to a package
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [packageId]
 *             properties:
 *               packageId:
 *                 type: string
 *               billingCycle:
 *                 type: string
 *                 enum: [monthly, yearly]
 *                 default: monthly
 *     responses:
 *       201:
 *         description: Subscription activated
 */
router.post('/', authenticate, subscriptionController.subscribe);

/**
 * @swagger
 * /api/subscriptions/me:
 *   get:
 *     summary: Get active subscription for current user
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active subscription
 */
router.get('/me', authenticate, subscriptionController.getMySubscription);

/**
 * @swagger
 * /api/subscriptions/cancel:
 *   post:
 *     summary: Cancel current user's active subscription
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription cancelled
 */
router.post('/cancel', authenticate, subscriptionController.cancelSubscription);

module.exports = router;
