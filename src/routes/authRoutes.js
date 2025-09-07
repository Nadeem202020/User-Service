const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication Endpoints
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticates a user and returns a JWT
 *     description: Takes a user's email address, and if the user exists, returns a JWT for accessing protected endpoints.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address.
 *             example:
 *               email: "admin@example.com"
 *     responses:
 *       200:
 *         description: Authentication successful. The JWT is returned in the response.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: The JSON Web Token for authentication.
 *       401:
 *         description: Unauthorized. The provided email does not correspond to an existing user.
 */
router.post('/login', login);

module.exports = router;