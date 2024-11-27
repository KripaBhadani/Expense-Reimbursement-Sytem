const { Expense } = require("../models");

const submitClaim = async (req, res) => {
  const { amount, description } = req.body;

  // Validate required fields
  if (!amount || !description) {
    return res.status(400).json({ message: "Amount and description are required." });
  }

  try {
    // Create a new claim
    const newClaim = {
      userId: req.user.id, // Assuming req.user.id is populated by an auth middleware
      amount,
      description,
      receiptUrl: req.file ? req.file.path : null, // Path to the uploaded file
    };

    const expense = await Expense.create(newClaim);

    res.status(201).json({
      message: "Expense claim submitted successfully.",
      expense,
    });
  } catch (error) {
    console.error("Error submitting claim:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { submitClaim };
