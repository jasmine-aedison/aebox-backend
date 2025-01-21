// userRoutes.js
const express = require('express');
const { getUser, createUser, updateUser, deleteUser, getAllUsers } = require('../controllers/userController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: API for managing users
 */

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Retrieve all users
 *     description: Fetches a list of all users in the system.
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   username:
 *                     type: string
 *                   email:
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
 * /users/{username}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Retrieve a single user by username
 *     description: Fetch a specific user using their username.
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         description: The unique username of the user.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single user object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Create a new user
 *     description: Creates a new user in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                 email:
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
 * /users/{username}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update an existing user
 *     description: Updates the details of an existing user identified by their username.
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         description: The unique username of the user.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                 email:
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
 *         description: User not found
 */

/**
 * @swagger
 * /users/{username}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete a user by username
 *     description: Deletes a user identified by their username.
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         description: The unique username of the user.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully"
 *       404:
 *         description: User not found
 */


// Get all users
router.get('/', getAllUsers);

// Create a new user
router.post('/', createUser);

// Get a single user by ID
router.get('/:username', getUser);

// Update a user by ID
router.put('/:username', updateUser);

// Delete a user by ID
router.delete('/:username', deleteUser);

module.exports = router;
