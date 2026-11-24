const { Category } = require('../models');
const { sendSuccess, sendError } = require('../utils/response');

const listCategories = async (_req, res) => {
  try {
    const categories = await Category.findAll({ order: [['name', 'ASC']] });
    return sendSuccess(res, categories, 'Categories retrieved');
  } catch (err) {
    return sendError(res, err.message || 'Failed to fetch categories', 500);
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, slug, description } = req.body;
    if (!name || !slug) {
      return sendError(res, 'name and slug are required', 400);
    }
    const category = await Category.create({ name, slug, description });
    return sendSuccess(res, category, 'Category created', 201);
  } catch (err) {
    return sendError(res, err.message || 'Failed to create category', 400);
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return sendError(res, 'Category not found', 404);
    }
    await category.destroy();
    return sendSuccess(res, { id: req.params.id }, 'Category deleted');
  } catch (err) {
    return sendError(res, err.message || 'Failed to delete category', 500);
  }
};

module.exports = { listCategories, createCategory, deleteCategory };
