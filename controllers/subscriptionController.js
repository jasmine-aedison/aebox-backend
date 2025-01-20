// subscriptionController.js
const { Subscription } = require('../models'); // Assuming you have a subscription model

// Get a user's subscription
exports.getSubscription = async (req, res) => {
  const { userId } = req.params;
  try {
    const subscription = await Subscription.findOne({ where: { userId } });
    if (subscription) {
      res.status(200).json(subscription);
    } else {
      res.status(404).json({ message: 'Subscription not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving subscription', error });
  }
};

// Update a user's subscription
exports.updateSubscription = async (req, res) => {
  const { userId } = req.params;
  const { plan, expiryDate } = req.body;
  try {
    const subscription = await Subscription.findOne({ where: { userId } });
    if (subscription) {
      subscription.plan = plan || subscription.plan;
      subscription.expiryDate = expiryDate || subscription.expiryDate;
      await subscription.save();
      res.status(200).json(subscription);
    } else {
      res.status(404).json({ message: 'Subscription not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating subscription', error });
  }
};
