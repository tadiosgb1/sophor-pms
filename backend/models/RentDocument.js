module.exports = (sequelize, Sequelize) => {
  const RentDocument = sequelize.define("RentDocument", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    rent_id: { type: Sequelize.INTEGER, references: { model: "rents", key: "id" } },
    document_name: { type: Sequelize.STRING },
    document_url: { type: Sequelize.STRING },
    owner_id: { type: Sequelize.INTEGER, references: { model: "users", key: "id" } },
    created_by: { type: Sequelize.INTEGER, references: { model: "users", key: "id" } }
  }, {
    tableName: "rent_documents"
  });

  RentDocument.associate = (db) => {
    RentDocument.belongsTo(db.Rent, { foreignKey: "rent_id", as: "rent" });
    RentDocument.belongsTo(db.User, { foreignKey: "owner_id", as: "owner" });
    RentDocument.belongsTo(db.User, { foreignKey: "created_by", as: "createdBy" });
  };

  return RentDocument;
};