module.exports = (sequelize, DataTypes) => {
  const MaintenanceRequest = sequelize.define("MaintenanceRequest", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    priority: { type: DataTypes.ENUM("low", "medium", "high", "urgent"), defaultValue: "medium" },
    status: { type: DataTypes.ENUM("pending", "in_progress", "resolved", "rejected"), defaultValue: "pending" },
    category: { type: DataTypes.STRING }, // e.g. plumbing, electrical, structural
    unit_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: "units", key: "id" } },
    site_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: "sites", key: "id" } },
    requested_by: { type: DataTypes.INTEGER, references: { model: "users", key: "id" } }, // renter/buyer
    assigned_to: { type: DataTypes.INTEGER, allowNull: true, references: { model: "users", key: "id" } }, // staff/manager
    owner_id: { type: DataTypes.INTEGER, references: { model: "users", key: "id" } },
    resolved_at: { type: DataTypes.DATE, allowNull: true },
    notes: { type: DataTypes.TEXT, allowNull: true },
    created_by: { type: DataTypes.INTEGER, references: { model: "users", key: "id" } },
    updated_by: { type: DataTypes.INTEGER, allowNull: true, references: { model: "users", key: "id" } },
  }, {
    tableName: "maintenance_requests"
  });

  MaintenanceRequest.associate = (db) => {
    MaintenanceRequest.belongsTo(db.Unit, { foreignKey: "unit_id", as: "unit" });
    MaintenanceRequest.belongsTo(db.Site, { foreignKey: "site_id", as: "site" });
    MaintenanceRequest.belongsTo(db.User, { foreignKey: "requested_by", as: "requester" });
    MaintenanceRequest.belongsTo(db.User, { foreignKey: "assigned_to", as: "assignee" });
    MaintenanceRequest.belongsTo(db.User, { foreignKey: "owner_id", as: "owner" });
    MaintenanceRequest.belongsTo(db.User, { foreignKey: "created_by", as: "createdBy" });
    MaintenanceRequest.belongsTo(db.User, { foreignKey: "updated_by", as: "updatedBy" });
  };

  return MaintenanceRequest;
};
