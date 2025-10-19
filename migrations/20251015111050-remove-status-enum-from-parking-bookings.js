'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('parking_bookings', 'status');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('parking_bookings', 'status', {
      type: Sequelize.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
      defaultValue: 'pending'
    });
  }
};
