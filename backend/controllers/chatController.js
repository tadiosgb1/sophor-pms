// controllers/chatController.js
const db = require("../models");
const { sequelize } = db;

const ChatRoom = db.ChatRoom;
const ChatMessage = db.ChatMessage;
const UserRoom = db.UserRoom;
const UserOnline = db.UserOnline;

module.exports = {

  /**
   * Get or create private room between two users (must contain BOTH users)
   */
async getOrCreateRoom(user1, user2) {
  const id1 = parseInt(user1);
  const id2 = parseInt(user2);

  // Check if room already exists using raw SQL (safe!)
  const [rooms] = await db.sequelize.query(
    `
      SELECT r.id 
      FROM ChatRooms r
      WHERE r.isGroup = false
      AND EXISTS (
        SELECT 1 FROM UserRooms ur WHERE ur.roomId = r.id AND ur.userId = :u1
      )
      AND EXISTS (
        SELECT 1 FROM UserRooms ur WHERE ur.roomId = r.id AND ur.userId = :u2
      )
      LIMIT 1;
    `,
    {
      replacements: { u1: id1, u2: id2 }
    }
  );

  // If exists, return it
  if (rooms.length > 0) {
    return await ChatRoom.findByPk(rooms[0].id);
  }

  // Otherwise create room
  const room = await ChatRoom.create({ isGroup: false });

  await UserRoom.bulkCreate([
    { userId: id1, roomId: room.id },
    { userId: id2, roomId: room.id }
  ]);

  return room;
},

  /**
   * Save message and emit to sender + receiver
   */
  async sendMessage(io, senderId, receiverId, message) {
    const room = await this.getOrCreateRoom(senderId, receiverId);

    const chat = await ChatMessage.create({
      roomId: room.id,
      senderId,
      receiverId,
      message
    });

    // Send to receiver
    const receivers = await UserOnline.findAll({ where: { userId: receiverId } });
    receivers.forEach(s => io.to(s.socketId).emit("receive_message", chat));

    // Send to sender (so sender sees own message)
    const senders = await UserOnline.findAll({ where: { userId: senderId } });
    senders.forEach(s => io.to(s.socketId).emit("receive_message", chat));

    return chat;
  },

  /**
   * Get chat history
   */
  async getRoomMessages(user1, user2) {
    const room = await this.getOrCreateRoom(user1, user2);
    return ChatMessage.findAll({
      where: { roomId: room.id },
      order: [["createdAt", "ASC"]]
    });
  }
};