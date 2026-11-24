const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Flipss.id Streaming Platform API',
      version: '1.0.0',
      description:
        'REST API for Flipss.id — Netflix-style streaming platform built with Express.js, MySQL2, Sequelize, CORS (*), and Cloudflare R2 Storage.',
      contact: {
        name: 'Flipss.id Engineering',
        url: 'https://flipss.id',
      },
    },
    servers: [
      {
        url: process.env.API_BASE_URL || 'http://localhost:5000',
        description: 'Local Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        PackageInput: {
          type: 'object',
          required: ['name', 'slug', 'priceMonthly', 'priceYearly'],
          properties: {
            name: { type: 'string', example: 'Ultra 4K' },
            slug: { type: 'string', example: 'ultra-4k' },
            tagline: { type: 'string', example: 'Best cinematic experience in 4K HDR + Spatial Audio' },
            description: { type: 'string', example: 'Stream on 4 screens simultaneously with Dolby Vision & Atmos.' },
            priceMonthly: { type: 'integer', example: 186000 },
            priceYearly: { type: 'integer', example: 1860000 },
            currency: { type: 'string', example: 'IDR' },
            resolution: { type: 'string', example: '4K Ultra HD + HDR' },
            maxDevices: { type: 'integer', example: 4 },
            downloadsAllowed: { type: 'integer', example: 6 },
            adsFree: { type: 'boolean', example: true },
            tierLevel: { type: 'integer', example: 4 },
            features: {
              type: 'array',
              items: { type: 'string' },
              example: ['4K Ultra HD + HDR10', 'Watch on 4 devices', 'Spatial Audio', 'Zero Ads'],
            },
            isPopular: { type: 'boolean', example: true },
            isActive: { type: 'boolean', example: true },
          },
        },
        ContentInput: {
          type: 'object',
          required: ['title', 'slug', 'synopsis', 'releaseYear', 'posterUrl', 'backdropUrl'],
          properties: {
            title: { type: 'string', example: 'Jakarta Noir' },
            slug: { type: 'string', example: 'jakarta-noir' },
            synopsis: { type: 'string', example: 'In rain-drenched 2032 Jakarta, a rogue cyber-detective unravels a syndicate.' },
            type: { type: 'string', enum: ['movie', 'series'], example: 'series' },
            releaseYear: { type: 'integer', example: 2026 },
            durationMinutes: { type: 'integer', example: 54 },
            maturityRating: { type: 'string', example: '18+' },
            imdbRating: { type: 'number', example: 8.9 },
            genres: { type: 'array', items: { type: 'string' }, example: ['Thriller', 'Sci-Fi', 'Neo-Noir'] },
            cast: { type: 'array', items: { type: 'string' }, example: ['Reza Rahadian', 'Tara Basro'] },
            posterUrl: { type: 'string', example: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600' },
            backdropUrl: { type: 'string', example: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600' },
            trailerUrl: { type: 'string', example: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
            videoUrl: { type: 'string', example: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
            r2VideoKey: { type: 'string', example: 'videos/jakarta-noir-s1e1.mp4' },
            isFeatured: { type: 'boolean', example: true },
            isTrending: { type: 'boolean', example: true },
            isOriginal: { type: 'boolean', example: true },
            requiredPackageTier: { type: 'integer', example: 1 },
            categoryId: { type: 'string' },
          },
        },
      },
    },
  },
  apis: [path.join(__dirname, '../routers/*.js')],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerSpec };
