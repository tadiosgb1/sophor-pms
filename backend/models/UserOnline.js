module.exports = (sequelize, DataTypes) => {
  const UserOnline = sequelize.define("UserOnline", {
    userId: DataTypes.INTEGER,
    socketId: DataTypes.STRING
  });
  return UserOnline;
};
