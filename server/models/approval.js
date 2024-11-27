const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Approval extends Model {
    static associate(models) {
      Approval.belongsTo(models.Expense, { foreignKey: 'expenseId', onDelete: 'CASCADE' });
      Approval.belongsTo(models.User, { foreignKey: 'managerId', as: 'manager' });
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
        type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
        allowNull: false,
        defaultValue: 'Pending',
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
      modelName: 'Approval',
      timestamps: true, // Automatically handles createdAt and updatedAt
    }
  );

  return Approval;
};
