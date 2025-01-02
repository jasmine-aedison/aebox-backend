// sessionController.js
const supabase = require('../models/supabase'); // Your Supabase client or database client

// Get all sessions
async function getAllSessions(req, res) {
  try {
    const { data, error } = await supabase.from('sessions').select('*');
    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Get session by ID
async function getSession(req, res) {
  const { id } = req.params;
  try {
    const { data, error } = await supabase.from('sessions').select('*').eq('id', id).single();
    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Create a new session
async function createSession(req, res) {
  const { user_id, start_time, end_time, status } = req.body;
  try {
    const { data, error } = await supabase.from('sessions').insert([{ user_id, start_time, end_time, status }]);
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Update session by ID
async function updateSession(req, res) {
  const { id } = req.params;
  const { user_id, start_time, end_time, status } = req.body;
  try {
    const { data, error } = await supabase.from('sessions').update({ user_id, start_time, end_time, status }).eq('id', id);
    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Delete session by ID
async function deleteSession(req, res) {
  const { id } = req.params;
  try {
    const { data, error } = await supabase.from('sessions').delete().eq('id', id);
    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { getAllSessions, getSession, createSession, updateSession, deleteSession };
