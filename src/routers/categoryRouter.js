const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticate, requireAdmin } = require('../utils/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Content genres and categories
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: List all content categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get('/', categoryController.listCategories);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a category (Admin)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, slug]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sci-Fi & Cyberpunk
 *               slug:
 *                 type: string
 *                 example: sci-fi-cyberpunk
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created
 */
router.post('/', authenticate, requireAdmin, categoryController.createCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete a category (Admin)
 *     tags: [Categories]
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
 *         description: Category deleted
 */
router.delete('/:id', authenticate, requireAdmin, categoryController.deleteCategory);

module.exports = router;
