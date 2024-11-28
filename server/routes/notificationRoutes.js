const express = require('express');
const { authenticateJWT } = require('../middleware/authMiddleware');
const { getUserNotifications } = require('../controllers/notificationController');

const router = express.Router();

// Define a route to fetch notifications for a specific user
router.get('/:userId', authenticateJWT, getUserNotifications);

module.exports = router;
