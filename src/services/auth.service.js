const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const User = require('../models/user');

class AuthService {
  static generateToken(user) {
    return jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  }

  static async setup2FA(userId) {
    const secret = speakeasy.generateSecret();
    const user = await User.findById(userId);
    user.twoFactorSecret = secret.base32;
    await user.save();

    return QRCode.toDataURL(secret.otpauth_url);
  }

  static verify2FA(secret, token) {
    return speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: token
    });
  }
}

module.exports = AuthService;