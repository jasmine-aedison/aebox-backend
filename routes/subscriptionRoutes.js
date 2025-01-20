// subscriptionRoutes.js
const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');

// Subscription routes
router.get('/:userId', subscriptionController.getSubscription);  // Get user subscription
router.put('/:userId', subscriptionController.updateSubscription);  // Update user subscription

module.exports = router;