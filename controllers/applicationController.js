// applicationController.js
const supabase = require('../models/supabase');

// Get all applications
async function getAllApplications(req, res) {
  try {
    const { data, error } = await supabase.from('applications').select('*');
    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Get application by ID
async function getApplication(req, res) {
  const { id } = req.params;
  try {
    const { data, error } = await supabase.from('applications').select('*').eq('id', id).single();
    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Create a new application
async function createApplication(req, res) {
  const { name, description } = req.body;
  try {
    const { data, error } = await supabase.from('applications').insert([{ name, description }]);
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Update application by ID
async function updateApplication(req, res) {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const { data, error } = await supabase.from('applications').update({ name, description }).eq('id', id);
    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Delete application by ID
async function deleteApplication(req, res) {
  const { id } = req.params;
  try {
    const { data, error } = await supabase.from('applications').delete().eq('id', id);
    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { getAllApplications, getApplication, createApplication, updateApplication, deleteApplication };
