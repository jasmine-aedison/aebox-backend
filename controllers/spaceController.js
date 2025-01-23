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
    const { data, error } = await supabase.from('spaces').select('*').eq('id', id);
    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Create a new space
async function createSpace(req, res) {
  const { username } = req.params;
  const { id, name, description, category} = req.body;

  const numericId = Number(id);
  
  try {
    const { data, error } = await supabase.from('spaces').insert([{ id: numericId, username, name, description , category, created_at: new Date().toISOString()}]);
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  } 
}

// Update space by ID
async function updateSpace(req, res) {
  const { username, id } = req.params;
  const { name, description } = req.body;
  try {
    // Perform the update operation
    const { data,error } = await supabase
      .from('spaces')
      .update({ name, description })
      .eq('id', id)
      .eq('username', username)
      .select(); // must remember to select the data to get the updated data

      console.log("data", data);
      console.log("error", error);

    if (error) {
      // If there's an error, handle it
      return res.status(500).json({ message: 'Error updating space', error: error.message });
    }
    if (data && data.length > 0) {
      // Successfully updated
      res.status(200).json(data[0]);  // Return the updated space
    } else {
      // No matching record found
      res.status(404).json({ message: 'Space not found' });
    }
  } catch (error) {
    // Handle any unexpected errors
    res.status(500).json({ message: 'Error updating space', error: error.message });
  }
}
// Delete space by ID
async function deleteSpace(req, res) {
  const { username, id } = req.params;
  console.log("checking api", username, id);

  // Convert id to a number for comparison
  const numericId = Number(id);

  if (isNaN(numericId)) {
    return res.status(400).json({ message: "Invalid id format" });
  }

  try {
    // Perform the delete operation
    const { data, error } = await supabase
      .from('spaces')
      .delete()
      .eq('username', username)
      .eq('id', numericId)
      .select();

    // Log the data and error for debugging
    console.log("data", data);  // This will give you more context
    console.log("error", error);

    if (error) {
      // If there's an error with the query, handle it
      return res.status(500).json({ message: 'Error deleting space', error: error.message });
    }

    // Check if a record was actually deleted
    if (data && data.length > 0) {
      console.log("Space deleted successfully", data);
      // Successfully deleted
      res.status(204).send();
    } else {
      console.log("No space found to delete");
      // No matching record found (even though it was deleted)
      res.status(404).json({ message: 'Space not found' });
    }
  } catch (error) {
    console.error("Error deleting space:", error);
    res.status(500).json({ message: 'Error deleting space', error: error.message });
  }
}


async function getSpaceByUsername(req, res) {
  const { username } = req.params;
  try {
    const { data, error } = await supabase
      .from('spaces')
      .select('*')
      .eq('username', username) // Filter by usernam
      
    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


// Application-related controllers
async function getAllApplicationsInBox(req, res) {
  const { username, boxId } = req.params;
  // console.log("checking api", username, boxId);
  try {
    const { data, error } = await supabase.from('applications').select('*').eq('box_id', boxId).eq('username', username).select();
    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getApplicationInBox(req, res) {
  const { username, boxId, applicationId } = req.params;
  try {
    // console.log("checking api", username, boxId, applicationId);
    const { data, error } = await supabase.from('applications').select('*').eq('box_id', boxId).eq('id', applicationId).eq('username', username).select();
    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function createApplicationInBox(req, res) {
  const { username, boxId } = req.params;
  const { name, category, website } = req.body;
  try {
    const { data, error } = (await supabase.from('applications').insert([{ name, category, website, box_id: boxId, username: username }]).select());
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function updateApplicationInBox(req, res) {
  const { username, boxId, applicationId } = req.params;
  const { name, category } = req.body;
  try {
    const { data, error } = await supabase.from('applications').update({ name, category }).eq('box_id', boxId).eq('id', applicationId).eq('username', username).select();
    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function deleteApplicationInBox(req, res) {
  const { username, boxId, applicationId } = req.params;
  try {
    const { data, error } = await supabase.from('applications').delete().eq('box_id', boxId).eq('id', applicationId).eq('username', username).select();
    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { getAllSpaces, getSpace, createSpace, updateSpace, deleteSpace, getSpaceByUsername, getAllApplicationsInBox, getApplicationInBox, createApplicationInBox, updateApplicationInBox, deleteApplicationInBox };