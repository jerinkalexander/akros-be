'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('parking_bookings', 'statusId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'booking_statuses',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('parking_bookings', 'statusId');
  }
};
