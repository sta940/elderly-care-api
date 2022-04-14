'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('CaseManagement', 'image');
    await queryInterface.removeColumn('CaseManagement', 'title');
    await queryInterface.removeColumn('CaseManagement', 'description');
    await queryInterface.removeColumn('CaseManagement', 'files');
    await queryInterface.addColumn('CaseManagement', 'src', {
      type: Sequelize.STRING,
      allowNull: true
    });

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('CaseManagement');
  }
};
