const express = require('express');
const multer = require('multer');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { authenticate, requireAdmin } = require('../utils/authMiddleware');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB direct upload limit; use presigned URL for larger videos
});

/**
 * @swagger
 * tags:
 *   name: Storage (Cloudflare R2)
 *   description: Upload media, generate presigned video upload URLs, and signed streaming URLs on Cloudflare R2
 */

/**
 * @swagger
 * /api/storage/upload:
 *   post:
 *     summary: Upload an image or media file directly to Cloudflare R2 (Admin)
 *     tags: [Storage (Cloudflare R2)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               folder:
 *                 type: string
 *                 example: posters
 *     responses:
 *       201:
 *         description: Uploaded to Cloudflare R2
 */
router.post('/upload', authenticate, requireAdmin, upload.single('file'), uploadController.uploadMedia);

/**
 * @swagger
 * /api/storage/presign-upload:
 *   post:
 *     summary: Generate a presigned PUT URL for direct large video uploads to Cloudflare R2 (Admin)
 *     tags: [Storage (Cloudflare R2)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fileName]
 *             properties:
 *               fileName:
 *                 type: string
 *                 example: jakarta-noir-4k.mp4
 *               contentType:
 *                 type: string
 *                 example: video/mp4
 *               folder:
 *                 type: string
 *                 example: videos
 *     responses:
 *       200:
 *         description: Presigned upload URL generated
 */
router.post('/presign-upload', authenticate, requireAdmin, uploadController.getPresignedUpload);

/**
 * @swagger
 * /api/storage/presign-stream:
 *   get:
 *     summary: Generate a temporary signed GET streaming URL from Cloudflare R2
 *     tags: [Storage (Cloudflare R2)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *           example: videos/sample.mp4
 *     responses:
 *       200:
 *         description: Signed stream URL generated
 */
router.get('/presign-stream', authenticate, uploadController.getPresignedStream);

/**
 * @swagger
 * /api/storage/delete:
 *   delete:
 *     summary: Delete an object from Cloudflare R2 (Admin)
 *     tags: [Storage (Cloudflare R2)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [key]
 *             properties:
 *               key:
 *                 type: string
 *                 example: posters/file.jpg
 *     responses:
 *       200:
 *         description: Object deleted
 */
router.delete('/delete', authenticate, requireAdmin, uploadController.deleteMedia);

module.exports = router;
