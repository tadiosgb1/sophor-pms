module.exports = (sequelize, Sequelize) => {
  const SiteImage = sequelize.define("SiteImage", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    site_id: { type: Sequelize.INTEGER, references: { model: "sites", key: "id" } },
    image_url: { type: Sequelize.STRING },
    owner_id: { type: Sequelize.INTEGER, references: { model: "users", key: "id" } },
    created_by: { type: Sequelize.INTEGER, references: { model: "users", key: "id" } },
    updated_by: { type: Sequelize.INTEGER, references: { model: "users", key: "id" } }
  }, {
    tableName: "site_images"
  });

  SiteImage.associate = (db) => {
    SiteImage.belongsTo(db.Site, { foreignKey: "site_id" });
    SiteImage.belongsTo(db.User, { foreignKey: "owner_id" });
    SiteImage.belongsTo(db.User, { foreignKey: "created_by" });
    SiteImage.belongsTo(db.User, { foreignKey: "updated_by" });
  };

  return SiteImage;
};