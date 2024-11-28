const express = require("express");
const router = express.Router();
const { getUserProfile, updateUserProfile } = require("../controllers/userController");

// Fetch user profile
router.get("/user-profile/:userId", getUserProfile);

// Update user profile
router.put("/user-profile/:userId", updateUserProfile);

module.exports = router;
