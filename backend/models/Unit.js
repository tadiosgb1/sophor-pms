module.exports = (sequelize, Sequelize) => {
  const Unit = sequelize.define("Unit", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: Sequelize.STRING },
    type_id: { type: Sequelize.INTEGER, references: { model: "types", key: "id" } },
    floor: { type: Sequelize.STRING },
    house_number: { type: Sequelize.STRING },
    block_number: { type: Sequelize.STRING },
    bedrooms: { type: Sequelize.STRING },
    bathrooms: { type: Sequelize.STRING },
    size: { type: Sequelize.STRING },
    price: { type: Sequelize.STRING },
    status: { type: Sequelize.STRING },
    description: { type: Sequelize.STRING },
    site_id: { type: Sequelize.INTEGER, references: { model: "sites", key: "id" } },
    owner_id: { type: Sequelize.INTEGER, references: { model: "users", key: "id" } },
    manager_id: { type: Sequelize.INTEGER, references: { model: "users", key: "id" } },
    staff_id: { type: Sequelize.INTEGER, references: { model: "users", key: "id" } },
    created_by: { type: Sequelize.INTEGER, references: { model: "users", key: "id" } },
    updated_by: { type: Sequelize.INTEGER, references: { model: "users", key: "id" } }
  }, {
    tableName: "units"
  });

  Unit.associate = (db) => {
    Unit.belongsTo(db.Type, { foreignKey: "type_id" });
    Unit.belongsTo(db.Site, { foreignKey: "site_id" });
    Unit.belongsTo(db.User, { foreignKey: "owner_id" });
    Unit.belongsTo(db.User, { foreignKey: "manager_id" });
    Unit.belongsTo(db.User, { foreignKey: "staff_id" });
    Unit.belongsTo(db.User, { foreignKey: "created_by" });
    Unit.belongsTo(db.User, { foreignKey: "updated_by" });
  };

  return Unit;
};