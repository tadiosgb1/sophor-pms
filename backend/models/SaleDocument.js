module.exports = (sequelize, Sequelize) => {
  const SaleDocument = sequelize.define("SaleDocument", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    sale_id: { type: Sequelize.INTEGER, references: { model: "sales", key: "id" } },
    document_name: { type: Sequelize.STRING },
    document_url: { type: Sequelize.STRING },
    owner_id: { type: Sequelize.INTEGER, references: { model: "users", key: "id" } },
    created_by: { type: Sequelize.INTEGER, references: { model: "users", key: "id" } }
  }, {
    tableName: "sale_documents"
  });

  SaleDocument.associate = (db) => {
    SaleDocument.belongsTo(db.Sale, { foreignKey: "sale_id" });
    SaleDocument.belongsTo(db.User, { foreignKey: "owner_id" });
    SaleDocument.belongsTo(db.User, { foreignKey: "created_by" });
  };

  return SaleDocument;
};