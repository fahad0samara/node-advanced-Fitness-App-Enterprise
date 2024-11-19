const { body } = require('express-validator');
const { plans } = require('../config/subscriptionPlans');

const subscriptionValidation = {
  subscribe: [
    body('planId')
      .isString()
      .custom(value => {
        if (!Object.values(plans).some(plan => plan.id === value)) {
          throw new Error('Invalid plan selected');
        }
        return true;
      })
  ]
};

module.exports = { subscriptionValidation };