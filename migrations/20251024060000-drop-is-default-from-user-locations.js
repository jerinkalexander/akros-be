'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Check if isDefault column exists before removing
    const tableDescription = await queryInterface.describeTable('user_locations');
    if (tableDescription.isDefault) {
      await queryInterface.removeColumn('user_locations', 'isDefault');
    }
  },

  async down (queryInterface, Sequelize) {
    // Add back the isDefault column if needed
    const tableDescription = await queryInterface.describeTable('user_locations');
    if (!tableDescription.isDefault) {
      await queryInterface.addColumn('user_locations', 'isDefault', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      });
    }
  }
};
