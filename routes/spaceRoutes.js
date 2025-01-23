// spaceRoutes.js
const express = require('express');
const router = express.Router();
const { getSpace, createSpace, updateSpace, deleteSpace, getAllSpaces, getSpaceByUsername, getAllApplicationsInBox, getApplicationInBox, createApplicationInBox, updateApplicationInBox, deleteApplicationInBox } = require('../controllers/spaceController');

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
* /spaces/{name}:
*   get:
*     tags:
*       - Spaces
*     summary: Retrieve a single space by name
*     description: Fetch a specific space using its unique name.
*     parameters:
*       - in: path
*         name: name
*         required: true
*         description: The unique name of the space.
*         schema:
*           type: string
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
* /spaces/{name}:
*   put:
*     tags:
*       - Spaces
*     summary: Update an existing space
*     description: Updates the details of an existing space identified by its name.
*     parameters:
*       - in: path
*         name: name
*         required: true
*         description: The unique name of the space.
*         schema:
*           type: string
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
* /spaces/{name}:
*   delete:
*     tags:
*       - Spaces
*     summary: Delete a space by name
*     description: Deletes a space identified by its name.
*     parameters:
*       - in: path
*         name: name
*         required: true
*         description: The unique name of the space.
*         schema:
*           type: string
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
router.get('/:username/:id', getSpace); 

// Get a single space by username
router.get('/:username', getSpaceByUsername);

// Create a new space
router.post('/:username', createSpace);

// Update a space by ID
router.put('/:username/:id', updateSpace);  // Update a space

// Delete a space by ID
router.delete('/:username/:id', deleteSpace);  // Delete a space

router.get('/:username/:boxId/applications', getAllApplicationsInBox); // Get all applications in a box
router.get('/:username/:boxId/applications/:applicationId', getApplicationInBox); // Get a single application by ID in a box
router.post('/:username/:boxId/applications', createApplicationInBox); // Create a new application in a box
router.put('/:username/:boxId/applications/:applicationId', updateApplicationInBox); // Update an application by ID in a box
router.delete('/:username/:boxId/applications/:applicationId', deleteApplicationInBox); // Delete an application by ID in a box

module.exports = router;
