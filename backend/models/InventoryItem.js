module.exports = (sequelize, Sequelize) => {
  const InventoryItem = sequelize.define("InventoryItem", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    description: { type: Sequelize.STRING },
    quantity: { type: Sequelize.FLOAT },
    unit: { type: Sequelize.STRING },
    price_per_unit: { type: Sequelize.FLOAT },
    site_id: { type: Sequelize.INTEGER, references: { model: "sites", key: "id" } },
    created_by: { type: Sequelize.INTEGER, references: { model: "users", key: "id" } },
    updated_by: { type: Sequelize.INTEGER, references: { model: "users", key: "id" } }
  }, {
    tableName: "inventoryitems"
  });

  InventoryItem.associate = (db) => {
    InventoryItem.belongsTo(db.Site, { foreignKey: "site_id" });
    InventoryItem.belongsTo(db.User, { foreignKey: "created_by", as: "creator" });
    InventoryItem.belongsTo(db.User, { foreignKey: "updated_by", as: "updater" });
  };

  return InventoryItem;
};
