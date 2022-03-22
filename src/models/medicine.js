'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Medicine extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Medicine.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      })
    }
  }
  Medicine.init({
    name: DataTypes.STRING,
    time: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    dosage: DataTypes.INTEGER,
    days: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'Medicine',
  });
  return Medicine;
};