module.exports = (sequelize, Sequelize) => {
  const Site = sequelize.define("Site", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: Sequelize.STRING },
    description: { type: Sequelize.STRING },
    type_id: { type: Sequelize.INTEGER, references: { model: "types", key: "id" } },
    status: { type: Sequelize.STRING },
    latitude: { type: Sequelize.STRING },
    longitude: { type: Sequelize.STRING },
    country: { type: Sequelize.STRING },
    state: { type: Sequelize.STRING },
    city: { type: Sequelize.STRING },
    sub_city: { type: Sequelize.STRING },
    street: { type: Sequelize.STRING },
    postal_code: { type: Sequelize.STRING },
    area_size: { type: Sequelize.STRING },
    capacity: { type: Sequelize.STRING },
    contact_phone: { type: Sequelize.STRING },
    contact_email: { type: Sequelize.STRING },
    manager_id: { type: Sequelize.INTEGER, references: { model: "users", key: "id" } },
    staff_id: { type: Sequelize.INTEGER, references: { model: "users", key: "id" } },
    owner_id: { type: Sequelize.INTEGER, references: { model: "users", key: "id" } },
    created_by: { type: Sequelize.INTEGER, references: { model: "users", key: "id" } },
    updated_by: { type: Sequelize.INTEGER, references: { model: "users", key: "id" } }
  }, {
    tableName: "sites"
  });

  Site.associate = (db) => {
    Site.belongsTo(db.Type, { foreignKey: "type_id" });
    Site.belongsTo(db.User, { foreignKey: "manager_id" });
    Site.belongsTo(db.User, { foreignKey: "staff_id" });
    Site.belongsTo(db.User, { foreignKey: "owner_id" });
    Site.belongsTo(db.User, { foreignKey: "created_by" });
    Site.belongsTo(db.User, { foreignKey: "updated_by" });
  };

  return Site;
};