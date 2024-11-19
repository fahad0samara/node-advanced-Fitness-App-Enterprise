const SubscriptionService = require('../services/subscription.service');
const User = require('../models/user');
const { plans } = require('../config/subscriptionPlans');
const { ValidationError } = require('../common/errors/AppError');

class SubscriptionController {
  static async getPlans(req, res) {
    res.json({
      status: 'success',
      data: { plans }
    });
  }

  static async subscribe(req, res) {
    const { planId } = req.body;
    const userId = req.user.id;

    const plan = Object.values(plans).find(p => p.id === planId);
    if (!plan) {
      throw new ValidationError('Invalid plan selected');
    }

    const subscription = await SubscriptionService.createSubscription(userId, planId);

    res.json({
      status: 'success',
      data: {
        clientSecret: subscription.latest_invoice.payment_intent.client_secret,
        subscriptionId: subscription.id
      }
    });
  }

  static async cancelSubscription(req, res) {
    const userId = req.user.id;
    await SubscriptionService.cancelSubscription(userId);

    res.json({
      status: 'success',
      message: 'Subscription cancelled successfully'
    });
  }

  static async getSubscriptionStatus(req, res) {
    const user = await User.findById(req.user.id);
    
    res.json({
      status: 'success',
      data: {
        currentPlan: user.subscription.plan,
        validUntil: user.subscription.validUntil
      }
    });
  }
}

module.exports = SubscriptionController;