// userController.js
const supabase = require('../models/supabase'); // Your Supabase client or database client

// Get all users
async function getAllUsers(req, res) {
  try {
    const { data, error } = await supabase.from('users').select('*');
    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Get user by ID
async function getUser(req, res) {
  const { id } = req.params;
  try {
    const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}git 

// Create a new user
async function createUser(req, res) {
  const { username, email, first_name, last_name, created_at } = req.body;
  try {
    const { data, error } = await supabase.from('users').insert([{ username, email, first_name, last_name, created_at }]);
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Update user by ID
async function updateUser(req, res) {
  const { id } = req.params;
  const { username, email } = req.body;
  try {
    const { data, error } = await supabase.from('users').update({ username, email }).eq('id', id);
    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Delete user by ID
async function deleteUser(req, res) {
  const { id } = req.params;
  try {
    const { data, error } = await supabase.from('users').delete().eq('id', id);
    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { getAllUsers, getUser, createUser, updateUser, deleteUser };
