'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Message.init({
    message: DataTypes.STRING,
    creator_id: DataTypes.INTEGER,
    room_id: DataTypes.INTEGER,
    parent_message_id: DataTypes.INTEGER,
    email: DataTypes.STRING,
    sent_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};