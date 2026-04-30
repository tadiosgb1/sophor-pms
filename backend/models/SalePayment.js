module.exports = (sequelize, DataTypes) => {
  const SalePayment = sequelize.define("SalePayment", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    sale_id: {
      type: DataTypes.INTEGER, allowNull: false,
      references: { model: "sales", key: "id" }
    },

    // Who paid
    payer_id: {
      type: DataTypes.INTEGER, allowNull: true,
      references: { model: "users", key: "id" }
    },
    payer_name:  { type: DataTypes.STRING, allowNull: true },  // manual entry if payer not a user
    payer_phone: { type: DataTypes.STRING, allowNull: true },

    // Payment details
    amount:          { type: DataTypes.FLOAT, allowNull: false },
    payment_date:    { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },

    // Method: screenshot | telebirr | cbebirr | bank_transfer | cash
    payment_method:  {
      type: DataTypes.ENUM("screenshot", "telebirr", "cbebirr", "bank_transfer", "cash"),
      allowNull: false,
      defaultValue: "screenshot"
    },

    // Type: full | partial | installment | deposit
    payment_type: {
      type: DataTypes.ENUM("full", "partial", "installment", "deposit"),
      allowNull: false,
      defaultValue: "partial"
    },

    // Status: pending | verified | rejected
    status: {
      type: DataTypes.ENUM("pending", "verified", "rejected"),
      allowNull: false,
      defaultValue: "pending"
    },

    // For online payments (Telebirr, CBE Birr, etc.)
    transaction_ref:  { type: DataTypes.STRING, allowNull: true },  // TxRef from gateway
    gateway_response: { type: DataTypes.TEXT,   allowNull: true },  // raw JSON from gateway

    // For screenshot-based payments
    screenshot_url: { type: DataTypes.STRING, allowNull: true },

    // Verification
    verified_by: {
      type: DataTypes.INTEGER, allowNull: true,
      references: { model: "users", key: "id" }
    },
    verified_at:    { type: DataTypes.DATE,   allowNull: true },
    rejection_reason: { type: DataTypes.TEXT, allowNull: true },

    notes:      { type: DataTypes.TEXT,    allowNull: true },
    created_by: { type: DataTypes.INTEGER, allowNull: true, references: { model: "users", key: "id" } },
    updated_by: { type: DataTypes.INTEGER, allowNull: true, references: { model: "users", key: "id" } },
  }, {
    tableName: "sale_payments"
  });

  SalePayment.associate = (db) => {
    SalePayment.belongsTo(db.Sale, { foreignKey: "sale_id" });
    SalePayment.belongsTo(db.User, { foreignKey: "payer_id",    as: "payer" });
    SalePayment.belongsTo(db.User, { foreignKey: "verified_by", as: "verifier" });
    SalePayment.belongsTo(db.User, { foreignKey: "created_by",  as: "createdBy" });
    SalePayment.belongsTo(db.User, { foreignKey: "updated_by",  as: "updatedBy" });
  };

  return SalePayment;
};
