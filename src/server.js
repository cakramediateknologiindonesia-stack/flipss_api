require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = Number(process.env.PORT) || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('[flips_api] MySQL connection established via Sequelize.');
    await sequelize.sync({ alter: false });
    console.log('[flips_api] Database models synchronized.');
  } catch (err) {
    console.warn(
      '[flips_api] Warning: Could not connect to MySQL at startup. API server will still start (configure .env & MySQL for DB routes):',
      err.message
    );
  }

  app.listen(PORT, () => {
    console.log(`[flips_api] Server running at http://localhost:${PORT}`);
    console.log(`[flips_api] Swagger UI available at http://localhost:${PORT}/api-docs`);
  });
};

startServer();
