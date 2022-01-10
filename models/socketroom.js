'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SocketRoom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  SocketRoom.init({
    email: DataTypes.STRING,
    room_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'SocketRoom',
  });
  return SocketRoom;
};