const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Approval extends Model {
    static associate(models) {
      Approval.belongsTo(models.Expense, { foreignKey: "expenseId" });
    }
  }

  Approval.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      expenseId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      managerId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
        allowNull: false,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      requestedInfo: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
      },
      approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      updatedBy: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Approval",
      timestamps: true,
    }
  );

  return Approval;
};
