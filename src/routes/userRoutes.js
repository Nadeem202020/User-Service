const express = require('express');
const router = express.Router();


const { createUser, getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: All routes related to user management. Protected by JWT.
 */

// --- Routes for /users ---

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a user.
 *     description: Adds a new user to the database. Requires authentication.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUser'
 *     responses:
 *       '201':
 *         description: Success! User was created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       '400':
 *         description: Bad request, check your input.
 *       '409':
 *         description: Email is already in use.
 */
router.post('/', authMiddleware, createUser);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users.
 *     description: Gets a list of all users, with support for pagination and filtering by age.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Page number.
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of users per page.
 *       - in: query
 *         name: age
 *         schema:
 *           type: integer
 *         description: Filter the list by a specific age.
 *     responses:
 *       '200':
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserListResponse'
 */
router.get('/', authMiddleware, getAllUsers);

// --- Routes for /users/:id ---

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a single user.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The user's ID.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: The user's profile info.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       '404':
 *         description: User not found.
 */
router.get('/:id', authMiddleware, getUserById);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The user's ID.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUser'
 *     responses:
 *       '200':
 *         description: The user was updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       '404':
 *         description: User not found.
 *       '409':
 *         description: The new email is already taken.
 */
router.put('/:id', authMiddleware, updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The user's ID.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: The user was deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: "User with ID 60d21b4667d0d8992e610c85 has been deleted successfully."
 *       '404':
 *         description: User not found.
 */
router.delete('/:id', authMiddleware, deleteUser);

module.exports = router;

// --- Component Schemas for Swagger ---

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     CreateUser:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         name:
 *           type: string
 *           description: User's name.
 *         email:
 *           type: string
 *           format: email
 *           description: User's email. Must be unique.
 *         age:
 *           type: integer
 *           description: User's age. Optional.
 *       example:
 *         name: "Jane Doe"
 *         email: "jane.doe@example.com"
 *         age: 28
 *     UpdateUser:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         age:
 *           type: integer
 *       example:
 *         name: "Jane A. Doe"
 *         age: 29
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         age:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: "60d21b4667d0d8992e610c85"
 *         name: "Jane Doe"
 *         email: "jane.doe@example.com"
 *         age: 28
 *         createdAt: "2023-10-27T10:00:00.000Z"
 *         updatedAt: "2023-10-27T10:00:00.000Z"
 *     UserResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               $ref: '#/components/schemas/User'
 *     UserListResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         results:
 *           type: integer
 *           description: Number of users in the response.
 *           example: 2
 *         data:
 *           type: object
 *           properties:
 *             users:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */