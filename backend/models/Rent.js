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
    // Allow renter to pay multiple cycles in advance
    allow_advance_payment: { type: Sequelize.BOOLEAN, defaultValue: true },
    // Max cycles allowed in one advance payment (null = unlimited)
    max_advance_cycles: { type: Sequelize.INTEGER, allowNull: true, defaultValue: 3 },
    owner_id: { type: Sequelize.INTEGER, references: { model: "users", key: "id" } },
    created_by: { type: Sequelize.INTEGER, references: { model: "users", key: "id" } },
    updated_by: { type: Sequelize.INTEGER, references: { model: "users", key: "id" } }
  }, {
    tableName: "rents"
  });

  Rent.associate = (db) => {
    Rent.belongsTo(db.Unit, { foreignKey: "unit_id" });
    Rent.belongsTo(db.Site, { foreignKey: "site_id" });
    Rent.belongsTo(db.User, { foreignKey: "renter_id", as: "renter" });
    Rent.belongsTo(db.User, { foreignKey: "owner_id", as: "owner" });
    Rent.belongsTo(db.User, { foreignKey: "created_by", as: "createdBy" });
    Rent.belongsTo(db.User, { foreignKey: "updated_by", as: "updatedBy" });

    Rent.hasMany(db.RentDocument, { foreignKey: "rent_id", as: "documents" });
    Rent.hasMany(db.RentPayment,  { foreignKey: "rent_id", as: "payments" });
  };

  return Rent;
};