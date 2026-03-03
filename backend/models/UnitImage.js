module.exports = (sequelize, Sequelize) => {
  const UnitImage = sequelize.define("UnitImage", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    unit_id: { type: Sequelize.INTEGER, references: { model: "units", key: "id" } },
    image_url: { type: Sequelize.STRING },
    owner_id: { type: Sequelize.INTEGER, references: { model: "users", key: "id" } },
    created_by: { type: Sequelize.INTEGER, references: { model: "users", key: "id" } },
    updated_by: { type: Sequelize.INTEGER, references: { model: "users", key: "id" } }
  }, {
    tableName: "unit_images"
  });

  UnitImage.associate = (db) => {
    UnitImage.belongsTo(db.Unit, { as: "unit", foreignKey: "unit_id" });
    UnitImage.belongsTo(db.User, { as: "owner", foreignKey: "owner_id" });
    UnitImage.belongsTo(db.User, { as: "createdBy", foreignKey: "created_by" });
    UnitImage.belongsTo(db.User, { as: "updatedBy", foreignKey: "updated_by" });
  };

  return UnitImage;
};