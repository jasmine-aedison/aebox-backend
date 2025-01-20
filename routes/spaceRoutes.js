// spaceRoutes.js
const express = require('express');
const { getSpace, createSpace, updateSpace, deleteSpace, getAllSpaces } = require('../controllers/spaceController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Spaces
 *     description: API for managing spaces
 */

/**
 * @swagger
 * /spaces:
 *   get:
 *     tags:
 *       - Spaces
 *     summary: Retrieve all spaces
 *     description: Fetches a list of all spaces in the system.
 *     responses:
 *       200:
 *         description: A list of spaces
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
 * /spaces/{id}:
 *   get:
 *     tags:
 *       - Spaces
 *     summary: Retrieve a single space by ID
 *     description: Fetch a specific space using its unique identifier.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the space.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single space object
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
 *         description: Space not found
 */

/**
 * @swagger
 * /spaces:
 *   post:
 *     tags:
 *       - Spaces
 *     summary: Create a new space
 *     description: Creates a new space in the system.
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
 *         description: Space created successfully
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
 * /spaces/{id}:
 *   put:
 *     tags:
 *       - Spaces
 *     summary: Update an existing space
 *     description: Updates the details of an existing space identified by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the space.
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
 *         description: Space updated successfully
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
 *         description: Space not found
 */

/**
 * @swagger
 * /spaces/{id}:
 *   delete:
 *     tags:
 *       - Spaces
 *     summary: Delete a space by ID
 *     description: Deletes a space identified by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the space.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Space deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Space deleted successfully"
 *       404:
 *         description: Space not found
 */

// Get all spaces
router.get('/', getAllSpaces);

// Get a single space by ID
router.get('/:id', getSpace);
    
// Get a single space by username
router.get('/:username', getSpaceByUsername);

// Create a new space
router.post('/', createSpace);

// Update a space by ID
router.put('/:id', updateSpace);

// Delete a space by ID
router.delete('/:id', deleteSpace);

module.exports = router;
