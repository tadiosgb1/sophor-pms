module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      first_name: DataTypes.STRING,
      middle_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      phone: DataTypes.STRING,
      email: { 
        type: DataTypes.STRING, 
        allowNull: false 
      },
      address: DataTypes.STRING,
      password: DataTypes.STRING,
      resetToken: DataTypes.STRING,
      resetTokenExpiry: DataTypes.DATE,

      owner_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      updated_by: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      tableName: "users",
      freezeTableName: true,
      underscored: true,
      // Fixes ER_TOO_MANY_KEYS by giving the unique constraint a fixed name
      indexes: [
        {
          name: "users_email_unique",
          unique: true,
          fields: ["email"]
        }
      ]
    }
  );

  User.associate = (models) => {
    // Role & Permission associations
    User.belongsToMany(models.Role, { through: "UserRoles" });
    User.belongsToMany(models.Permission, { through: "UserPermissions" });

    // Self-referencing Creator association (Using snake_case created_by)
    User.belongsTo(models.User, {
      as: "creator",
      foreignKey: "created_by",
      onDelete: "SET NULL",
      onUpdate: "CASCADE"
    });

    User.hasMany(models.User, {
      as: "createdUsers",
      foreignKey: "created_by"
    });

    // Self-referencing Updater association
    User.belongsTo(models.User, {
      as: "updater",
      foreignKey: "updated_by",
      onDelete: "SET NULL",
      onUpdate: "CASCADE"
    });

    // Self-referencing Owner association
    User.belongsTo(models.User, {
      as: "owner",
      foreignKey: "owner_id",
      onDelete: "SET NULL",
      onUpdate: "CASCADE"
    });
  };

  return User;
};