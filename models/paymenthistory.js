const supabase = require("../models/supabase"); // Import Supabase client

const PaymentHistory = {
  async create(data) {
    const { data: newPayment, error } = await supabase
      .from("payment_history") // Ensure this table exists in Supabase
      .insert([data])
      .select();
    if (error) throw error;
    return newPayment;
  },

  async getByUserId(userId) {
    const { data, error } = await supabase
      .from("payment_history")
      .select("*")
      .eq("userId", userId);
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from("payment_history")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },
};

module.exports = PaymentHistory;
