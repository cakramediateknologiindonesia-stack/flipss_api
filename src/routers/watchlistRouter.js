const express = require('express');
const router = express.Router();
const watchlistController = require('../controllers/watchlistController');
const { authenticate } = require('../utils/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Watchlist
 *   description: User personal My List and watch progress
 */

/**
 * @swagger
 * /api/watchlist:
 *   get:
 *     summary: Get current user's My List
 *     tags: [Watchlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Watchlist items
 */
router.get('/', authenticate, watchlistController.getMyWatchlist);

/**
 * @swagger
 * /api/watchlist:
 *   post:
 *     summary: Add a movie or series to My List
 *     tags: [Watchlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [contentId]
 *             properties:
 *               contentId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Added to watchlist
 */
router.post('/', authenticate, watchlistController.addToWatchlist);

/**
 * @swagger
 * /api/watchlist/{contentId}/progress:
 *   patch:
 *     summary: Save playback progress in seconds
 *     tags: [Watchlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contentId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               progressSeconds:
 *                 type: integer
 *                 example: 1420
 *     responses:
 *       200:
 *         description: Progress saved
 */
router.patch('/:contentId/progress', authenticate, watchlistController.updateProgress);

/**
 * @swagger
 * /api/watchlist/{contentId}:
 *   delete:
 *     summary: Remove item from My List
 *     tags: [Watchlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Removed from watchlist
 */
router.delete('/:contentId', authenticate, watchlistController.removeFromWatchlist);

module.exports = router;
