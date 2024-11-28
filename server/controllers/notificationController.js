const { Notification } = require('../models');

const getUserNotifications = async (req, res) => {
  const userId = req.user.id; // Extract userId from route parameter
  console.log("Received userId:", userId); // Debug

  try {
    // Query the database for notifications belonging to the user
    const notifications = await Notification.findAll({
      where: { userId }, // Fetch notifications for this user
      order: [['createdAt', 'DESC']], // Sort notifications by creation time (newest first)
    });

    // Send the notifications as a JSON response
    res.status(200).json(notifications);
  } catch (error) {
     // Handle errors and send an appropriate error response
    res.status(500).json({ error: 'Failed to fetch notifications.' });
  }
};

module.exports = { getUserNotifications };
