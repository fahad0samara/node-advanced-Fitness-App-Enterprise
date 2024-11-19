const { body } = require('express-validator');

const authValidation = {
  register: [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])/)
      .withMessage('Password must include one lowercase letter, one uppercase letter, one number, and one special character'),
    body('username')
      .isLength({ min: 3 })
      .withMessage('Username must be at least 3 characters long')
      .matches(/^[a-zA-Z0-9_-]+$/)
      .withMessage('Username can only contain letters, numbers, underscores, and hyphens')
  ],
  login: [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],
  verify2FA: [
    body('token')
      .isLength({ min: 6, max: 6 })
      .isNumeric()
      .withMessage('Invalid 2FA token')
  ]
};

module.exports = { authValidation };