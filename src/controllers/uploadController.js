const {
  uploadToR2,
  createPresignedUploadUrl,
  createPresignedStreamUrl,
  deleteFromR2,
  isR2Configured,
} = require('../utils/r2Storage');
const { sendSuccess, sendError } = require('../utils/response');

const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return sendError(res, 'No file uploaded. Use form-data field "file".', 400);
    }
    if (!isR2Configured()) {
      return sendError(
        res,
        'Cloudflare R2 credentials are not configured in .env',
        503
      );
    }

    const folder = req.body.folder || 'posters';
    const result = await uploadToR2({
      buffer: req.file.buffer,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      folder,
    });

    return sendSuccess(res, result, 'File uploaded to Cloudflare R2', 201);
  } catch (err) {
    return sendError(res, err.message || 'Upload failed', 500);
  }
};

const getPresignedUpload = async (req, res) => {
  try {
    const { fileName, contentType = 'video/mp4', folder = 'videos' } = req.body;
    if (!fileName) {
      return sendError(res, 'fileName is required', 400);
    }
    if (!isR2Configured()) {
      return sendError(
        res,
        'Cloudflare R2 credentials are not configured in .env',
        503
      );
    }

    const result = await createPresignedUploadUrl({ fileName, contentType, folder });
    return sendSuccess(res, result, 'Presigned R2 upload URL generated');
  } catch (err) {
    return sendError(res, err.message || 'Failed to generate upload URL', 500);
  }
};

const getPresignedStream = async (req, res) => {
  try {
    const { key } = req.query;
    if (!key) {
      return sendError(res, 'Query parameter "key" is required', 400);
    }
    if (!isR2Configured()) {
      return sendError(
        res,
        'Cloudflare R2 credentials are not configured in .env',
        503
      );
    }

    const result = await createPresignedStreamUrl({ key: String(key) });
    return sendSuccess(res, result, 'Presigned R2 stream URL generated');
  } catch (err) {
    return sendError(res, err.message || 'Failed to generate stream URL', 500);
  }
};

const deleteMedia = async (req, res) => {
  try {
    const { key } = req.body;
    if (!key) {
      return sendError(res, 'Object key is required', 400);
    }
    if (!isR2Configured()) {
      return sendError(
        res,
        'Cloudflare R2 credentials are not configured in .env',
        503
      );
    }

    const result = await deleteFromR2(key);
    return sendSuccess(res, result, 'Object deleted from Cloudflare R2');
  } catch (err) {
    return sendError(res, err.message || 'Failed to delete object', 500);
  }
};

module.exports = {
  uploadMedia,
  getPresignedUpload,
  getPresignedStream,
  deleteMedia,
};
