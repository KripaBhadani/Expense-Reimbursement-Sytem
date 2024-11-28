const { Notification } = require('../models');

const logNotification = async ({ userId, expenseId, notificationType, message, sentAt = null }) => {
  try {
    await Notification.create({
      userId,
      expenseId,
      notificationType,
      message,
      status: 'Unread',
      sentAt,
    });
    console.log('Notification logged successfully.');
  } catch (error) {
    console.error('Error logging notification:', error);
  }
};

module.exports = logNotification;
