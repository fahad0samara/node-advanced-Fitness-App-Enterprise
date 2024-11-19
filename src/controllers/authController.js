const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/user');
const { AuthenticationError, ValidationError } = require('../common/errors/AppError');
const { roles } = require('../config/roles');
const AuthService = require('../services/auth.service');
const { redisClient } = require('../infrastructure/cache');

class AuthController {
  static async register(req, res) {
    const { email, password, username } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ValidationError('Email already registered');
    }

    const user = await User.create({
      email,
      password,
      username,
      role: roles.USER
    });

    const token = AuthService.generateToken(user);
    
    res.status(201).json({
      status: 'success',
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          role: user.role
        }
      }
    });
  }

  static async login(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      throw new AuthenticationError('Invalid credentials');
    }

    const token = AuthService.generateToken(user);

    // Store token in Redis for blacklisting support
    await redisClient.set(`auth:${token}`, 'valid', { EX: 24 * 60 * 60 });

    res.json({
      status: 'success',
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          role: user.role
        }
      }
    });
  }

  static async setup2FA(req, res) {
    const qrCode = await AuthService.setup2FA(req.user.id);
    res.json({
      status: 'success',
      data: { qrCode }
    });
  }

  static async verify2FA(req, res) {
    const { token } = req.body;
    const user = await User.findById(req.user.id);

    if (!AuthService.verify2FA(user.twoFactorSecret, token)) {
      throw new AuthenticationError('Invalid 2FA token');
    }

    user.twoFactorEnabled = true;
    await user.save();

    res.json({
      status: 'success',
      message: '2FA enabled successfully'
    });
  }

  static async logout(req, res) {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      // Blacklist the token
      await redisClient.set(`auth:blacklist:${token}`, 'blacklisted', {
        EX: 24 * 60 * 60
      });
    }

    res.json({
      status: 'success',
      message: 'Logged out successfully'
    });
  }
}

module.exports = AuthController;