'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Quality', 'image');
    await queryInterface.removeColumn('Quality', 'title');
    await queryInterface.removeColumn('Quality', 'description');
    await queryInterface.removeColumn('Quality', 'files');
    await queryInterface.addColumn('Quality', 'src', {
      type: Sequelize.STRING,
      allowNull: true
    });

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Quality');
  }
};
