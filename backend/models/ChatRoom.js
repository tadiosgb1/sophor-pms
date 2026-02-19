module.exports = (sequelize, DataTypes) => {
  const ChatRoom = sequelize.define("ChatRoom", {
    isGroup: { type: DataTypes.BOOLEAN, defaultValue: false },
    name: { type: DataTypes.STRING, allowNull: true }
  });
  ChatRoom.associate = models => {
    ChatRoom.hasMany(models.UserRoom, { foreignKey: "roomId" });
    ChatRoom.hasMany(models.ChatMessage, { foreignKey: "roomId" });
  };
  return ChatRoom;
};