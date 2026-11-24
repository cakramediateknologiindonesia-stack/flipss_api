const { Op } = require('sequelize');
const { Content, Category, Episode } = require('../models');
const { sendSuccess, sendError } = require('../utils/response');
const { createPresignedStreamUrl, isR2Configured } = require('../utils/r2Storage');

const listContents = async (req, res) => {
  try {
    const {
      type,
      category,
      search,
      featured,
      trending,
      original,
      page = 1,
      limit = 20,
    } = req.query;

    const where = {};
    if (type && ['movie', 'series'].includes(type)) where.type = type;
    if (featured === 'true') where.isFeatured = true;
    if (trending === 'true') where.isTrending = true;
    if (original === 'true') where.isOriginal = true;
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { synopsis: { [Op.like]: `%${search}%` } },
      ];
    }

    const include = [
      {
        model: Category,
        as: 'category',
        ...(category ? { where: { slug: category } } : {}),
      },
    ];

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(100, Math.max(1, Number(limit) || 20));
    const offset = (pageNum - 1) * limitNum;

    const { rows, count } = await Content.findAndCountAll({
      where,
      include,
      limit: limitNum,
      offset,
      order: [
        ['isFeatured', 'DESC'],
        ['isTrending', 'DESC'],
        ['releaseYear', 'DESC'],
      ],
    });

    return sendSuccess(res, rows, 'Contents retrieved', 200, {
      page: pageNum,
      limit: limitNum,
      total: count,
      totalPages: Math.ceil(count / limitNum),
    });
  } catch (err) {
    return sendError(res, err.message || 'Failed to retrieve contents', 500);
  }
};

const getContent = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const content = await Content.findOne({
      where: {
        [Op.or]: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: [
        { model: Category, as: 'category' },
        {
          model: Episode,
          as: 'episodes',
          separate: true,
          order: [
            ['seasonNumber', 'ASC'],
            ['episodeNumber', 'ASC'],
          ],
        },
      ],
    });

    if (!content) {
      return sendError(res, 'Content not found', 404);
    }

    const data = content.toJSON();
    if (data.r2VideoKey && isR2Configured()) {
      try {
        const signed = await createPresignedStreamUrl({ key: data.r2VideoKey });
        data.signedStreamUrl = signed.streamUrl;
      } catch (_err) {
        // Fallback to public videoUrl if R2 signing fails
      }
    }

    return sendSuccess(res, data, 'Content retrieved');
  } catch (err) {
    return sendError(res, err.message || 'Failed to retrieve content', 500);
  }
};

const createContent = async (req, res) => {
  try {
    const content = await Content.create(req.body);
    return sendSuccess(res, content, 'Content created', 201);
  } catch (err) {
    return sendError(res, err.message || 'Failed to create content', 400);
  }
};

const updateContent = async (req, res) => {
  try {
    const content = await Content.findByPk(req.params.id);
    if (!content) {
      return sendError(res, 'Content not found', 404);
    }
    await content.update(req.body);
    return sendSuccess(res, content, 'Content updated');
  } catch (err) {
    return sendError(res, err.message || 'Failed to update content', 400);
  }
};

const deleteContent = async (req, res) => {
  try {
    const content = await Content.findByPk(req.params.id);
    if (!content) {
      return sendError(res, 'Content not found', 404);
    }
    await content.destroy();
    return sendSuccess(res, { id: req.params.id }, 'Content deleted');
  } catch (err) {
    return sendError(res, err.message || 'Failed to delete content', 500);
  }
};

const addEpisode = async (req, res) => {
  try {
    const content = await Content.findByPk(req.params.id);
    if (!content) {
      return sendError(res, 'Content not found', 404);
    }
    const episode = await Episode.create({
      ...req.body,
      contentId: content.id,
    });
    return sendSuccess(res, episode, 'Episode added', 201);
  } catch (err) {
    return sendError(res, err.message || 'Failed to add episode', 400);
  }
};

module.exports = {
  listContents,
  getContent,
  createContent,
  updateContent,
  deleteContent,
  addEpisode,
};
