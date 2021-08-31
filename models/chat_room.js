'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chat_room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Chat_room.init({
    room_name: DataTypes.STRING,
    is_active: DataTypes.INTEGER,
    tenant_id: DataTypes.INTEGER,
    last_message_update_at: DataTypes.DATE,
    last_message: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Chat_room',
  });
  return Chat_room;
};