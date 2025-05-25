const express = require('express');
const router = express.Router();

//Import route modules
const userRoutes = require('./userRoutes');
const taskRoutes = require('./taskRoutes');

// Mount the routers

router.use('/users', userRoutes);
router.use('/tasks', taskRoutes);

module.exports = router;