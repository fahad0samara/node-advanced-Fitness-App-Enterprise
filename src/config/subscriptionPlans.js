const plans = {
  BASIC: {
    id: 'price_basic',
    name: 'Basic Plan',
    price: 5,
    features: [
      'Basic workout tracking',
      'Standard exercises library',
      'Basic progress tracking'
    ],
    role: 'user'
  },
  STANDARD: {
    id: 'price_standard',
    name: 'Standard Plan',
    price: 10,
    features: [
      'Advanced workout tracking',
      'Custom exercise creation',
      'Progress analytics',
      'Workout sharing'
    ],
    role: 'user'
  },
  PREMIUM: {
    id: 'price_premium',
    name: 'Premium Plan',
    price: 20,
    features: [
      'AI workout recommendations',
      'Priority support',
      'Advanced analytics',
      'Personal trainer access',
      'Nutrition tracking'
    ],
    role: 'pro'
  }
};

module.exports = { plans };