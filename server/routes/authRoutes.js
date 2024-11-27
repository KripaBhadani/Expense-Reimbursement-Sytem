const express = require("express");
const { register, login } = require("../controllers/authController");
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');
const rateLimit= require("express-rate-limit");

const router = express.Router();

// Rate limiting for login route
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: { message: "Too many login attempts, please try again later." },
});

// Middleware for input validation
const validateRegistration = (req, res, next) => {
    const { name, email, username, password, role } = req.body;

    if (!name || !email || !username || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format." });
    }

    // const validRoles = ["employee", "finance", "manager"];
    // if (!validRoles.includes(role)) {
    //     return res.status(400).json({ message: "Invalid role specified." });
    // }

    // if (password.length < 8 || !/[!@#$%^&*]/.test(password)) {
    //     return res.status(400).json({
    //         message: "Password must be at least 8 characters long and include a special character.",
    //     });
    // }

    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    next();
};

// Routes
router.post("/register", validateRegistration, register);
router.post("/login", loginLimiter, validateLogin, login);

module.exports = router;
