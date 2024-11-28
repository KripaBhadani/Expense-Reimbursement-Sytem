  const { Model, DataTypes } = require("sequelize");

  module.exports = (sequelize) => {
    class Expense extends Model {
      static associate(models) {
        Expense.belongsTo(models.User, { foreignKey: "userId" });
        Expense.hasMany(models.Approval, { foreignKey: "expenseId" });
        Expense.hasMany(models.Notification, { foreignKey: 'expenseId' });

      }
    }

    Expense.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        amount: {
          type: DataTypes.DECIMAL,
          allowNull: false,
          validate: {
            min: {
              args: [0.01],
              msg: "Amount must be greater than zero",
            },
          },
        },
        category: {
          type: DataTypes.ENUM('Travel', 'Meals', 'Accommodation', 'Supplies', 'Office', 'Training', 'Entertainment', 'Technology', 'Medical', 'Other'), 
          allowNull: false,
        },        
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
          validate: {
            notEmpty: {
              msg: "Description is required.",
            },
          },
        },
        receipt: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        status: {
          type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
          defaultValue: "Pending",
          allowNull: false,
        },
        requestedInfo: {
          type: DataTypes.TEXT,
          allowNull: true, // Only added if managers request additional information
        },
        submittedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        approvedAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        approvedBy: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        rejectedAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        rejectedBy: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        financeProcessed: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        financeProcessedAt: {
          type: DataTypes.DATE,
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
        modelName: "Expense",
        timestamps: true,
      }
    );

    return Expense;
  };
