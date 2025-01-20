// spaceController.js
const { application } = require('express');
const supabase = require('../models/supabase'); // Your Supabase client or database client

// Get all spaces
async function getAllSpaces(req, res) {
  try {
    const { data, error } = await supabase.from('spaces').select('*');
    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Get space by ID
async function getSpace(req, res) {
  const { id } = req.params;
  try {
    const { data, error } = await supabase.from('spaces').select('*').eq('id', id).single();
    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Create a new space
async function createSpace(req, res) {
  const { name, description, username } = req.body;
  try {
    const { data, error } = await supabase.from('spaces').insert([{ name, description, username, category:'daily'}]);
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  } 
}

// Update space by ID
async function updateSpace(req, res) {
  const { id } = req.params;
  const { name, description , category} = req.body;
  try {
    const { data, error } = await supabase.from('spaces').update({ name, description, category }).eq('id', id);
    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Delete space by ID
async function deleteSpace(req, res) {
  const { id } = req.params;
  try {
    const { data, error } = await supabase.from('spaces').delete().eq('id', id);
    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getSpaceByUsername(req, res) {
  const { username } = req.params;
  try {
    const { data, error } = await supabase
      .from('spaces')
      .select('*')
      .eq('username', username) // Filter by username
      .single(); // Ensure only one result is returned
    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { getAllSpaces, getSpace, createSpace, updateSpace, deleteSpace, getSpaceByUsername };