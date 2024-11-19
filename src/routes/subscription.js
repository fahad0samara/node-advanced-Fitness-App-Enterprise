const express = require('express');
const { authenticate } = require('../middleware/auth');
const SubscriptionController = require('../controllers/subscriptionController');
const { validateRequest } = require('../middleware/validation');
const { subscriptionValidation } = require('../validations/subscription.validation');

const router = express.Router();

router.get('/plans',
  SubscriptionController.getPlans
);

router.post('/subscribe',
  authenticate,
  validateRequest(subscriptionValidation.subscribe),
  SubscriptionController.subscribe
);

router.post('/cancel',
  authenticate,
  SubscriptionController.cancelSubscription
);

router.get('/status',
  authenticate,
  SubscriptionController.getSubscriptionStatus
);

module.exports = router;