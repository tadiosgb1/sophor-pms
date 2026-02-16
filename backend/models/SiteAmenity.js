module.exports = (sequelize, Sequelize) => {
  const SiteAmenity = sequelize.define("SiteAmenity", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    site_id: { type: Sequelize.INTEGER, references: { model: "sites", key: "id" } },
    amenity_id: { type: Sequelize.INTEGER, references: { model: "amenities", key: "id" } },
    owner_id: { type: Sequelize.INTEGER, references: { model: "users", key: "id" } },
    created_by: { type: Sequelize.INTEGER, references: { model: "users", key: "id" } },
    updated_by: { type: Sequelize.INTEGER, references: { model: "users", key: "id" } }
  }, {
    tableName: "site_amenities"
  });

  SiteAmenity.associate = (db) => {
    SiteAmenity.belongsTo(db.Site, { foreignKey: "site_id" });
    SiteAmenity.belongsTo(db.Amenity, { foreignKey: "amenity_id" });
    SiteAmenity.belongsTo(db.User, { foreignKey: "owner_id" });
    SiteAmenity.belongsTo(db.User, { foreignKey: "created_by" });
    SiteAmenity.belongsTo(db.User, { foreignKey: "updated_by" });
  };

  return SiteAmenity;
};