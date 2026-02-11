require("dotenv").config();
const express = require("express");
const cors = require("cors");

const db = require("./models");
const seed = require("./utils/seed");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const roleRoutes = require("./routes/roleRoutes");
const permissionRoutes = require("./routes/permissionRoutes");
const companyRoutes = require("./routes/companyRoutes.js");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Mount main routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/company", companyRoutes);

const PORT = process.env.PORT || 5000;

// Sync DB in proper order
async function syncAndStart() {
  try {
    console.log("🌱 Syncing database...");

    // Temporarily disable foreign key checks
    await db.sequelize.query("SET FOREIGN_KEY_CHECKS = 0");

    // 1️⃣ Sync Role & Permission first (independent)
    //await db.Role.sync({ force: true });
//await db.Permission.sync({ force: true });
    console.log("✅ Role & Permission tables synced");

    // 2️⃣ Sync User table
    await db.User.sync({ force: true });
    console.log("✅ User table synced");

    // 3️⃣ Sync association tables
    //await db.UserRole.sync({ force: true });
    //await db.UserPermission.sync({ force: true });
    //await db.RolePermission.sync({ force: true });
    console.log("✅ Association tables synced");

    // 4️⃣ Sync Company last (depends on User)
    //await db.Company.sync({ force: true });
    console.log("✅ Company table synced");

    // Re-enable foreign key checks
    await db.sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

    // 5️⃣ Run seed
    await seed();
    console.log("🎉 Seed executed successfully");

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ DB Connection Error:", err);
  }
}


// Run the sync/start function
syncAndStart();
