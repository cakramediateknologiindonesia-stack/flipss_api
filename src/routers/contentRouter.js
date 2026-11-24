const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const { authenticate, requireAdmin } = require('../utils/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Contents
 *   description: Movies, series, and episodes catalog
 */

/**
 * @swagger
 * /api/contents:
 *   get:
 *     summary: List movies and series with filters and pagination
 *     tags: [Contents]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [movie, series]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: trending
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: original
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Paginated list of contents
 */
router.get('/', contentController.listContents);

/**
 * @swagger
 * /api/contents/{idOrSlug}:
 *   get:
 *     summary: Get content detail (with episodes and signed R2 stream URL if configured)
 *     tags: [Contents]
 *     parameters:
 *       - in: path
 *         name: idOrSlug
 *         required: true
 *         schema:
 *           type: string
 *           example: jakarta-noir
 *     responses:
 *       200:
 *         description: Content details
 *       404:
 *         description: Content not found
 */
router.get('/:idOrSlug', contentController.getContent);

/**
 * @swagger
 * /api/contents:
 *   post:
 *     summary: Create a new movie or series (Admin)
 *     tags: [Contents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContentInput'
 *     responses:
 *       201:
 *         description: Content created
 */
router.post('/', authenticate, requireAdmin, contentController.createContent);

/**
 * @swagger
 * /api/contents/{id}:
 *   put:
 *     summary: Update content metadata (Admin)
 *     tags: [Contents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContentInput'
 *     responses:
 *       200:
 *         description: Content updated
 */
router.put('/:id', authenticate, requireAdmin, contentController.updateContent);

/**
 * @swagger
 * /api/contents/{id}:
 *   delete:
 *     summary: Delete content (Admin)
 *     tags: [Contents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Content deleted
 */
router.delete('/:id', authenticate, requireAdmin, contentController.deleteContent);

/**
 * @swagger
 * /api/contents/{id}/episodes:
 *   post:
 *     summary: Add an episode to a series (Admin)
 *     tags: [Contents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [seasonNumber, episodeNumber, title]
 *             properties:
 *               seasonNumber:
 *                 type: integer
 *                 example: 1
 *               episodeNumber:
 *                 type: integer
 *                 example: 1
 *               title:
 *                 type: string
 *                 example: Pilot - Neon Rain
 *               synopsis:
 *                 type: string
 *               durationMinutes:
 *                 type: integer
 *                 example: 52
 *               thumbnailUrl:
 *                 type: string
 *               videoUrl:
 *                 type: string
 *               r2VideoKey:
 *                 type: string
 *     responses:
 *       201:
 *         description: Episode added
 */
router.post('/:id/episodes', authenticate, requireAdmin, contentController.addEpisode);

module.exports = router;
