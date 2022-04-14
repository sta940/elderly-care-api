'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Info', 'image');
    await queryInterface.removeColumn('Info', 'title');
    await queryInterface.removeColumn('Info', 'description');
    await queryInterface.removeColumn('Info', 'files');
    await queryInterface.addColumn('Info', 'src', {
      type: Sequelize.STRING,
      allowNull: true
    });

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Info');
  }
};
