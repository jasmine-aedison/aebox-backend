const express = require("express");
const router = express.Router();
const subscriptionController = require("../controllers/subscriptionController");
// Stripe Webhook
router.post("/webhook", express.raw({ type: "application/json" }), subscriptionController.handleStripeWebhook);
router.post('/checkout', subscriptionController.checkout);
router.get("/status", (req, res, next) => {
    console.log("==== ROUTE DEBUGGER: /status endpoint hit ====");
    console.log("Request query:", req.query);
    next(); // Continue to the actual controller
  }, subscriptionController.checkSubscriptionStatus);
// Subscription Routes
router.post("/:username", subscriptionController.createSubscription);  // Create subscription
router.get("/:username", subscriptionController.getSubscription);  // Get user subscription
router.get("/", subscriptionController.getAllSubscriptions);  // Get all subscriptions (admin)
router.put("/:username", subscriptionController.createOrUpdateSubscription);  // Update user subscription
router.delete("/:username", subscriptionController.deleteSubscription);  // Delete subscription
router.get("/:username/payments", subscriptionController.getPaymentHistory);  // Get payment history
// router.get("/status", subscriptionController.checkSubscriptionStatus); // NEW ENDPOINT


module.exports = router;
