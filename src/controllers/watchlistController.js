const { Watchlist, Content } = require('../models');
const { sendSuccess, sendError } = require('../utils/response');

const getMyWatchlist = async (req, res) => {
  try {
    const items = await Watchlist.findAll({
      where: { userId: req.user.id },
      include: [{ model: Content, as: 'content' }],
      order: [['updatedAt', 'DESC']],
    });
    return sendSuccess(res, items, 'Watchlist retrieved');
  } catch (err) {
    return sendError(res, err.message || 'Failed to retrieve watchlist', 500);
  }
};

const addToWatchlist = async (req, res) => {
  try {
    const { contentId } = req.body;
    if (!contentId) {
      return sendError(res, 'contentId is required', 400);
    }
    const content = await Content.findByPk(contentId);
    if (!content) {
      return sendError(res, 'Content not found', 404);
    }

    const [entry, created] = await Watchlist.findOrCreate({
      where: { userId: req.user.id, contentId },
      defaults: { progressSeconds: 0 },
    });

    return sendSuccess(
      res,
      entry,
      created ? 'Added to watchlist' : 'Already in watchlist',
      created ? 201 : 200
    );
  } catch (err) {
    return sendError(res, err.message || 'Failed to add to watchlist', 500);
  }
};

const updateProgress = async (req, res) => {
  try {
    const { contentId } = req.params;
    const { progressSeconds = 0 } = req.body;

    const [entry] = await Watchlist.findOrCreate({
      where: { userId: req.user.id, contentId },
      defaults: { progressSeconds },
    });
    await entry.update({ progressSeconds: Math.max(0, Number(progressSeconds) || 0) });

    return sendSuccess(res, entry, 'Watch progress updated');
  } catch (err) {
    return sendError(res, err.message || 'Failed to update watch progress', 500);
  }
};

const removeFromWatchlist = async (req, res) => {
  try {
    const { contentId } = req.params;
    const deleted = await Watchlist.destroy({
      where: { userId: req.user.id, contentId },
    });
    if (!deleted) {
      return sendError(res, 'Watchlist item not found', 404);
    }
    return sendSuccess(res, { contentId }, 'Removed from watchlist');
  } catch (err) {
    return sendError(res, err.message || 'Failed to remove from watchlist', 500);
  }
};

module.exports = {
  getMyWatchlist,
  addToWatchlist,
  updateProgress,
  removeFromWatchlist,
};
