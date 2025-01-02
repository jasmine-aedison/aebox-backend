// deviceSyncController.js
const supabase = require('../models/supabase'); // Your Supabase client or database client

// Get all device syncs
async function getAllDeviceSyncs(req, res) {
  try {
    const { data, error } = await supabase.from('device_sync').select('*');
    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Get device sync by ID
async function getDeviceSync(req, res) {
  const { id } = req.params;
  try {
    const { data, error } = await supabase.from('device_sync').select('*').eq('id', id).single();
    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Create a new device sync
async function createDeviceSync(req, res) {
  const { device_id, sync_status, last_synced } = req.body;
  try {
    const { data, error } = await supabase.from('device_sync').insert([{ device_id, sync_status, last_synced }]);
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Update device sync by ID
async function updateDeviceSync(req, res) {
  const { id } = req.params;
  const { device_id, sync_status, last_synced } = req.body;
  try {
    const { data, error } = await supabase.from('device_sync').update({ device_id, sync_status, last_synced }).eq('id', id);
    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Delete device sync by ID
async function deleteDeviceSync(req, res) {
  const { id } = req.params;
  try {
    const { data, error } = await supabase.from('device_sync').delete().eq('id', id);
    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { getAllDeviceSyncs, getDeviceSync, createDeviceSync, updateDeviceSync, deleteDeviceSync };
