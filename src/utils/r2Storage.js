const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || '';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || '';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || '';
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'flipss-media';
const R2_PUBLIC_URL = (process.env.R2_PUBLIC_URL || '').replace(/\/$/, '');

const isR2Configured = () =>
  Boolean(R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_BUCKET_NAME);

let r2Client = null;

const getR2Client = () => {
  if (!isR2Configured()) {
    throw new Error(
      'Cloudflare R2 is not configured. Please set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_BUCKET_NAME in .env'
    );
  }
  if (!r2Client) {
    r2Client = new S3Client({
      region: 'auto',
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    });
  }
  return r2Client;
};

/**
 * Upload a file buffer to Cloudflare R2
 * @param {object} params
 * @param {Buffer} params.buffer
 * @param {string} params.originalName
 * @param {string} params.mimeType
 * @param {string} [params.folder='media']
 */
const uploadToR2 = async ({ buffer, originalName, mimeType, folder = 'media' }) => {
  const client = getR2Client();
  const ext = path.extname(originalName || '') || '';
  const key = `${folder}/${uuidv4()}${ext}`;

  await client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: mimeType || 'application/octet-stream',
    })
  );

  const url = R2_PUBLIC_URL
    ? `${R2_PUBLIC_URL}/${key}`
    : `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET_NAME}/${key}`;

  return {
    key,
    bucket: R2_BUCKET_NAME,
    url,
    contentType: mimeType,
  };
};

/**
 * Generate a presigned PUT URL for direct client uploads (e.g. large videos) to Cloudflare R2
 */
const createPresignedUploadUrl = async ({ fileName, contentType, folder = 'videos', expiresIn = 3600 }) => {
  const client = getR2Client();
  const ext = path.extname(fileName || '') || '';
  const key = `${folder}/${uuidv4()}${ext}`;

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    ContentType: contentType || 'video/mp4',
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn });
  const publicUrl = R2_PUBLIC_URL
    ? `${R2_PUBLIC_URL}/${key}`
    : `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET_NAME}/${key}`;

  return { key, uploadUrl, publicUrl, expiresIn };
};

/**
 * Generate a presigned GET URL for private streaming playback from Cloudflare R2
 */
const createPresignedStreamUrl = async ({ key, expiresIn = 7200 }) => {
  const client = getR2Client();
  const command = new GetObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
  });
  const streamUrl = await getSignedUrl(client, command, { expiresIn });
  return { key, streamUrl, expiresIn };
};

/**
 * Delete an object from Cloudflare R2
 */
const deleteFromR2 = async (key) => {
  const client = getR2Client();
  await client.send(
    new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    })
  );
  return { deleted: true, key };
};

module.exports = {
  isR2Configured,
  getR2Client,
  uploadToR2,
  createPresignedUploadUrl,
  createPresignedStreamUrl,
  deleteFromR2,
};
