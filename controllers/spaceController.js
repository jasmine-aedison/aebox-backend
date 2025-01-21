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
  const { username } = req.params;
  const { id, name, description} = req.body;

  const numericId = Number(id);
  
  try {
    const { data, error } = await supabase.from('spaces').insert([{ id: numericId, username, name, description , category:'daily', created_at: new Date().toISOString()}]);
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  } 
}

// Update space by ID
async function updateSpace(req, res) {
  const { username, spaceId } = req.params;
  const { name, description } = req.body;
  try {
    const space = await supabase.from('spaces').update({ name, description }).eq('id', id);
    if (space) {
      space.name = name || space.name;
      space.description = description || space.description;
      await space.save();
      res.status(200).json(space);
    } else {
      res.status(404).json({ message: 'Space not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating space', error });
  }
};
// Delete space by ID
async function deleteSpace(req, res) {
  const { username, id } = req.params;
  try {
    const { data, error } = await supabase
      .from('spaces')
      .delete()
      .eq('username', username)
      .eq('id', id);

    if (error) throw error;

    if (data.length > 0) {
      // Successfully deleted
      res.status(204).send();
    } else {
      // No matching record found
      res.status(404).json({ message: 'Space not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting space', error: error.message });
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