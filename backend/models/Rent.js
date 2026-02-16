module.exports = (sequelize, Sequelize) => {
  const Rent = sequelize.define("Rent", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    unit_id: { type: Sequelize.INTEGER, references: { model: "units", key: "id" } },
    site_id: { type: Sequelize.INTEGER, references: { model: "sites", key: "id" } },
    renter_id: { type: Sequelize.INTEGER, references: { model: "users", key: "id" } },
    rent_amount: { type: Sequelize.STRING },
    deposit_amount: { type: Sequelize.STRING },
    rent_period: { type: Sequelize.STRING },
    start_date: { type: Sequelize.DATE },
    next_due_date: { type: Sequelize.DATE },
    status: { type: Sequelize.STRING },
    notes: { type: Sequelize.STRING },
    owner_id: { type: Sequelize.INTEGER, references: { model: "users", key: "id" } },
    created_by: { type: Sequelize.INTEGER, references: { model: "users", key: "id" } },
    updated_by: { type: Sequelize.INTEGER, references: { model: "users", key: "id" } }
  }, {
    tableName: "rents"
  });

  Rent.associate = (db) => {
    Rent.belongsTo(db.Unit, { foreignKey: "unit_id" });
    Rent.belongsTo(db.Site, { foreignKey: "site_id" });
    Rent.belongsTo(db.User, { foreignKey: "renter_id" });
    Rent.belongsTo(db.User, { foreignKey: "owner_id" });
    Rent.belongsTo(db.User, { foreignKey: "created_by" });
    Rent.belongsTo(db.User, { foreignKey: "updated_by" });
  };

  return Rent;
};