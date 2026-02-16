module.exports = (sequelize, Sequelize) => {
  const Amenity = sequelize.define("Amenity", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: Sequelize.STRING },
    description: { type: Sequelize.STRING },
    owner_id: { type: Sequelize.INTEGER, references: { model: "users", key: "id" } },
    created_by: { type: Sequelize.INTEGER, references: { model: "users", key: "id" } },
    updated_by: { type: Sequelize.INTEGER, references: { model: "users", key: "id" } }
  }, {
    tableName: "amenities"
  });

  Amenity.associate = (db) => {
    Amenity.belongsTo(db.User, { foreignKey: "owner_id" });
    Amenity.belongsTo(db.User, { foreignKey: "created_by" });
    Amenity.belongsTo(db.User, { foreignKey: "updated_by" });
  };

  return Amenity;
};