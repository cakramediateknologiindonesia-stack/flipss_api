const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');

const apiRouter = require('./routers');
const { swaggerSpec } = require('./utils/swagger');
const { sendError } = require('./utils/response');

const app = express();

// CORS: Allow all origins (*)
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(morgan('dev'));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true }));

// Root welcome
app.get('/', (_req, res) => {
  res.json({
    success: true,
    name: 'Flipss.id API',
    version: '1.0.0',
    docs: '/api-docs',
    openapiJson: '/api-docs.json',
    health: '/api/health',
  });
});

// Swagger Documentation
app.get('/api-docs.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Flipss.id API Docs',
    customCss: '.swagger-ui .topbar { background-color: #141414; border-bottom: 2px solid #E50914; }',
  })
);

// REST API routes
app.use('/api', apiRouter);

// 404 handler
app.use((req, res) => {
  return sendError(res, `Route ${req.method} ${req.originalUrl} not found`, 404);
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('[flips_api error]', err);
  return sendError(res, err.message || 'Internal server error', err.status || 500);
});

module.exports = app;
