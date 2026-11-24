const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packageController');
const { authenticate, requireAdmin } = require('../utils/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Packages
 *   description: Streaming subscription packages and pricing plans
 */

/**
 * @swagger
 * /api/packages:
 *   get:
 *     summary: List all active subscription packages
 *     tags: [Packages]
 *     parameters:
 *       - in: query
 *         name: includeInactive
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of subscription packages
 */
router.get('/', packageController.listPackages);

/**
 * @swagger
 * /api/packages/{idOrSlug}:
 *   get:
 *     summary: Get a subscription package by UUID or slug
 *     tags: [Packages]
 *     parameters:
 *       - in: path
 *         name: idOrSlug
 *         required: true
 *         schema:
 *           type: string
 *           example: ultra-4k
 *     responses:
 *       200:
 *         description: Package details
 *       404:
 *         description: Package not found
 */
router.get('/:idOrSlug', packageController.getPackage);

/**
 * @swagger
 * /api/packages:
 *   post:
 *     summary: Create a new subscription package (Admin)
 *     tags: [Packages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PackageInput'
 *     responses:
 *       201:
 *         description: Package created
 */
router.post('/', authenticate, requireAdmin, packageController.createPackage);

/**
 * @swagger
 * /api/packages/{id}:
 *   put:
 *     summary: Update a subscription package (Admin)
 *     tags: [Packages]
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
 *             $ref: '#/components/schemas/PackageInput'
 *     responses:
 *       200:
 *         description: Package updated
 */
router.put('/:id', authenticate, requireAdmin, packageController.updatePackage);

/**
 * @swagger
 * /api/packages/{id}:
 *   delete:
 *     summary: Delete a subscription package (Admin)
 *     tags: [Packages]
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
 *         description: Package deleted
 */
router.delete('/:id', authenticate, requireAdmin, packageController.deletePackage);

module.exports = router;
