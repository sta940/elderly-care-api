'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Info extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Info.init({
    image: DataTypes.STRING,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    files: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'Info',
    freezeTableName: true
  });
  return Info;
};