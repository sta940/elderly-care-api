'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UsefulInfo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UsefulInfo.init({
    title: DataTypes.STRING,
    descr: DataTypes.STRING,
    youtubeVideoLink: DataTypes.STRING,
    list: DataTypes.JSON,
    time: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'UsefulInfo',
  });
  return UsefulInfo;
};