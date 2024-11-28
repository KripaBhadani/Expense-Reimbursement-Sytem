const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { Op } = require("sequelize");
require("dotenv").config();

const validRoles = ["employee", "finance", "manager"];

exports.register = async (req, res) => {
    const { name, email, username, password, role, createdBy } = req.body;

    // Password validation: at least 8 characters, includes uppercase, lowercase, a digit, and a special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            message:
                "Password must be at least 8 characters, include upper and lower case letters, a number, and a special character."
            });
    }

    try {
        // Check if the email or username is already registered
        const existingUser = await User.findOne({ 
            where: { [Op.or]: [{ email: email.trim() }, { username: username.trim() }] } 
        });
        if (existingUser) {
            return res.status(400).json({ message: "Email or username already exists" });
        }

       
        // Create the user with default 'employee' role if invalid role is provided
        const userRole = validRoles.includes(role) ? role : 'employee';

         // Create new user in the database
        const newUser = await User.create({
            name,
            email: email.trim(),
            username: username.trim(),
            password,
            role: userRole,  // Set role to default 'employee' if not provided or invalid
            // createdBy: newUser.id,
        });

        // Generate JWT Token
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email, role: newUser.role },
            process.env.SECRET_KEY,
            { expiresIn: "1h" }
        );

        // Send response with the newly created user (avoid sending sensitive data like password)
        res.status(201).json({
            message: "Registration successful",
            token,
            role: newUser.role,
            redirectTo: `/dashboard/${newUser.role.toLowerCase()}`,
        });
    } catch (error) {
        console.error("Error in register:", error); // Log the error for debugging
        res.status(500).json({ message: "An unexpected error occurred" });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ where: { email: email.trim() } });

        // If no user is found
        if (!user) {
            return res.status(401).json({ message: "User Not Found" });
        }
        
        //Check if password matches
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate a JWT token on successful login
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.SECRET_KEY,
            { expiresIn: "1h" }
        );

        // Send the JWT token as response
        res.status(200).json({ 
            message: 'Login Successful',
            token,
            role: user.role,
            redirectTo: `/dashboard/${user.role.toLowerCase()}`,
        });
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ message: "An unexpected error occurred" });
    }
};