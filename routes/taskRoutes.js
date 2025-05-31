const express = require("express");
const router = express.Router();
const { validationResult } = require("express-validator");
const { taskValidationRules } = require("../middleware/validators/taskRules");
const taskController = require("../controllers/taskController");
const winston = require("../util/logger");

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management
 */

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   status:
 *                     type: string
 *                     enum: [PENDING, DONE, CANCELLED, OPEN]
 *                   assignee:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       email:
 *                         type: string
 *                       role:
 *                         type: string
 */
router.get("/", taskController.getAllTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the task
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 status:
 *                   type: string
 *                   enum: [PENDING, DONE, CANCELLED, OPEN]
 *                 assignee:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       404:
 *         description: Task not found
 */
router.get("/:id", taskController.getTaskById);
/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [PENDING, DONE, CANCELLED, OPEN]
 *               assignee:
 *                 type: string
 *             example:
 *               title: "Finish report"
 *               description: "Complete the quarterly report"
 *               status: "PENDING"
 *               assignee: "60d21b4667d0d8992e610c85"
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post("/", ...taskValidationRules, async (req, res, next) =>{
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    winston.warn(`Validation failed: ${JSON.stringify(errors.array())}`)
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    winston.info(`Creating task: ${JSON.stringify(req.body)}`);
    await taskController.createTask(req, res, next);
  } catch (error) {
    winston.warn(`Error creating task: ${error.message}`);
    next(error);
  }
});

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the task
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [PENDING, DONE, CANCELLED, OPEN]
 *               assignee:
 *                 type: string
 *             example:
 *               title: "Update report"
 *               description: "Revise the quarterly report"
 *               status: "DONE"
 *               assignee: "60d21b4667d0d8992e610c85"
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */
router.put("/:id", ...taskValidationRules, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    winston.warn(`Validation failed: ${JSON.stringify(errors.array())}`);
    return res.status(400).json({errors: errors.array()});
  }
  try {
    winston.info(`Updating task with ID: ${req.params.id} with data: ${JSON.stringify(req.body)}`);
    await taskController.updateTask(req, res, next);
  } catch (error) {
    winston.error(`Error updating this task: ${error.message}`);
    next(error);
  }
});

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the task
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", async(req, res, next) => {
  try{
    winston.info(`Deleting task with ID: ${req.params.id}`);
    await taskController.deleteTask(req, res, next);
  } catch (error) {
    winston.error(`Error deleting task with ID ${req.params.id}: ${error.message}`)
    next(error);
  }
});
module.exports = router;
