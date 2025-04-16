const supabase = require("../models/supabase"); // Import Supabase client

const Subscription = {
  async create(data) {
    const { data: newSubscription, error } = await supabase
      .from("subscriptions")
      .insert([data]) //username, subscription status, subscription type and start_date and expiry_date which is optional  
      .select();
    if (error) throw error;
    return newSubscription;
  },

  async getByUsername(username) {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("username", username)
      .select();
    if (error) throw error;
    return data;
  },

//   async updateStatus(username, newStatus) {
//     const { data, error } = await supabase
//       .from("subscriptions")
//       .update({ status: newStatus })
//       .eq("username", username)
//       .select();
//     if (error) throw error;
//     return data;
//   },

  // Get all subscriptions
  async getAll() {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*");

    if (error) return { error: error.message };
    return data;
  },

  // Update subscription status
  async updateStatus(username, newStatus) {
    const { data, error } = await supabase
      .from("subscriptions")
      .update({ status: newStatus })
      .eq("username", username)
      .select();

    if (error) return { error: error.message };
    return data;
  },

  // Update subscription type, status, and expiry date
  async updateSubscription(username, updates) {
    const { data, error } = await supabase
      .from("subscriptions")
      .update(updates)
      .eq("username", username)
      .select();

    if (error) return { error: error.message };
    return data;
  },

  // Delete a subscription by username
  async deleteByUsername(username) {
    const { data, error } = await supabase
      .from("subscriptions")
      .delete()
      .eq("username", username);

    if (error) return { error: error.message };
    return { message: "Subscription deleted successfully", data };
  },

  // Upsert subscription (create or update)
  async upsert(data) {
    const { data: existingSubscription, error: getError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("username", data.username) // Check for existing subscription by username
      .single(); // Get a single record

    if (getError && getError.code !== "PGRST116") { // If no existing record found
      throw getError; // throw error if other than "No Record Found"
    }

    // If a subscription already exists, update it
    if (existingSubscription) {
      const { data: updatedSubscription, error: updateError } = await supabase
        .from("subscriptions")
        .update(data) // Update with new data
        .eq("username", data.username); // Match by username

      if (updateError) throw updateError;
      return updatedSubscription;
    }

    // Otherwise, insert a new subscription
    const { data: newSubscription, error: insertError } = await supabase
      .from("subscriptions")
      .insert([data])
      .select();
    if (insertError) throw insertError;
    return newSubscription;
  },
};

module.exports = Subscription;
