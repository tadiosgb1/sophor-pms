require("dotenv").config();
const express = require("express");

const rentdocumentRoutes = require('./routes/rentdocumentRoutes.js');
const rentRoutes = require('./routes/rentRoutes.js');
const saledocumentRoutes = require('./routes/saledocumentRoutes.js');
const saleRoutes = require('./routes/saleRoutes.js');
const unitimageRoutes = require('./routes/unitimageRoutes.js');
const typeRoutes = require('./routes/typeRoutes.js');
const unitRoutes = require('./routes/unitRoutes.js');
const siteamenityRoutes = require('./routes/siteamenityRoutes.js');
const amenityRoutes = require('./routes/amenityRoutes.js');
const siteimageRoutes = require('./routes/siteimageRoutes.js');
const siteRoutes = require('./routes/siteRoutes.js');
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
   // await db.Site.sync({ force: true });
    //await db.SiteImage.sync({ force: true });
    //await db.Amenity.sync({ force: true });
    //await db.SiteAmenity.sync({ force: true });
   // await db.Type.sync({ force: true });
   // await db.Site.sync({ force: true });
   // await db.Unit.sync({ force: true });
     //await db.UnitImage.sync({ force: true });

   // await db.Sale.sync({ force: true });
   // await db.SaleDocument.sync({ force: true });
  //await db.Rent.sync({ force: true });
    //await db.RentDocument.sync({ force: true });
await db.ChatRoom.sync({ force: true });
await db.ChatMessage.sync({ force: true });
await db.UserOnline.sync({ force: true });

    console.log("✅ Company table synced");

    // Re-enable foreign key checks
    await db.sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

    // 5️⃣ Run seed
    await seed();
    console.log("🎉 Seed executed successfully");

    // Start server
    app.use("/api/site", siteRoutes);
    app.use("/api/siteimage", siteimageRoutes);
    app.use("/api/amenity", amenityRoutes);
    app.use("/api/siteamenity", siteamenityRoutes);
    app.use("/api/unit", unitRoutes);
app.use("/api/type", typeRoutes);



app.use("/api/unitimage", unitimageRoutes);
app.use("/api/sale", saleRoutes);
app.use("/api/saledocument", saledocumentRoutes);
app.use("/api/rent", rentRoutes);
app.use("/api/rentdocument", rentdocumentRoutes);
app.listen(PORT, () => {
          console.log(`🚀 Server running on port ${PORT}`);
        });
      } catch (err) {
        console.error("❌ DB Connection Error:", err);
      }
}


// Run the sync/start function
syncAndStart();
