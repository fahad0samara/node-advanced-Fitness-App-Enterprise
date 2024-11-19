const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/user');

class SubscriptionService {
  static async createSubscription(userId, planId) {
    const user = await User.findById(userId);
    
    if (!user.stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email
      });
      user.subscription.stripeCustomerId = customer.id;
      await user.save();
    }

    const subscription = await stripe.subscriptions.create({
      customer: user.subscription.stripeCustomerId,
      items: [{ price: planId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent']
    });

    return subscription;
  }

  static async cancelSubscription(userId) {
    const user = await User.findById(userId);
    if (!user.subscription.stripeCustomerId) {
      throw new Error('No active subscription found');
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: user.subscription.stripeCustomerId
    });

    for (const subscription of subscriptions.data) {
      await stripe.subscriptions.del(subscription.id);
    }

    user.subscription.plan = 'free';
    await user.save();
  }
}

module.exports = SubscriptionService;