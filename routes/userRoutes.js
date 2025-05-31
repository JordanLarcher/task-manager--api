const express = require("express");
const router = express.Router();
const { validationResult } = require("express-validator");
const { userValidationRules } = require("../middleware/validators/userRules");
const userController = require("../controllers/userController");
const winston = require("../util/logger");
const {authenticateJWT} = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for user management
 *
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ObjectId
 *           example: "60f2a1e1234567890abcdef0"
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: "john.doe@example.com"
 *         password:
 *           type: string
 *           description: Hashed password (bcrypt)
 *           example: "$2a$10$Vh2YQe0..."
 *         role:
 *           type: string
 *           description: User role (ADMIN or USER)
 *           enum:
 *             - ADMIN
 *             - USER
 *           example: "USER"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when user was last updated
 *
 *     NewUser:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: New user's email address
 *           example: "mary.smith@example.com"
 *         password:
 *           type: string
 *           description: Plain-text password (will be hashed)
 *           example: "MySecurePass123!"
 *         role:
 *           type: string
 *           description: User role (default "USER")
 *           enum:
 *             - ADMIN
 *             - USER
 *           example: "USER"
 *
 *     UpdateUser:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Updated email address
 *           example: "new.email@example.com"
 *         role:
 *           type: string
 *           description: Updated role for the user
 *           enum:
 *             - ADMIN
 *             - USER
 *           example: "ADMIN"
 *
 *   parameters:
 *     UserIdParam:
 *       name: id
 *       in: path
 *       description: MongoDB ObjectId of the user
 *       required: true
 *       schema:
 *         type: string
 *         pattern: "^[0-9a-fA-F]{24}$"
 *         example: "60f2a1e1234567890abcdef0"
 *
 *   responses:
 *     UserNotFound:
 *       description: User not found in database
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "User not found"
 *
 *     ValidationError:
 *       description: Input data validation failed
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               errors:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     msg:
 *                       type: string
 *                       example: "Invalid email"
 *                     param:
 *                       type: string
 *                       example: "email"
 *                     location:
 *                       type: string
 *                       example: "body"
 *
 *     ServerError:
 *       description: Internal server error
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Internal server error"
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieve all users
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Array of user objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get("/",
    authenticateJWT,
    authorizeRoles('ADMIN'),
    userController.getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Retrieve a single user by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - $ref: '#/components/parameters/UserIdParam'
 *     responses:
 *       200:
 *         description: A single user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         $ref: '#/components/responses/UserNotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get("/:id", userController.getUserById);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       description: Information for the new user
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewUser'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post("/", ...userValidationRules, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    winston.warn(`Validation failed: ${JSON.stringify(errors.array())}`)
    return res.status(400).json({errors: errors.array()});
  }
  try {
    winston.info(`Creating user: ${JSON.stringify(req.body)}`);
    const newUser = await userController.createUser(req, res, next);
    res.status(201).json(newUser);

  } catch (error) {
    winston.error(`Error creating user: ${error.message}`)
    next(error);
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update an existing user
 *     tags:
 *       - Users
 *     parameters:
 *       - $ref: '#/components/parameters/UserIdParam'
 *     requestBody:
 *       description: Fields to update for the user
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUser'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/UserNotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.put("/:id", ...userValidationRules, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    winston.warn(`Validation failed: ${JSON.stringify(errors.array())}`);
    return res.status(400).json({errors: errors.array()});
  }
  try {
    winston.info(`Updating user with ID: ${req.params.id} with data: ${JSON.stringify(req.body)}`);
    const updatedUser = await userController.updateUser(req, res, next);
    if (!updatedUser) {
      winston.warn(`User with ID ${req.params.id} not found`);
      return res.status(404).json({message: "User not found"});
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    winston.error(`Error updating user: ${error.message}`)
    res.status(500).json({message: "Internal server error"});
    next(error);
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags:
 *       - Users
 *     parameters:
 *       - $ref: '#/components/parameters/UserIdParam'
 *     responses:
 *       204:
 *         description: User deleted successfully (no content)
 *       404:
 *         $ref: '#/components/responses/UserNotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete("/:id",
    authenticateJWT,
    authorizeRoles('ADMIN'),
    async(req, res, next) => {

  try {
    winston.info(`Deleting user with ID: ${req.params.id}`);
    await userController.deleteUser(req, res, next);
  } catch (error) {
    winston.error(`Error deleting user with ID ${req.params.id} : ${error.message}`)
    next(error);
  }
});
module.exports = router;
