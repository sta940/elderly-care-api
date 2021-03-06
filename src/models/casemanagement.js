'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CaseManagement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CaseManagement.init({
    src: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'CaseManagement',
    freezeTableName: true
  });
  return CaseManagement;
};