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

// inside models/amenity.js

Amenity.associate = (models) => {
  // Alias 'owner' for owner_id
  Amenity.belongsTo(models.User, {
    foreignKey: 'owner_id',
    as: 'owner'
  });

  // Alias 'creator' for created_by
  Amenity.belongsTo(models.User, {
    foreignKey: 'created_by',
    as: 'creator'
  });

  // Alias 'updater' for updated_by
  Amenity.belongsTo(models.User, {
    foreignKey: 'updated_by',
    as: 'updater'
  });
};

  return Amenity;
};