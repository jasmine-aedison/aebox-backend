// deviceSyncRoutes.js
const express = require('express');
const { getDeviceSync, createDeviceSync, updateDeviceSync, deleteDeviceSync, getAllDeviceSyncs } = require('../controllers/deviceSyncController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: DeviceSyncs
 *     description: API for managing device syncs
 */

/**
 * @swagger
 * /device-syncs:
 *   get:
 *     tags:
 *       - DeviceSyncs
 *     summary: Retrieve all device syncs
 *     description: Fetches a list of all device syncs in the system.
 *     responses:
 *       200:
 *         description: A list of device syncs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   deviceId:
 *                     type: integer
 *                   status:
 *                     type: string
 *                   lastSync:
 *                     type: string
 *                     format: date-time
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 */

/**
 * @swagger
 * /device-syncs/{id}:
 *   get:
 *     tags:
 *       - DeviceSyncs
 *     summary: Retrieve a single device sync by ID
 *     description: Fetch a specific device sync using its unique identifier.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the device sync.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single device sync object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 deviceId:
 *                   type: integer
 *                 status:
 *                   type: string
 *                 lastSync:
 *                   type: string
 *                   format: date-time
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Device sync not found
 */

/**
 * @swagger
 * /device-syncs:
 *   post:
 *     tags:
 *       - DeviceSyncs
 *     summary: Create a new device sync
 *     description: Creates a new device sync in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deviceId
 *               - status
 *             properties:
 *               deviceId:
 *                 type: integer
 *               status:
 *                 type: string
 *               lastSync:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Device sync created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 deviceId:
 *                   type: integer
 *                 status:
 *                   type: string
 *                 lastSync:
 *                   type: string
 *                   format: date-time
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /device-syncs/{id}:
 *   put:
 *     tags:
 *       - DeviceSyncs
 *     summary: Update an existing device sync
 *     description: Updates the details of an existing device sync identified by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the device sync.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deviceId
 *               - status
 *             properties:
 *               deviceId:
 *                 type: integer
 *               status:
 *                 type: string
 *               lastSync:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Device sync updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 deviceId:
 *                   type: integer
 *                 status:
 *                   type: string
 *                 lastSync:
 *                   type: string
 *                   format: date-time
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Device sync not found
 */

/**
 * @swagger
 * /device-syncs/{id}:
 *   delete:
 *     tags:
 *       - DeviceSyncs
 *     summary: Delete a device sync by ID
 *     description: Deletes a device sync identified by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the device sync.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Device sync deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Device sync deleted successfully"
 *       404:
 *         description: Device sync not found
 */

// Get all device syncs
router.get('/', getAllDeviceSyncs);

// Get a single device sync by ID
router.get('/:id', getDeviceSync);

// Create a new device sync
router.post('/', createDeviceSync);

// Update a device sync by ID
router.put('/:id', updateDeviceSync);

// Delete a device sync by ID
router.delete('/:id', deleteDeviceSync);

module.exports = router;
