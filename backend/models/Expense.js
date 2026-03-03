module.exports = (sequelize, Sequelize) => {
  const Expense = sequelize.define("Expense", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    category: { type: Sequelize.STRING },       // e.g., Rent, Utilities, etc.
    amount: { type: Sequelize.FLOAT },         // Amount of the expense
    expense_date: { type: Sequelize.DATE },    // Date of the expense
    description: { type: Sequelize.STRING },   // Optional description
    site_id: {                                 // Foreign key to Site
      type: Sequelize.INTEGER,
      references: { model: "sites", key: "id" }
    },
    created_by: { 
      type: Sequelize.INTEGER, 
      references: { model: "users", key: "id" } 
    },
    updated_by: { 
      type: Sequelize.INTEGER, 
      references: { model: "users", key: "id" } 
    }
  }, {
    tableName: "expenses" // Table name in DB
  });

  // Setup associations for FK
  Expense.associate = (db) => { 
    Expense.belongsTo(db.User, { foreignKey: "created_by", as: "creator" }); 
    Expense.belongsTo(db.User, { foreignKey: "updated_by", as: "updater" }); 
    Expense.belongsTo(db.Site, { foreignKey: "site_id", as: "site" }); // Associate with Site
  };

  return Expense;
};