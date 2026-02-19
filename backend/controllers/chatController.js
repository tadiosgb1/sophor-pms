// controllers/chatController.js
const db = require("../models");
const ChatRoom = db.ChatRoom;
const ChatMessage = db.ChatMessage;
const UserRoom = db.UserRoom;
const UserOnline = db.UserOnline;

/**
 * Get or create a private room between two users
 */
async function getOrCreateRoom(user1, user2) {
  const users = [parseInt(user1), parseInt(user2)].sort();

  let room = await ChatRoom.findOne({
    where: { isGroup: false },
    include: [
      {
        model: UserRoom,
        where: { userId: users }
      }
    ]
  });

  if (!room) {
    room = await ChatRoom.create({ isGroup: false });
    await UserRoom.bulkCreate([
      { userId: users[0], roomId: room.id },
      { userId: users[1], roomId: room.id }
    ]);
  }

  return room;
}

/**
 * Save a message and emit to receiver only
 */
async function sendMessage(io, senderId, receiverId, message) {
  const room = await getOrCreateRoom(senderId, receiverId);

  const msg = await ChatMessage.create({
    roomId: room.id,
    senderId,
    message
  });

 const participants = await UserOnline.findAll({
  where: { userId: [senderId, receiverId] } // fetch both
});
participants.forEach(s => {
  io.to(s.socketId).emit("receive_message", chat);
});

  return msg;
}

/**
 * Get chat history between two users
 */
async function getChatHistory(user1, user2) {
  const room = await getOrCreateRoom(user1, user2);
  return await ChatMessage.findAll({
    where: { roomId: room.id },
    order: [["createdAt", "ASC"]]
  });
}

module.exports = { getOrCreateRoom, sendMessage, getChatHistory };
