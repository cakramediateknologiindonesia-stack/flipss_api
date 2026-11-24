const { Op } = require('sequelize');
const { Package } = require('../models');
const { sendSuccess, sendError } = require('../utils/response');

const listPackages = async (req, res) => {
  try {
    const includeInactive = req.query.includeInactive === 'true';
    const where = includeInactive ? {} : { isActive: true };
    const packages = await Package.findAll({
      where,
      order: [['tierLevel', 'ASC'], ['priceMonthly', 'ASC']],
    });
    return sendSuccess(res, packages, 'Packages retrieved');
  } catch (err) {
    return sendError(res, err.message || 'Failed to retrieve packages', 500);
  }
};

const getPackage = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const pkg = await Package.findOne({
      where: {
        [Op.or]: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
    });
    if (!pkg) {
      return sendError(res, 'Package not found', 404);
    }
    return sendSuccess(res, pkg, 'Package retrieved');
  } catch (err) {
    return sendError(res, err.message || 'Failed to retrieve package', 500);
  }
};

const createPackage = async (req, res) => {
  try {
    const pkg = await Package.create(req.body);
    return sendSuccess(res, pkg, 'Package created', 201);
  } catch (err) {
    return sendError(res, err.message || 'Failed to create package', 400);
  }
};

const updatePackage = async (req, res) => {
  try {
    const pkg = await Package.findByPk(req.params.id);
    if (!pkg) {
      return sendError(res, 'Package not found', 404);
    }
    await pkg.update(req.body);
    return sendSuccess(res, pkg, 'Package updated');
  } catch (err) {
    return sendError(res, err.message || 'Failed to update package', 400);
  }
};

const deletePackage = async (req, res) => {
  try {
    const pkg = await Package.findByPk(req.params.id);
    if (!pkg) {
      return sendError(res, 'Package not found', 404);
    }
    await pkg.destroy();
    return sendSuccess(res, { id: req.params.id }, 'Package deleted');
  } catch (err) {
    return sendError(res, err.message || 'Failed to delete package', 500);
  }
};

module.exports = {
  listPackages,
  getPackage,
  createPackage,
  updatePackage,
  deletePackage,
};
