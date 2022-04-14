'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Intro', 'image');
    await queryInterface.removeColumn('Intro', 'title');
    await queryInterface.removeColumn('Intro', 'description');
    await queryInterface.addColumn('Intro', 'src', {
      type: Sequelize.STRING,
      allowNull: true
    });

    },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Reminders');
  }
};
