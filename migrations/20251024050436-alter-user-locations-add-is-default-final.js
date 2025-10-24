'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Check if isDefault column already exists
    const tableDescription = await queryInterface.describeTable('user_locations');
    if (!tableDescription.isDefault) {
      await queryInterface.addColumn('user_locations', 'isDefault', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      });
    }

    // Remove unique constraint on userId to allow multiple locations per user
    // First check if the constraint exists
    const constraints = await queryInterface.showConstraint('user_locations');
    const userIdConstraint = constraints.find(c => c.constraintName === 'user_locations_userId_uk');
    if (userIdConstraint) {
      await queryInterface.removeConstraint('user_locations', 'user_locations_userId_uk');
    }
  },

  async down (queryInterface, Sequelize) {
    // Check if isDefault column exists before removing
    const tableDescription = await queryInterface.describeTable('user_locations');
    if (tableDescription.isDefault) {
      await queryInterface.removeColumn('user_locations', 'isDefault');
    }

    // Note: We don't add back the unique constraint on userId in down migration
    // because the original create migration doesn't have it anymore
  }
};
