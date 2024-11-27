const express = require("express");
const { authenticateJWT, authorizeRoles } = require("../middleware/authMiddleware");
const router = express.Router();

router.get(
  "/employee-dashboard",
  authenticateJWT,
  authorizeRoles(["employee"]),
  (req, res) => {
    res.status(200).json({ message: "Welcome to Employee Dashboard" });
  }
);

router.get(
  "/manager-dashboard",
  authenticateJWT,
  authorizeRoles(["manager"]),
  (req, res) => {
    res.status(200).json({ message: "Welcome to Manager Dashboard" });
  }
);

router.get(
  "/finance-dashboard",
  authenticateJWT,
  authorizeRoles(["finance"]),
  (req, res) => {
    res.status(200).json({ message: "Welcome to Finance Dashboard" });
  }
);

module.exports = router;
