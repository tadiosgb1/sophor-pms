module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define(
    "Company",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: DataTypes.STRING,
      address: DataTypes.STRING,
      latitude: DataTypes.STRING,
      longitude: DataTypes.STRING,
      phone: DataTypes.STRING,
      official_email: DataTypes.STRING,
      website: DataTypes.STRING,
      logo: DataTypes.STRING,
      facebook: DataTypes.STRING,
      instagram: DataTypes.STRING,
      linkedin: DataTypes.STRING,
      twitter: DataTypes.STRING,
      telegram: DataTypes.STRING,
      description: DataTypes.STRING,
      owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users", // lowercase plural, exactly your table name
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    }
    },
    {
      tableName: "companies",
      freezeTableName: true, // exact table name
      underscored: true,     // converts camelCase to snake_case in DB
      timestamps: true,
    }
  );

  Company.associate = (db) => {
    Company.belongsTo(db.User, { foreignKey: "owner_id" });
  };

  return Company;
};
