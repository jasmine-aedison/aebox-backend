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
  const { username } = req.params;

  try {
    // Query Supabase to fetch user data
    const { data, error } = await supabase.from('users').select('*').eq('username', username).single()
    // Check for any errors from Supabase query
    if (error) {
      // Handle specific error scenarios
      if (error.message.includes('JSON object requested, multiple (or no) rows returned')) {
        return res.status(404).json({ message: 'User not found' });
      }
      // Handle other errors
      return res.status(500).json({ message: error.message });
    }

    // If user data found, return it
    res.status(200).json(data);
  } catch (err) {
    // Catch and handle any other errors (e.g., database issues, bad request)
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

// Create a new user
async function createUser(req, res) {
  const { username, email } = req.body;
  const created_at = new Date().toISOString();

  try {
    // Attempt to insert the data
    const { data, error } = await supabase
      .from('users')
      .insert([{ username, email, created_at, subscription_status: 'free' }]);

    console.log('Insert response:', data, error); // Log both data and error
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    // If no error, respond with the data
    res.status(201).json(data);
  } catch (err) {
    console.error('Error during user creation:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}
// Update user by ID
async function updateUser(req, res) {
  const { username } = req.params;
  const { email } = req.body;
  try {
    const { data, error } = await supabase.from('users').update({ email }).eq('username', username);
    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Delete user by ID
async function deleteUser(req, res) {
  const { username } = req.params;
  try {
    const { data, error } = await supabase.from('users').delete().eq('username', username);
    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { getAllUsers, getUser, createUser, updateUser, deleteUser };
