'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    
      this.hasMany(models.room_participants,{
        foreignKey: "user_id",
        constraints: false
      })
     
      this.hasMany(models.Message,{
        foreignKey: "creator_id"
      })


      // Project.hasOne(User)
      // Project.hasMany(User, {as: 'Workers'})

    }
  };
  user.init({
    tenant_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    is_tenant: DataTypes.INTEGER,
    requestIsActive: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};
