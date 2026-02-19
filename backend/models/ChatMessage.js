module.exports = (sequelize, DataTypes) => {
  const ChatMessage = sequelize.define("ChatMessage", {
    roomId: DataTypes.INTEGER,
    senderId: DataTypes.INTEGER,
    message: DataTypes.TEXT
  });
  return ChatMessage;
};