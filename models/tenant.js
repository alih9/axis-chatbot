'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tenant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  tenant.init({
    name: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    sub: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true ,required:true},
    password:  { type: DataTypes.STRING ,required:true},
    phone: DataTypes.STRING,
    is_active: DataTypes.INTEGER,
    is_blocked: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'tenant',
  });
  return tenant;
};