# Flipss.id Backend API (`flips_api`)

RESTful backend for **Flipss.id** built with **Express.js**, **MySQL2**, **Sequelize**, **CORS (`*`)**, **Cloudflare R2 Storage**, **Swagger OpenAPI**, and a ready-to-import **Postman Collection**.

## Structure

```
flips_api/
├── docs/
│   └── flips_api.postman_collection.json
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routers/
│   ├── utils/
│   ├── app.js
│   └── server.js
├── .env.example
└── package.json
```

## Quick Start

1. Copy `.env.example` to `.env` and fill in your MySQL and Cloudflare R2 credentials.
2. Create the MySQL database `flips_db`.
3. Install dependencies & seed sample data:
   ```bash
   npm install
   npm run seed
   ```
4. Start the server:
   ```bash
   npm run dev
   ```
5. Open Swagger UI at `http://localhost:5000/api-docs` or import `docs/flips_api.postman_collection.json` into Postman.
