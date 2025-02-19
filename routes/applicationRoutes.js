// applicationRoutes.js
const express = require('express');
const { getApplication, createApplication, updateApplication, deleteApplication, getAllApplications, getApplicationsByBoxId } = require('../controllers/applicationController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Applications
 *     description: API for managing applications
 */

/**
 * @swagger
 * /applications:
 *   get:
 *     tags:
 *       - Applications
 *     summary: Retrieve all applications
 *     description: Fetches a list of all applications in the system.
 *     responses:
 *       200:
 *         description: A list of applications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 */

/**
 * @swagger
 * /applications/{id}:
 *   get:
 *     tags:
 *       - Applications
 *     summary: Retrieve a single application by ID
 *     description: Fetch a specific application using its unique identifier.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the application.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single application object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Application not found
 */

/**
 * @swagger
 * /applications:
 *   post:
 *     tags:
 *       - Applications
 *     summary: Create a new application
 *     description: Creates a new application in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Application created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
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
 * /applications/{id}:
 *   put:
 *     tags:
 *       - Applications
 *     summary: Update an existing application
 *     description: Updates the details of an existing application identified by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the application.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Application updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Application not found
 */

/**
 * @swagger
 * /applications/{id}:
 *   delete:
 *     tags:
 *       - Applications
 *     summary: Delete an application by ID
 *     description: Deletes an application identified by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the application.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Application deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Application deleted successfully"
 *       404:
 *         description: Application not found
 */

// Get all applications
router.get('/', getAllApplications);

// Get a single application by ID
router.get('/:id', getApplication);

// Create a new application
router.post('/', createApplication);

// Update an application by ID
router.put('/:id', updateApplication);

// Delete an application by ID
router.delete('/:id', deleteApplication);

router.get('/box/:box_id' , getApplicationsByBoxId)

module.exports = router;
// 