'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Metric extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Metric.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      })
    }
  }
  Metric.init({
    type: DataTypes.STRING,
    fields: DataTypes.JSON,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Metric',
  });
  return Metric;
};