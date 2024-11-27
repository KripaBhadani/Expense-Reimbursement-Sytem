const fs = require("fs");
const path = require("path");
const { Sequelize } = require("sequelize");
require("dotenv").config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in .env file");
}

// Initialize Sequelize instance
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  // logging: false,
  define: {
    freezeTableName: true, // Prevent Sequelize from pluralizing table names
  },
});

// Object to hold all models
const db = {};

// Dynamically import all model files in the current directory
fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 &&
      file !== "index.js" &&
      file.slice(-3) === ".js"
  )
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize);
    db[model.name] = model;
  });

// Call associate method for each model if it exists
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Export Sequelize instance and all models
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
