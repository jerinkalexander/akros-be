'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('bookings', 'parkingId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'parkings',
        key: 'id'
      }
    });

    await queryInterface.addColumn('bookings', 'duration', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    await queryInterface.changeColumn('bookings', 'shopId', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('bookings', 'parkingId');
    await queryInterface.removeColumn('bookings', 'duration');
    await queryInterface.changeColumn('bookings', 'shopId', {
      type: Sequelize.INTEGER,
      allowNull: false
    });
  }
};
