const fs = require('fs');
const path = require('path');

const collection = {
  info: {
    _postman_id: 'flipss-id-api-collection-v1',
    name: 'Flipss.id Streaming API',
    description:
      'Complete Postman Collection for Flipss.id backend (Express, MySQL2, Sequelize, CORS *, Cloudflare R2, JWT Auth, Packages, Subscriptions, Contents, Watchlist).',
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
  },
  variable: [
    { key: 'baseUrl', value: 'http://localhost:5000', type: 'string' },
    { key: 'token', value: '', type: 'string' },
    { key: 'packageId', value: '', type: 'string' },
    { key: 'contentId', value: '', type: 'string' },
  ],
  item: [
    {
      name: 'Health & Docs',
      item: [
        {
          name: 'Health Check',
          request: {
            method: 'GET',
            header: [],
            url: { raw: '{{baseUrl}}/api/health', host: ['{{baseUrl}}'], path: ['api', 'health'] },
          },
        },
        {
          name: 'OpenAPI Swagger JSON',
          request: {
            method: 'GET',
            header: [],
            url: { raw: '{{baseUrl}}/api-docs.json', host: ['{{baseUrl}}'], path: ['api-docs.json'] },
          },
        },
      ],
    },
    {
      name: 'Auth',
      item: [
        {
          name: 'Register User',
          request: {
            method: 'POST',
            header: [{ key: 'Content-Type', value: 'application/json' }],
            body: {
              mode: 'raw',
              raw: JSON.stringify(
                { name: 'Budi Santoso', email: 'budi@flipss.id', password: 'password123' },
                null,
                2
              ),
            },
            url: { raw: '{{baseUrl}}/api/auth/register', host: ['{{baseUrl}}'], path: ['api', 'auth', 'register'] },
          },
        },
        {
          name: 'Login User (Auto-saves token)',
          event: [
            {
              listen: 'test',
              script: {
                type: 'text/javascript',
                exec: [
                  'const res = pm.response.json();',
                  'if (res.data && res.data.token) {',
                  '  pm.collectionVariables.set("token", res.data.token);',
                  '}',
                ],
              },
            },
          ],
          request: {
            method: 'POST',
            header: [{ key: 'Content-Type', value: 'application/json' }],
            body: {
              mode: 'raw',
              raw: JSON.stringify({ email: 'demo@flipss.id', password: 'demo1234' }, null, 2),
            },
            url: { raw: '{{baseUrl}}/api/auth/login', host: ['{{baseUrl}}'], path: ['api', 'auth', 'login'] },
          },
        },
        {
          name: 'Get Current Profile',
          request: {
            method: 'GET',
            header: [{ key: 'Authorization', value: 'Bearer {{token}}' }],
            url: { raw: '{{baseUrl}}/api/auth/me', host: ['{{baseUrl}}'], path: ['api', 'auth', 'me'] },
          },
        },
      ],
    },
    {
      name: 'Packages & Subscriptions',
      item: [
        {
          name: 'List All Packages',
          request: {
            method: 'GET',
            header: [],
            url: { raw: '{{baseUrl}}/api/packages', host: ['{{baseUrl}}'], path: ['api', 'packages'] },
          },
        },
        {
          name: 'Get Package by Slug',
          request: {
            method: 'GET',
            header: [],
            url: {
              raw: '{{baseUrl}}/api/packages/ultra-4k',
              host: ['{{baseUrl}}'],
              path: ['api', 'packages', 'ultra-4k'],
            },
          },
        },
        {
          name: 'Create Package (Admin)',
          request: {
            method: 'POST',
            header: [
              { key: 'Content-Type', value: 'application/json' },
              { key: 'Authorization', value: 'Bearer {{token}}' },
            ],
            body: {
              mode: 'raw',
              raw: JSON.stringify(
                {
                  name: 'Family Max 4K',
                  slug: 'family-max-4k',
                  tagline: 'Up to 6 profiles & 4K HDR Dolby Vision',
                  priceMonthly: 229000,
                  priceYearly: 2290000,
                  resolution: '4K Ultra HD + HDR',
                  maxDevices: 6,
                  downloadsAllowed: 10,
                  tierLevel: 5,
                  features: ['4K Ultra HD', '6 Devices', 'Spatial Audio', 'Zero Ads'],
                },
                null,
                2
              ),
            },
            url: { raw: '{{baseUrl}}/api/packages', host: ['{{baseUrl}}'], path: ['api', 'packages'] },
          },
        },
        {
          name: 'Subscribe to Package',
          request: {
            method: 'POST',
            header: [
              { key: 'Content-Type', value: 'application/json' },
              { key: 'Authorization', value: 'Bearer {{token}}' },
            ],
            body: {
              mode: 'raw',
              raw: JSON.stringify({ packageId: '{{packageId}}', billingCycle: 'monthly' }, null, 2),
            },
            url: { raw: '{{baseUrl}}/api/subscriptions', host: ['{{baseUrl}}'], path: ['api', 'subscriptions'] },
          },
        },
        {
          name: 'Get My Active Subscription',
          request: {
            method: 'GET',
            header: [{ key: 'Authorization', value: 'Bearer {{token}}' }],
            url: {
              raw: '{{baseUrl}}/api/subscriptions/me',
              host: ['{{baseUrl}}'],
              path: ['api', 'subscriptions', 'me'],
            },
          },
        },
        {
          name: 'Cancel Subscription',
          request: {
            method: 'POST',
            header: [{ key: 'Authorization', value: 'Bearer {{token}}' }],
            url: {
              raw: '{{baseUrl}}/api/subscriptions/cancel',
              host: ['{{baseUrl}}'],
              path: ['api', 'subscriptions', 'cancel'],
            },
          },
        },
      ],
    },
    {
      name: 'Categories & Contents',
      item: [
        {
          name: 'List Categories',
          request: {
            method: 'GET',
            header: [],
            url: { raw: '{{baseUrl}}/api/categories', host: ['{{baseUrl}}'], path: ['api', 'categories'] },
          },
        },
        {
          name: 'List Contents (Filterable)',
          request: {
            method: 'GET',
            header: [],
            url: {
              raw: '{{baseUrl}}/api/contents?page=1&limit=20&trending=true',
              host: ['{{baseUrl}}'],
              path: ['api', 'contents'],
              query: [
                { key: 'page', value: '1' },
                { key: 'limit', value: '20' },
                { key: 'trending', value: 'true' },
              ],
            },
          },
        },
        {
          name: 'Get Content by Slug',
          request: {
            method: 'GET',
            header: [],
            url: {
              raw: '{{baseUrl}}/api/contents/jakarta-noir-2034',
              host: ['{{baseUrl}}'],
              path: ['api', 'contents', 'jakarta-noir-2034'],
            },
          },
        },
        {
          name: 'Create Content (Admin)',
          request: {
            method: 'POST',
            header: [
              { key: 'Content-Type', value: 'application/json' },
              { key: 'Authorization', value: 'Bearer {{token}}' },
            ],
            body: {
              mode: 'raw',
              raw: JSON.stringify(
                {
                  title: 'Neon Batavia',
                  slug: 'neon-batavia',
                  synopsis: 'A futuristic heist across Old Town Jakarta.',
                  type: 'movie',
                  releaseYear: 2026,
                  durationMinutes: 118,
                  maturityRating: '16+',
                  imdbRating: 8.6,
                  genres: ['Action', 'Sci-Fi'],
                  cast: ['Chicco Jerikho', 'Putri Marino'],
                  posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600',
                  backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600',
                  isFeatured: true,
                  isTrending: true,
                  isOriginal: true,
                },
                null,
                2
              ),
            },
            url: { raw: '{{baseUrl}}/api/contents', host: ['{{baseUrl}}'], path: ['api', 'contents'] },
          },
        },
      ],
    },
    {
      name: 'Watchlist (My List)',
      item: [
        {
          name: 'Get My Watchlist',
          request: {
            method: 'GET',
            header: [{ key: 'Authorization', value: 'Bearer {{token}}' }],
            url: { raw: '{{baseUrl}}/api/watchlist', host: ['{{baseUrl}}'], path: ['api', 'watchlist'] },
          },
        },
        {
          name: 'Add to Watchlist',
          request: {
            method: 'POST',
            header: [
              { key: 'Content-Type', value: 'application/json' },
              { key: 'Authorization', value: 'Bearer {{token}}' },
            ],
            body: {
              mode: 'raw',
              raw: JSON.stringify({ contentId: '{{contentId}}' }, null, 2),
            },
            url: { raw: '{{baseUrl}}/api/watchlist', host: ['{{baseUrl}}'], path: ['api', 'watchlist'] },
          },
        },
        {
          name: 'Update Watch Progress',
          request: {
            method: 'PATCH',
            header: [
              { key: 'Content-Type', value: 'application/json' },
              { key: 'Authorization', value: 'Bearer {{token}}' },
            ],
            body: {
              mode: 'raw',
              raw: JSON.stringify({ progressSeconds: 920 }, null, 2),
            },
            url: {
              raw: '{{baseUrl}}/api/watchlist/{{contentId}}/progress',
              host: ['{{baseUrl}}'],
              path: ['api', 'watchlist', '{{contentId}}', 'progress'],
            },
          },
        },
        {
          name: 'Remove from Watchlist',
          request: {
            method: 'DELETE',
            header: [{ key: 'Authorization', value: 'Bearer {{token}}' }],
            url: {
              raw: '{{baseUrl}}/api/watchlist/{{contentId}}',
              host: ['{{baseUrl}}'],
              path: ['api', 'watchlist', '{{contentId}}'],
            },
          },
        },
      ],
    },
    {
      name: 'Cloudflare R2 Storage',
      item: [
        {
          name: 'Upload Poster / Media to R2 (Admin)',
          request: {
            method: 'POST',
            header: [{ key: 'Authorization', value: 'Bearer {{token}}' }],
            body: {
              mode: 'formdata',
              formdata: [
                { key: 'file', type: 'file', src: '' },
                { key: 'folder', value: 'posters', type: 'text' },
              ],
            },
            url: {
              raw: '{{baseUrl}}/api/storage/upload',
              host: ['{{baseUrl}}'],
              path: ['api', 'storage', 'upload'],
            },
          },
        },
        {
          name: 'Generate Presigned Video Upload URL (Admin)',
          request: {
            method: 'POST',
            header: [
              { key: 'Content-Type', value: 'application/json' },
              { key: 'Authorization', value: 'Bearer {{token}}' },
            ],
            body: {
              mode: 'raw',
              raw: JSON.stringify(
                { fileName: 'jakarta-noir-4k.mp4', contentType: 'video/mp4', folder: 'videos' },
                null,
                2
              ),
            },
            url: {
              raw: '{{baseUrl}}/api/storage/presign-upload',
              host: ['{{baseUrl}}'],
              path: ['api', 'storage', 'presign-upload'],
            },
          },
        },
        {
          name: 'Generate Presigned Stream URL',
          request: {
            method: 'GET',
            header: [{ key: 'Authorization', value: 'Bearer {{token}}' }],
            url: {
              raw: '{{baseUrl}}/api/storage/presign-stream?key=videos/jakarta-noir-4k.mp4',
              host: ['{{baseUrl}}'],
              path: ['api', 'storage', 'presign-stream'],
              query: [{ key: 'key', value: 'videos/jakarta-noir-4k.mp4' }],
            },
          },
        },
        {
          name: 'Delete Object from R2 (Admin)',
          request: {
            method: 'DELETE',
            header: [
              { key: 'Content-Type', value: 'application/json' },
              { key: 'Authorization', value: 'Bearer {{token}}' },
            ],
            body: {
              mode: 'raw',
              raw: JSON.stringify({ key: 'posters/example.jpg' }, null, 2),
            },
            url: {
              raw: '{{baseUrl}}/api/storage/delete',
              host: ['{{baseUrl}}'],
              path: ['api', 'storage', 'delete'],
            },
          },
        },
      ],
    },
  ],
};

const docsDir = path.join(__dirname, '../../docs');
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}
const outPath = path.join(docsDir, 'flips_api.postman_collection.json');
fs.writeFileSync(outPath, JSON.stringify(collection, null, 2), 'utf8');
console.log(`[postman] Collection written to ${outPath}`);
