require("dotenv").config();
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
const ChatRoom = db.ChatRoom;
const ChatMessage = db.ChatMessage;
const UserRoom = db.UserRoom;
const UserOnline = db.UserOnline;

const app = express();
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

// --- Chat Controller ---
const ChatController = {
  async getOrCreateRoom(user1, user2) {
    const [id1, id2] = [parseInt(user1), parseInt(user2)].sort((a, b) => a - b);

    let room = await ChatRoom.findOne({
      where: { isGroup: false },
      include: [{ model: UserRoom, where: { userId: [id1, id2] } }]
    });

    if (!room) {
      room = await ChatRoom.create({ isGroup: false });
      await UserRoom.create({ userId: id1, roomId: room.id });
      await UserRoom.create({ userId: id2, roomId: room.id });
    }

    return room;
  },

  async sendMessage(io, senderId, receiverId, message) {
    const room = await this.getOrCreateRoom(senderId, receiverId);

    const chat = await ChatMessage.create({
      roomId: room.id,
      senderId,
      receiverId,
      message
    });

    // Emit to receiver(s)
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

// --- Start server ---
async function syncAndStart() {
  try {
    await db.sequelize.query("SET FOREIGN_KEY_CHECKS = 0");

    await db.User.sync();
    await ChatRoom.sync();
    await UserRoom.sync();
    await ChatMessage.sync();
    await UserOnline.sync();

    await db.sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

    await seed();

    const server = http.createServer(app);
    const io = new Server(server, { cors: { origin: "*" } });
    const onlineUsers = new Map(); // userId => socketIds

    io.on("connection", (socket) => {
      console.log("🟢 User connected:", socket.id);

      // User comes online
      socket.on("user_online", async (userId) => {
        await UserOnline.upsert({ userId, socketId: socket.id });
        const users = await UserOnline.findAll();
        io.emit("update_online", users.map(u => u.userId));
      });

      // Typing indicator
      socket.on("typing", async ({ senderId, receiverId }) => {
        console.log("user typings");
        const receivers = await UserOnline.findAll({ where: { userId: receiverId } });
        receivers.forEach(s => io.to(s.socketId).emit("user_typing", { userId: senderId }));
      });

      // Send message
      socket.on("send_message", async ({ senderId, receiverId, message }) => {

        console.log("message comes");

        await ChatController.sendMessage(io, senderId, receiverId, message);
      });

      // Join a room (optional, just for tracking)
      socket.on("join_room", async ({ user1, user2 }) => {
        const room = await ChatController.getOrCreateRoom(user1, user2);
        socket.join(room.id.toString());
      });

      // Disconnect
      socket.on("disconnect", async () => {
        await UserOnline.destroy({ where: { socketId: socket.id } });
        const users = await UserOnline.findAll();
        io.emit("update_online", users.map(u => u.userId));
      });
    });

    // API to get previous chat messages
    app.get("/api/chat/room/:user1/:user2", async (req, res) => {
      const { user1, user2 } = req.params;
      try {
        const messages = await ChatController.getRoomMessages(user1, user2);
        res.json(messages);
      } catch (err) {
        console.error(err);
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

    server.listen(PORT, () => console.log("🚀 Server running on " + PORT));
  } catch (e) {
    console.error(e);
  }
}

syncAndStart();
