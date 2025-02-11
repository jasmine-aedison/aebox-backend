const { Subscription, PaymentHistory } = require('../models/index');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create a new subscription
exports.createSubscription = async (req, res) => {
  try {
    const { username, subscription_type, subscription_status, start_date, expiry_date } = req.body;
    const newSubscription = await Subscription.create({
      username,
      subscription_type,
      subscription_status,
      start_date,
      expiry_date,
    });
    res.status(201).json(newSubscription);
  } catch (error) {
    res.status(400).json({ message: "Failed to create subscription", error: error.message });
  }
};

exports.getSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.getByUsername(req.params.username);
    res.status(200).json(subscription);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
// Get all subscriptions (for admin)
exports.getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.getAll();
    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching subscriptions", error: error.message });
  }
};

// Update subscription status, type, or expiry date
exports.updateSubscription = async (req, res) => {
  try {
    const { subscription_status, subscription_type, expiry_date } = req.body;
    const updates = {};

    if (subscription_status) updates.subscription_status = subscription_status;
    if (subscription_type) updates.subscription_type = subscription_type;
    if (expiry_date) updates.expiry_date = expiry_date;

    const updatedSubscription = await Subscription.updateSubscription(req.params.username, updates);
    if (!updatedSubscription.length) return res.status(404).json({ message: "Subscription not found" });
    res.status(200).json(updatedSubscription[0]);
  } catch (error) {
    res.status(400).json({ message: "Failed to update subscription", error: error.message });
  }
};

// Get payment history
exports.getPaymentHistory = async (req, res) => {
  try {
    const { username } = req.params;
    const paymentHistory = await PaymentHistory.getByUsername(username);
    res.status(200).json(paymentHistory);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving payment history", error: error.message });
  }
};

// Delete a subscription
exports.deleteSubscription = async (req, res) => {
  try {
    const deletedSubscription = await Subscription.deleteByUsername(req.params.username);
    if (!deletedSubscription.length) return res.status(404).json({ message: "Subscription not found" });
    res.status(200).json({ message: "Subscription deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete subscription", error: error.message });
  }
};
// Handle Stripe Webhook Events
exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  try {
    const event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
    const eventData = event.data.object;
    const userId = eventData.metadata?.userId;

    if (!userId) {
      return res.status(400).json({ message: "Missing userId in webhook metadata" });
    }

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await Subscription.upsert({
          username,
          subscription_type: eventData.plan?.nickname || "Unknown",
          status: eventData.status,
          start_date: eventData.start_date ? new Date(eventData.start_date * 1000) : new Date(),
          expiry_date: new Date(eventData.expiry_date * 1000),
        });
        break;

      case "customer.subscription.deleted":
        await Subscription.deleteByUsername(username);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Error handling Stripe webhook:", error);
    res.status(400).json({ message: "Webhook error", error: error.message });
  }
};


exports.checkout = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  const { username , subscriptionType } = req.body
  console.log(username, subscriptionType, "inside the subscriiption controller")
  if (!username) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price:
            subscriptionType === "monthly"
              ? "price_1Qr940GKByHohIkpkzBZY3wj" // Monthly price ID - live one price_1QqsI0GKByHohIkpms5VH5sX
              : "price_1Qr93HGKByHohIkpMloXDVCi", // Annual price ID - live one price_1QqsGOGKByHohIkpodoC3N7z
          quantity: 1,
        },
      ],
      customer_email: username,
      success_url: `https://aebox-website.vercel.app/success/subscription?email=${encodeURIComponent(username)}&subscriptionType=${encodeURIComponent(subscriptionType)}`,
      cancel_url: `https://aebox-website.vercel.app/cancel`,
    });
    return res.status(200).json({ checkoutUrl: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    return res.status(500).json({ message: "Failed to create session" });
  }
}