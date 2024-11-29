const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const { sequelize } = require("./models"); // Import models and Sequelize instance
const authRoutes = require("./routes/authRoutes");
const claimRoutes = require("./routes/claimsRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const reportsRoutes = require("./routes/reportRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Middleware
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true })); // Update origin as needed
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes); // Auth routes
app.use("/api/claims", claimRoutes); // Modularized expense routes with JWT authentication
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api", userRoutes);

// Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: "Internal Server Error" });
});

// Database synchronization
sequelize
    .sync({ logging: false, force: false })
    .then(() => console.log("Database connected and models synced"))
    .catch((err) => console.error("DB connection error:", err));

module.exports = app;