const { Sequelize } = require("sequelize");
require("dotenv").config(); // Load environment variables from .env

// Create a new Sequelize instance
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: "postgres",
        logging: false,
        pool: {
          max: 10,
          min: 0,
          acquire: 30000,
          idle: 10000,
      },
    }
);


async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully.");
  } catch (error) {
    console.error("Database connection error:", error.message);
  }
}

testConnection();
  
module.exports = sequelize;

