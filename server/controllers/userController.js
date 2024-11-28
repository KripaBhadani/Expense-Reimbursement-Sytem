const db = require("../models"); // Sequelize or ORM integration
const User = db.User; // Assuming you have a User model

// Fetch user profile by userId
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId); // Replace with your DB query logic

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user); // Send user data as JSON
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Failed to fetch user profile." });
  }
};

// Update user profile by userId
const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user data
    user.name = name;
    user.email = email;

    await user.save(); // Save changes to the database

    res.json(user); // Send updated user data as JSON
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Failed to update user profile." });
  }
};

module.exports = { getUserProfile, updateUserProfile };
