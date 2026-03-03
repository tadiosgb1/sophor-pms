
module.exports = (sequelize, Sequelize) => {
  const InventoryTransaction = sequelize.define("InventoryTransaction", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    action: { type: Sequelize.STRING },
    quantity: { type: Sequelize.FLOAT },
    note: { type: Sequelize.STRING },
    transaction_date: { type: Sequelize.DATE },
    created_by: { type: Sequelize.INTEGER, references: { model: "users", key: "id" } }
  }, {
    tableName: "inventory_item_transactions"
  });

  // Setup associations for FK
  InventoryTransaction.associate = (db) => { InventoryTransaction.belongsTo(db.User, { foreignKey: "created_by" }); };

  return InventoryTransaction;
};
