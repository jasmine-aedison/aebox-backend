const { Subscription, PaymentHistory } = require("../models/index");
const sendEmail = require("../services/emailService");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.createOrUpdateSubscription = async (req, res) => {
  try {
    const { username, subscription_type, subscription_status, expiry_date, deviceId } = req.body;
    if (!deviceId) {
      return res.status(400).json({
        message: "Device ID is required",
      });
    }
    // Check if a subscription exists for this username
    const existingSubscriptions = await Subscription.getByUsername(username);
    if (existingSubscriptions && existingSubscriptions.length > 0) {
      // If a subscription exists, update it with the latest data
      const updates = {
        subscription_type: subscription_type,
        subscription_status: subscription_status,
        expiry_date: expiry_date,
        deviceId: deviceId // Ensure device_id is updated
      };
      const updatedSubscription = await Subscription.updateSubscription(
        username,
        updates
      );

      // Optionally, send an update confirmation email
      await sendEmail(
        username, // assuming username is the user's email
        "Your AeBox Subscription Has Been Updated",
        `Your AeBox subscription has been updated to a ${subscription_type} plan. \n\nYour subscription will automatically renew 3 days before ${expiry_date}.`
      );

      return res.status(200).json({
        message: "Subscription updated successfully",
        subscription: updatedSubscription,
      });
    } else {
      // If no subscription exists, create a new one
      const newSubscription = await Subscription.create({
        username,
        subscription_type,
        subscription_status,
        expiry_date,
        deviceId // now properly passed from request
      });

      // Optionally, send a confirmation email for the new subscription
      await sendEmail(
        username,
        "Your AeBox Subscription Is Active",
        `Thank you for subscribing to AeBox. Your ${subscription_type} plan is now active. \n\nYour subscription will automatically renew 3 days before ${expiry_date}.`
      );

      return res.status(201).json({
        message: "Subscription created successfully",
        subscription: newSubscription,
      });
    }
  } catch (error) {
    console.error("Error in createOrUpdateSubscription:", error);
    return res.status(400).json({
      message: "Failed to process subscription",
      error: error.message,
    });
  }
};

// Create a new subscription
exports.createSubscription = async (req, res) => {
  try {
    const { username, subscription_type, subscription_status, expiry_date, deviceId } = req.body;
    
    if (!deviceId) {
      return res.status(400).json({
        message: "Device ID is required",
      });
    }
    
    const newSubscription = await Subscription.create({
      username,
      subscription_type,
      subscription_status,
      expiry_date,
      deviceId
    });

    await sendEmail(
      username,
      "Your subscription for AeBox is activated",
      `Thank you for subscribing to AEBox. Your premium ${subscription_type} plan is now active.\n\nYour plan will renew 3 days before ${expiry_date}.`
    );
    res.status(201).json(newSubscription);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to create subscription", error: error.message });
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
    res
      .status(500)
      .json({ message: "Error fetching subscriptions", error: error.message });
  }
};

exports.updateSubscription = async (req, res) => {
  try {
    const { subscription_status, subscription_type, expiry_date, deviceId } = req.body;
    const username = req.params.username;
    
    if (!deviceId) {
      return res.status(400).json({
        message: "Device ID is required",
      });
    }
    
    // ✅ Check if the subscription exists
    const { data: existingSubscription, error: fetchError } =
      await Subscription.getByUsername(req.params.username);
    if (fetchError && fetchError.code !== "PGRST116") {
      // "PGRST116" is Supabase error for "no rows found"
      throw fetchError;
    }

    if (existingSubscription) {
      // ✅ Update existing subscription
      const { error: updateError } = await supabase
        .from("subscriptions")
        .update({
          subscription_status:
            subscription_status || existingSubscription.subscription_status,
          subscription_type:
            subscription_type || existingSubscription.subscription_type,
          expiry_date: expiry_date || existingSubscription.expiry_date,
          deviceId: deviceId || existingSubscription.deviceId,
        })
        .eq("username", username);

      if (updateError) throw updateError;
      return res
        .status(200)
        .json({ message: "Subscription updated successfully" });
    } else {
      // ✅ Insert new subscription if not exists
      const { error: insertError } = await supabase
        .from("subscriptions")
        .insert([
          {
            username,
            subscription_status,
            subscription_type,
            expiry_date,
            deviceId
          },
        ]);

      if (insertError) throw insertError;
      // Send confirmation email
      await sendEmail(
        username,
        "Your subscription for AeBox is updated",
        `Your AEBox subscription has been updated.\n\nNew Expiry Date: ${expiry_date}`
      );

      return res
        .status(201)
        .json({ message: "New subscription created successfully" });
    }
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to update subscription", error: error.message });
  }
};

// Get payment history
exports.getPaymentHistory = async (req, res) => {
  try {
    const { username } = req.params;
    const paymentHistory = await PaymentHistory.getByUsername(username);
    res.status(200).json(paymentHistory);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error retrieving payment history",
        error: error.message,
      });
  }
};

// Delete a subscription
exports.deleteSubscription = async (req, res) => {
  try {
    const deletedSubscription = await Subscription.deleteByUsername(
      req.params.username
    );
    if (!deletedSubscription.length)
      return res.status(404).json({ message: "Subscription not found" });
    res.status(200).json({ message: "Subscription deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete subscription", error: error.message });
  }
};

// Handle Stripe Webhook Events
exports.handleStripeWebhook = async (req, res) => {
  console.log("✅ Stripe webhook endpoint hit");
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    console.error("🔍 Headers:", req.headers);
    console.error("📦 Raw body (string):", req.body.toString('utf8'));
    return res.status(400).json({ message: "Invalid webhook signature" });
  }
  const { type: eventType, data } = event;
  const eventData = data.object;
  console.log(`📨 Received event type: ${eventType}`);
  console.log(eventData);
  
  try {
    const customerId = eventData?.customer;
    if (!customerId) {
      console.warn("⚠️ Missing customer ID in event data");
      console.debug("🧾 Full event data:", JSON.stringify(eventData, null, 2));
      return res.status(200).json({ received: true }); // still return 200 to acknowledge receipt
    }
    
    switch (eventType) {
      case "checkout.session.completed": {
        // Handle initial checkout completion
        const customer = await stripe.customers.retrieve(customerId);
        const customerEmail = customer?.email || eventData?.customer_email;
        
        if (!customerEmail) {
          console.error("⚠️ Customer email not found for:", customerId);
          return res.status(400).json({ message: "Customer email not found" });
        }
        
        // Retrieve device_id from metadata if it was passed during checkout
        const deviceId = eventData?.metadata?.deviceId;
        if (!deviceId) {
          console.warn("⚠️ No device ID found in checkout session metadata");
        }
        
        // If there's a subscription in the session, retrieve it
        let subscriptionId = eventData?.subscription;
        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const isRenewal = false; // First checkout is never a renewal
          await handleSubscriptionData(subscription, customerEmail, deviceId, isRenewal);
        }
        break;
      }
      
      case "invoice.payment_succeeded": {
        // This handles both initial payments and renewals
        const customer = await stripe.customers.retrieve(customerId);
        const customerEmail = customer?.email || eventData?.receipt_email;

        if (!customerEmail) {
          console.error("⚠️ Customer email not found for:", customerId);
          return res.status(400).json({ message: "Customer email not found" });
        }
        
        // Check existing subscription to determine if this is a renewal
        const existingSubscription = await Subscription.getByUsername(customerEmail);
        const isRenewal = existingSubscription && existingSubscription.length > 0;
        
        // Get the subscription data
        if (eventData.subscription) {
          const subscription = await stripe.subscriptions.retrieve(eventData.subscription);
          
          // Try to get device_id from metadata or use existing one
          let deviceId = subscription?.metadata?.deviceId;
          if (!deviceId && existingSubscription && existingSubscription.length > 0) {
            deviceId = existingSubscription[0].deviceId;
          }
          
          await handleSubscriptionData(subscription, customerEmail, deviceId, isRenewal);
        }
        break;
      }
      
      case "customer.subscription.updated": {
        const customer = await stripe.customers.retrieve(customerId);
        const customerEmail = customer?.email;
        
        if (!customerEmail) {
          console.warn(`⚠️ No email found for updated subscription of ${customerId}`);
          return res.status(400).json({ message: "Email not found for subscription update" });
        }
        
        // Get existing subscription to preserve device_id
        const existingSubscription = await Subscription.getByUsername(customerEmail);
        let deviceId = null;
        if (existingSubscription && existingSubscription.length > 0) {
          deviceId = existingSubscription[0].deviceId;
        }
        
        // Check if this is just a status update or also renewal
        const isRenewal = false; // Status updates alone aren't renewals
        await handleSubscriptionData(eventData, customerEmail, deviceId, isRenewal);
        break;
      }

      case "customer.subscription.deleted": {
        const customer = await stripe.customers.retrieve(customerId);
        const email = customer?.email;

        if (!email) {
          console.warn(`⚠️ No email found for deleted subscription of ${customerId}`);
          return res.status(400).json({ message: "Email not found for subscription deletion" });
        }

        await Subscription.deleteByUsername(email);
        console.log(`❌ Subscription deleted for ${email}`);
        break;
      }

      default:
        console.log(`ℹ️ Unhandled event type: ${eventType}`);
    }

    res.status(200).json({ received: true });

  } catch (error) {
    console.error("🔥 Error handling Stripe webhook:", error);
    res.status(500).json({ message: "Internal webhook processing error", error: error.message });
  }
};

// Helper function to process subscription data consistently
async function handleSubscriptionData(subscription, email, deviceId, isRenewal) {
  // Get subscription details
  const plan = subscription?.items?.data?.[0]?.plan;
  const subscriptionType = plan?.interval === "month" ? "monthly" : 
                           plan?.interval === "year" ? "annual" : "unknown";
  
  let expiryDate = null;
  if (subscription?.current_period_end) {
    expiryDate = new Date(subscription.current_period_end * 1000);
  }
  
  // Update subscription in database
  await Subscription.upsert({
    username: email,
    subscription_status: subscription.status || 'active',
    subscription_type: subscriptionType,
    expiry_date: expiryDate,
    deviceId: deviceId
  });
  
  // Log appropriate message based on if this is a renewal
  if (isRenewal) {
    console.log(`♻️ Subscription renewed for ${email}`);
    
    // Optionally send renewal email
    await sendEmail(
      email,
      "Your AeBox Subscription Has Been Renewed",
      `Your AeBox ${subscriptionType} subscription has been renewed successfully.\n\nYour next renewal date is ${expiryDate.toDateString()}.`
    );
  } else {
    console.log(`✅ Subscription ${isRenewal ? 'updated' : 'created'} for ${email}`);
  }
  
  // Create payment history record

  // dont have this table 
  try {
    await PaymentHistory.create({
      username: email,
      subscription_type: subscriptionType,
      payment_date: new Date(),
      amount: plan?.amount ? (plan.amount / 100) : null,
      currency: plan?.currency || 'usd',
      transaction_id: subscription.id,
      is_renewal: isRenewal
    });
  } catch (error) {
    console.error("Failed to create payment history:", error);
  }
}

exports.checkout = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  const { username, subscriptionType, deviceId } = req.body;
  console.log(
    username,
    subscriptionType,
    deviceId,
    "inside the subscription controller"
  );
  
  if (!username) {
    return res.status(400).json({ message: "Email is required." });
  }
  
  if (!deviceId) {
    return res.status(400).json({ message: "Device ID is required." });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price:
            subscriptionType === "monthly"
              ? "price_1Qr940GKByHohIkpkzBZY3wj" // Monthly price ID
              : "price_1Qr93HGKByHohIkpMloXDVCi", // Annual price ID
          quantity: 1,
        },
      ],
      customer_email: username,
      metadata: {
        deviceId: deviceId, // Store device_id in metadata to access in webhook
      },
      success_url: `https://aebox-website.vercel.app/success/subscription?email=${encodeURIComponent(
        username
      )}&subscriptionType=${encodeURIComponent(subscriptionType)}&deviceId=${encodeURIComponent(deviceId)}`,
      cancel_url: `https://aebox-website.vercel.app/cancel`,
    });
    return res.status(200).json({ checkoutUrl: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    return res.status(500).json({ message: "Failed to create session" });
  }
};