module.exports = (sequelize, DataTypes) => {
  const UserRoom = sequelize.define("UserRoom", {
    userId: DataTypes.INTEGER,
    roomId: DataTypes.INTEGER
  });
  UserRoom.associate = models => {
    UserRoom.belongsTo(models.ChatRoom, { foreignKey: "roomId" });
  };
  return UserRoom;
};
