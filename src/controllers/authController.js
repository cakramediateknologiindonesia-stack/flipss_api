const bcrypt = require('bcryptjs');
const { User, Subscription, Package } = require('../models');
const { signToken } = require('../utils/jwt');
const { sendSuccess, sendError } = require('../utils/response');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return sendError(res, 'Name, email, and password are required', 400);
    }
    if (password.length < 6) {
      return sendError(res, 'Password must be at least 6 characters', 400);
    }

    const existing = await User.findOne({ where: { email: email.toLowerCase() } });
    if (existing) {
      return sendError(res, 'Email is already registered', 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: 'user',
    });

    const token = signToken({ id: user.id, email: user.email, role: user.role });

    return sendSuccess(
      res,
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
          role: user.role,
        },
        token,
      },
      'Account registered successfully',
      201
    );
  } catch (err) {
    return sendError(res, err.message || 'Failed to register user', 500);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendError(res, 'Email and password are required', 400);
    }

    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    if (!user) {
      return sendError(res, 'Invalid email or password', 401);
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return sendError(res, 'Invalid email or password', 401);
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role });

    const activeSubscription = await Subscription.findOne({
      where: { userId: user.id, status: 'active' },
      include: [{ model: Package, as: 'package' }],
      order: [['createdAt', 'DESC']],
    });

    return sendSuccess(
      res,
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
          role: user.role,
          activeSubscription,
        },
        token,
      },
      'Login successful'
    );
  } catch (err) {
    return sendError(res, err.message || 'Failed to login', 500);
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'avatarUrl', 'role', 'createdAt'],
      include: [
        {
          model: Subscription,
          as: 'subscriptions',
          where: { status: 'active' },
          required: false,
          include: [{ model: Package, as: 'package' }],
        },
      ],
    });
    if (!user) {
      return sendError(res, 'User not found', 404);
    }
    return sendSuccess(res, user, 'Profile fetched');
  } catch (err) {
    return sendError(res, err.message || 'Failed to fetch profile', 500);
  }
};

module.exports = { register, login, getProfile };
