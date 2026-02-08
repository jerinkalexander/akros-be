'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('booking_status', [
      {
        name: 'pending',
        description: 'Booking is pending confirmation',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'confirmed',
        description: 'Booking has been confirmed',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'cancelled',
        description: 'Booking has been cancelled',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'completed',
        description: 'Booking has been completed',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('booking_status', null, {});
  }
};
