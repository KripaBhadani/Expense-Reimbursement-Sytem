const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class AuditLog extends Model {
    static associate(models) {
      AuditLog.belongsTo(models.User, { foreignKey: "userId" });
    }
  }

  AuditLog.init(
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
      tableName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      recordId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      fieldChanged: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      oldValue: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      newValue: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      actionType: {
        type: DataTypes.ENUM("Create", "Update", "Delete"),
        allowNull: false,
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "AuditLog",
      timestamps: false,
    }
  );

  return AuditLog;
};
