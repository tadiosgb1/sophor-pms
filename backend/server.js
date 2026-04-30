require("dotenv").config();
const expenseRoutes = require('./routes/expenseRoutes.js');
const inventorytransactionRoutes = require('./routes/inventorytransactionRoutes.js');
const inventoryitemRoutes = require('./routes/inventoryitemRoutes.js');
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

// Property routes
const maintenanceRoutes = require('./routes/maintenanceRoutes.js');
const rentdocumentRoutes = require('./routes/rentdocumentRoutes.js');
const rentpaymentRoutes = require('./routes/rentpaymentRoutes.js');
const rentRoutes = require('./routes/rentRoutes.js');
const saledocumentRoutes = require('./routes/saledocumentRoutes.js');
const salepaymentRoutes = require('./routes/salepaymentRoutes.js');
const saleRoutes = require('./routes/saleRoutes.js');
const unitimageRoutes = require('./routes/unitimageRoutes.js');
const typeRoutes = require('./routes/typeRoutes.js');
const unitRoutes = require('./routes/unitRoutes.js');
const siteamenityRoutes = require('./routes/siteamenityRoutes.js');
const amenityRoutes = require('./routes/amenityRoutes.js');
const siteimageRoutes = require('./routes/siteimageRoutes.js');
const siteRoutes = require('./routes/siteRoutes.js');

// Auth and user management
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const roleRoutes = require("./routes/roleRoutes");
const permissionRoutes = require("./routes/permissionRoutes");
const companyRoutes = require("./routes/companyRoutes.js");
const dashboardRoutes = require('./routes/dashboardRoutes.js');

// Models
const db = require("./models");
const seed = require("./utils/seed");
const InventoryItem = require("./models/InventoryItem.js");

const ChatRoom = db.ChatRoom;
const ChatMessage = db.ChatMessage;
const UserRoom = db.UserRoom;
const UserOnline = db.UserOnline;

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/company", companyRoutes);

const PORT = process.env.PORT || 5000;

/* -------------------------------------------------------------------------- */
/*                               CHAT CONTROLLER                               */
/* -------------------------------------------------------------------------- */

const ChatController = {
  /**
   * Find or create a private 1-on-1 room between two users.
   * Uses raw SQL to avoid the broken Sequelize GROUP BY / HAVING approach.
   */
  async getOrCreateRoom(user1, user2) {
    const id1 = parseInt(user1);
    const id2 = parseInt(user2);

    const [rows] = await db.sequelize.query(
      `SELECT r.id
       FROM ChatRooms r
       WHERE r.isGroup = false
         AND EXISTS (SELECT 1 FROM UserRooms ur WHERE ur.roomId = r.id AND ur.userId = :u1)
         AND EXISTS (SELECT 1 FROM UserRooms ur WHERE ur.roomId = r.id AND ur.userId = :u2)
       LIMIT 1`,
      { replacements: { u1: id1, u2: id2 } }
    );

    if (rows.length > 0) {
      return ChatRoom.findByPk(rows[0].id);
    }

    const room = await ChatRoom.create({ isGroup: false });
    await UserRoom.bulkCreate([
      { userId: id1, roomId: room.id },
      { userId: id2, roomId: room.id }
    ]);
    return room;
  },

  /**
   * Persist a message and push it to both participants via their socket IDs.
   */
  async sendMessage(io, senderId, receiverId, message) {
    const room = await this.getOrCreateRoom(senderId, receiverId);

    const chat = await ChatMessage.create({
      roomId: room.id,
      senderId,
      receiverId,
      message
    });

    const plain = chat.toJSON();

    // Deliver to every active socket of receiver and sender
    const targets = await UserOnline.findAll({
      where: { userId: [senderId, receiverId] }
    });
    targets.forEach(t => io.to(t.socketId).emit("receive_message", plain));

    return plain;
  },

  /**
   * Return full message history for a conversation, oldest first.
   */
  async getRoomMessages(user1, user2) {
    const room = await this.getOrCreateRoom(user1, user2);
    return ChatMessage.findAll({
      where: { roomId: room.id },
      order: [["createdAt", "ASC"]]
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                                   SERVER                                    */
/* -------------------------------------------------------------------------- */

async function syncAndStart() {
  try {
    await db.sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
    await db.sequelize.sync({ alter: true });
    await db.sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

    await seed();

    const server = http.createServer(app);
    const io = new Server(server, { cors: { origin: "*" } });

    io.on("connection", (socket) => {
      console.log("Socket connected:", socket.id);

      // Register user as online
      socket.on("user_online", async (userId) => {
        try {
          await UserOnline.upsert({ userId: parseInt(userId), socketId: socket.id });
          const online = await UserOnline.findAll();
          io.emit("update_online", online.map(u => u.userId));
        } catch (e) { console.error("user_online error:", e.message); }
      });

      // Join the private room socket channel
      socket.on("join_room", async ({ user1, user2 }) => {
        try {
          const room = await ChatController.getOrCreateRoom(user1, user2);
          socket.join(String(room.id));
        } catch (e) { console.error("join_room error:", e.message); }
      });

      // Send a message
      socket.on("send_message", async ({ senderId, receiverId, message }) => {
        try {
          await ChatController.sendMessage(io, senderId, receiverId, message);
        } catch (e) { console.error("send_message error:", e.message); }
      });

      // Typing indicator
      socket.on("typing", async ({ senderId, receiverId }) => {
        try {
          const targets = await UserOnline.findAll({ where: { userId: receiverId } });
          targets.forEach(t =>
            io.to(t.socketId).emit("user_typing", { userId: senderId })
          );
        } catch (e) { console.error("typing error:", e.message); }
      });

      // Cleanup on disconnect
      socket.on("disconnect", async () => {
        try {
          await UserOnline.destroy({ where: { socketId: socket.id } });
          const online = await UserOnline.findAll();
          io.emit("update_online", online.map(u => u.userId));
          console.log("Socket disconnected:", socket.id);
        } catch (e) { console.error("disconnect error:", e.message); }
      });
    });

    // ── Chat REST endpoint ──────────────────────────────────────────────────
    app.get("/api/chat/history/:user1/:user2", async (req, res) => {
      try {
        const messages = await ChatController.getRoomMessages(
          req.params.user1,
          req.params.user2
        );
        res.json(messages);
      } catch (e) {
        console.error("chat history error:", e.message);
        res.status(500).json({ error: "Failed to load messages" });
      }
    });

    // Property-related routes
    app.use("/api/site", siteRoutes);
    app.use("/api/siteimage", siteimageRoutes);
    app.use("/api/amenity", amenityRoutes);
    app.use("/api/siteamenity", siteamenityRoutes);
    app.use("/api/unit", unitRoutes);
    app.use("/api/type", typeRoutes);
    app.use("/api/unitimage", unitimageRoutes);
    app.use("/api/sale", saleRoutes);
    app.use("/api/saledocument", saledocumentRoutes);
    app.use("/api/salepayment", salepaymentRoutes);
    app.use("/api/rent", rentRoutes);
    app.use("/api/rentdocument", rentdocumentRoutes);
    app.use("/api/rentpayment", rentpaymentRoutes);
// Expense and Inventory routes
    app.use("/api/maintenance", maintenanceRoutes);
    app.use("/api/expense", expenseRoutes);
    app.use("/api/inventoryitem", inventoryitemRoutes);
    app.use("/api/inventorytransaction", inventorytransactionRoutes);
    app.use("/api/dashboard", dashboardRoutes);
    server.listen(PORT, () => console.log("Server running on " + PORT));
  } catch (e) {
    console.error(e);
  }
}

syncAndStart();