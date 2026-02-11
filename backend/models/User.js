module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      first_name: DataTypes.STRING,
      middle_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      phone: DataTypes.STRING,
      email: { type: DataTypes.STRING, unique: true },
      address:DataTypes.STRING,
      password: DataTypes.STRING,
      resetToken: DataTypes.STRING,
      resetTokenExpiry: DataTypes.DATE,

      // NEW FIELD
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: true, // can be null
        references: {
          model: "users", // MUST match the actual table name (lowercase)
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL" // if creator is deleted, user remains
      }
    },
    {
      tableName: "users",
      freezeTableName: true,
      underscored: true
    }
  );

  User.associate = models => {
    // existing relations
    User.belongsToMany(models.Role, { through: "UserRoles" });
    User.belongsToMany(models.Permission, { through: "UserPermissions" });

    // SELF RELATION (creator)
    User.belongsTo(models.User, {
      as: "creator",
      foreignKey: "createdBy"
    });

    User.hasMany(models.User, {
      as: "createdUsers",
      foreignKey: "createdBy"
    });
  };

  return User;
};
