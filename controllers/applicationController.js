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
// Create a new application
async function createApplication(req, res) {
  const { name, description, box_id, viewId } = req.body; // Added viewId
  try {
    // Get the current max order for the box
    const { data: maxOrderData, error: maxOrderError } = await supabase
      .from('applications')
      .select('order')
      .eq('box_id', box_id)
      .order('order', { ascending: false })
      .limit(1);

    if (maxOrderError) throw maxOrderError;

    const newOrder = maxOrderData.length > 0 ? maxOrderData[0].order + 1 : 0;

    const { data, error } = await supabase
      .from('applications')
      .insert([{ name, description, box_id, order: newOrder, viewId }]) // Include order and viewId
      .select();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Update application by ID
// Update application by ID
async function updateApplication(req, res) {
  const { id } = req.params;
  const { name, description, viewId } = req.body; // Added viewId
  try {
    const { data, error } = await supabase
      .from('applications')
      .update({ name, description, viewId }) // Include viewId
      .eq('id', id)
      .select();
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

// getapplications by box id 
// Get applications by box ID, sorted by order
async function getApplicationsByBoxId(req, res) {
  const { box_id } = req.params;
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('box_id', box_id)
      .order('order',{ ascending: true }); // Sort by order ascending
    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Update application order
async function updateApplicationOrder(req, res) {
  const { box_id } = req.params;
  const { orderedAppIds } = req.body; // Array of app IDs in new order

  try {
    // Fetch all applications for the box
    const { data: apps, error: fetchError } = await supabase
      .from('applications')
      .select('id')
      .eq('box_id', box_id);

    if (fetchError) throw fetchError;

    // Validate that all provided IDs exist
    const validIds = apps.map((app) => app.id);
    if (!orderedAppIds.every((id) => validIds.includes(id))) {
      return res.status(400).json({ message: 'Invalid application IDs' });
    }

    // Update order for each application
    const updates = orderedAppIds.map(async (appId, index) => {
      const { error } = await supabase
        .from('applications')
        .update({ order: index })
        .eq('id', appId);
      if (error) throw error;
    });

    await Promise.all(updates);

    res.status(200).json({ message: 'Order updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  getAllApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,
  getApplicationsByBoxId,
  updateApplicationOrder,
};