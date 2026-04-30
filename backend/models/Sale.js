module.exports = (sequelize, Sequelize) => {
  const Sale = sequelize.define("Sale", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    unit_id: { type: Sequelize.INTEGER, references: { model: "units", key: "id" } },
    site_id: { type: Sequelize.INTEGER, references: { model: "sites", key: "id" } },
    buyer_id: { type: Sequelize.INTEGER, references: { model: "users", key: "id" } },
    sale_price: { type: Sequelize.STRING },
    sale_date: { type: Sequelize.DATE },
    status: { type: Sequelize.STRING },
    notes: { type: Sequelize.STRING },
    owner_id: { type: Sequelize.INTEGER, references: { model: "users", key: "id" } },
    created_by: { type: Sequelize.INTEGER, references: { model: "users", key: "id" } },
    updated_by: { type: Sequelize.INTEGER, references: { model: "users", key: "id" } }
  }, {
    tableName: "sales"
  });

  Sale.associate = (db) => {
    Sale.belongsTo(db.Unit, { foreignKey: "unit_id" });
    Sale.belongsTo(db.Site, { foreignKey: "site_id" });
    
    // User associations MUST use 'as'
    Sale.belongsTo(db.User, { foreignKey: "buyer_id", as: "buyer" });
    Sale.belongsTo(db.User, { foreignKey: "owner_id", as: "owner" });
    Sale.belongsTo(db.User, { foreignKey: "created_by", as: "createdBy" });
    Sale.belongsTo(db.User, { foreignKey: "updated_by", as: "updatedBy" });

    // SaleDocument association
    Sale.hasMany(db.SaleDocument, { foreignKey: "sale_id", as: "documents" });
    Sale.hasMany(db.SalePayment,  { foreignKey: "sale_id", as: "payments" });
  };

  return Sale;
};