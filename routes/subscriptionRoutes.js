const express = require("express");
const router = express.Router();
const subscriptionController = require("../controllers/subscriptionController");

// Subscription Routes
router.post("/:username", subscriptionController.createSubscription);  // Create subscription
router.get("/:username", subscriptionController.getSubscription);  // Get user subscription
router.get("/", subscriptionController.getAllSubscriptions);  // Get all subscriptions (admin)
router.put("/:username", subscriptionController.updateSubscription);  // Update user subscription
router.delete("/:username", subscriptionController.deleteSubscription);  // Delete subscription
router.get("/:username/payments", subscriptionController.getPaymentHistory);  // Get payment history

// Stripe Webhook
router.post("/webhook", express.raw({ type: "application/json" }), subscriptionController.handleStripeWebhook);
router.post('/checkout', subscriptionController.checkout);

module.exports = router;
