const express = require('express');
const { authenticate } = require('../middleware/auth');
const AuthController = require('../controllers/authController');
const { validateRequest } = require('../middleware/validation');
const { authValidation } = require('../validations/auth.validation');

const router = express.Router();

router.post('/register', 
  validateRequest(authValidation.register),
  AuthController.register
);

router.post('/login',
  validateRequest(authValidation.login),
  AuthController.login
);

router.post('/logout',
  authenticate,
  AuthController.logout
);

router.post('/2fa/setup',
  authenticate,
  AuthController.setup2FA
);

router.post('/2fa/verify',
  authenticate,
  validateRequest(authValidation.verify2FA),
  AuthController.verify2FA
);

module.exports = router;