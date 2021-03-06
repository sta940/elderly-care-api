'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Intro extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Intro.init({
    src: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Intro',
    freezeTableName: true
  });
  return Intro;
};