require("dotenv").config();
const expenseRoutes = require('./routes/expenseRoutes.js');
const inventorytransactionRoutes = require('./routes/inventorytransactionRoutes.js');
const inventoryitemRoutes = require('./routes/inventoryitemRoutes.js');
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

// Property routes
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

// Auth and user management
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const roleRoutes = require("./routes/roleRoutes");
const permissionRoutes = require("./routes/permissionRoutes");
const companyRoutes = require("./routes/companyRoutes.js");

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
  /** FIXED: Works in MySQL with clean JOIN */
  async getOrCreateRoom(user1, user2) {
    const id1 = parseInt(user1);
    const id2 = parseInt(user2);

    const room = await ChatRoom.findOne({
      where: { isGroup: false },
      include: [
        {
          model: UserRoom,
          where: { userId: [id1, id2] },
          required: true
        }
      ],
      group: ["ChatRoom.id"],
      having: db.sequelize.literal(
        `COUNT(UserRooms.userId) = 2`
      )
    });

    if (room) return room;

    // Create room
    const newRoom = await ChatRoom.create({ isGroup: false });

    await UserRoom.bulkCreate([
      { userId: id1, roomId: newRoom.id },
      { userId: id2, roomId: newRoom.id }
    ]);

    return newRoom;
  },

  async sendMessage(io, senderId, receiverId, message) {
    const room = await this.getOrCreateRoom(senderId, receiverId);

    const chat = await ChatMessage.create({
      roomId: room.id,
      senderId,
      receiverId,
      message
    });

    // Emit to receiver
    const receivers = await UserOnline.findAll({ where: { userId: receiverId } });
    receivers.forEach(s => io.to(s.socketId).emit("receive_message", chat));

    // Emit back to sender
    const senders = await UserOnline.findAll({ where: { userId: senderId } });
    senders.forEach(s => io.to(s.socketId).emit("receive_message", chat));

    return chat;
  },

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

    // await db.User.sync();
    // await ChatRoom.sync();
    // await UserRoom.sync();
    // await ChatMessage.sync();
    // await UserOnline.sync();
//      await db.Expense.sync();
//     await db.InventoryItem.sync();
// await db.InventoryTransaction.sync();
    await db.sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

    await seed();

    const server = http.createServer(app);
    const io = new Server(server, { cors: { origin: "*" } });

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      socket.on("user_online", async (userId) => {
        await UserOnline.upsert({ userId, socketId: socket.id });
        const users = await UserOnline.findAll();
        io.emit("update_online", users.map(u => u.userId));
      });

      socket.on("typing", async ({ senderId, receiverId }) => {
        const receivers = await UserOnline.findAll({ where: { userId: receiverId } });
        receivers.forEach(s =>
          io.to(s.socketId).emit("user_typing", { userId: senderId })
        );
      });

      socket.on("send_message", async ({ senderId, receiverId, message }) => {
        await ChatController.sendMessage(io, senderId, receiverId, message);
      });

      socket.on("join_room", async ({ user1, user2 }) => {
        const room = await ChatController.getOrCreateRoom(user1, user2);
        socket.join(String(room.id));
      });

      socket.on("disconnect", async () => {
        await UserOnline.destroy({ where: { socketId: socket.id } });
        const users = await UserOnline.findAll();
        io.emit("update_online", users.map(u => u.userId));
      });
    });

    // Get chat history
    app.get("/api/chat/room/:user1/:user2", async (req, res) => {
      try {
        const messages = await ChatController.getRoomMessages(
          req.params.user1,
          req.params.user2
        );
        res.json(messages);
      } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Server error" });
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
    app.use("/api/rent", rentRoutes);
    app.use("/api/rentdocument", rentdocumentRoutes);
// Expense and Inventory routes
    app.use("/api/expense", expenseRoutes);
    app.use("/api/inventoryitem", inventoryitemRoutes);
    app.use("/api/inventorytransaction", inventorytransactionRoutes);
    server.listen(PORT, () => console.log("Server running on " + PORT));
  } catch (e) {
    console.error(e);
  }
}

syncAndStart();