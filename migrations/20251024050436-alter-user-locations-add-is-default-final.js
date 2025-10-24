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
    await queryInterface.removeColumn('user_locations', 'isDefault');

    // Add back unique constraint on userId
    await queryInterface.addConstraint('user_locations', {
      fields: ['userId'],
      type: 'unique',
      name: 'user_locations_userId_uk'
    });
  }
};
