const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Expense, { foreignKey: "userId" });
      User.hasMany(models.AuditLog, { foreignKey: "userId" });
      User.hasMany(models.Notification, { foreignKey: "userId" });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
          notEmpty: true,
        },
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [8, 128],
        },
      },
      role: {
        type: DataTypes.ENUM("employee", "manager", "finance"),
        allowNull: false,
      },
      department: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdBy: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      updatedBy: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
      timestamps: true,
      // paranoid: true,
      indexes: [
        {
          unique: true,
          fields: ["email", "username"],
        },
      ],
      hooks: {
        beforeCreate: async (user) => {
          try {
            const bcrypt = require("bcryptjs");
            user.password = await bcrypt.hash(user.password, 10);
          } catch (error) {
            throw new Error("Error while hashing password");
          }          
        },
        beforeUpdate: async (user) => {
          if (user.changed("password")) {
            try {
              const bcrypt = require("bcryptjs");
              user.password = await bcrypt.hash(user.password, 10);  
            } catch (error) {
              throw new Error("Error while hashing password");
            }            
          }
        },
      },
    }
  );

  return User;
};
