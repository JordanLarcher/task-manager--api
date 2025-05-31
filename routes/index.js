const express = require('express');
const router = express.Router();
const {authenticateJWT} = require('../middleware/authMiddleware');
//Import route modules
const userRoutes = require('./userRoutes');
const taskRoutes = require('./taskRoutes');

// Mount the routers

router.use('/users', authenticateJWT, userRoutes);
router.use('/tasks', authenticateJWT, taskRoutes);

module.exports = router;