'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class room_participants extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  room_participants.init({
    room_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    is_blocked: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'room_participants',
  });
  return room_participants;
};