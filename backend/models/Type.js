module.exports = (sequelize, Sequelize) => {
  const Type = sequelize.define("Type", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: Sequelize.STRING },
    category: { type: Sequelize.STRING },
    owner_id: { type: Sequelize.INTEGER, references: { model: "users", key: "id" } },
    created_by: { type: Sequelize.INTEGER, references: { model: "users", key: "id" } },
    updated_by: { type: Sequelize.INTEGER, references: { model: "users", key: "id" } }
  }, {
    tableName: "types"
  });

  Type.associate = (db) => {
    Type.belongsTo(db.User, { foreignKey: "owner_id" });
    Type.belongsTo(db.User, { foreignKey: "created_by" });
    Type.belongsTo(db.User, { foreignKey: "updated_by" });
  };

  return Type;
};