module.exports = (sequelize, DataTypes) => {
  const RentPayment = sequelize.define("RentPayment", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    rent_id: {
      type: DataTypes.INTEGER, allowNull: false,
      references: { model: "rents", key: "id" }
    },

    // Who paid
    payer_id: {
      type: DataTypes.INTEGER, allowNull: true,
      references: { model: "users", key: "id" }
    },
    payer_name:  { type: DataTypes.STRING, allowNull: true },
    payer_phone: { type: DataTypes.STRING, allowNull: true },

    // Payment amount & date
    amount:       { type: DataTypes.FLOAT, allowNull: false },
    payment_date: { type: DataTypes.DATE,  allowNull: false, defaultValue: DataTypes.NOW },

    // ── CYCLE FIELDS ──────────────────────────────────────────────────────
    // The period this payment covers, e.g. 2025-01-01 → 2025-03-31 (3 months)
    cycle_from:   { type: DataTypes.DATEONLY, allowNull: false },
    cycle_to:     { type: DataTypes.DATEONLY, allowNull: false },
    cycles_count: { type: DataTypes.INTEGER,  allowNull: false, defaultValue: 1 },
    // Human-readable label, e.g. "Jan 2025", "Jan–Mar 2025", "2025"
    cycle_label:  { type: DataTypes.STRING,   allowNull: true },

    // Payment method
    payment_method: {
      type: DataTypes.ENUM("screenshot", "telebirr", "cbebirr", "bank_transfer", "cash"),
      allowNull: false,
      defaultValue: "screenshot"
    },

    // Status
    status: {
      type: DataTypes.ENUM("pending", "verified", "rejected"),
      allowNull: false,
      defaultValue: "pending"
    },

    // Online payment
    transaction_ref:  { type: DataTypes.STRING, allowNull: true },
    gateway_response: { type: DataTypes.TEXT,   allowNull: true },

    // Screenshot
    screenshot_url: { type: DataTypes.STRING, allowNull: true },

    // Verification
    verified_by:      { type: DataTypes.INTEGER, allowNull: true, references: { model: "users", key: "id" } },
    verified_at:      { type: DataTypes.DATE,    allowNull: true },
    rejection_reason: { type: DataTypes.TEXT,    allowNull: true },

    notes:      { type: DataTypes.TEXT,    allowNull: true },
    created_by: { type: DataTypes.INTEGER, allowNull: true, references: { model: "users", key: "id" } },
    updated_by: { type: DataTypes.INTEGER, allowNull: true, references: { model: "users", key: "id" } },
  }, {
    tableName: "rent_payments"
  });

  RentPayment.associate = (db) => {
    RentPayment.belongsTo(db.Rent, { foreignKey: "rent_id" });
    RentPayment.belongsTo(db.User, { foreignKey: "payer_id",    as: "payer" });
    RentPayment.belongsTo(db.User, { foreignKey: "verified_by", as: "verifier" });
    RentPayment.belongsTo(db.User, { foreignKey: "created_by",  as: "createdBy" });
    RentPayment.belongsTo(db.User, { foreignKey: "updated_by",  as: "updatedBy" });
  };

  return RentPayment;
};
