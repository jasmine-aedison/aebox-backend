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
};

module.exports = Subscription;
