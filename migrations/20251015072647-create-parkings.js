'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('parkings', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      categoryTypeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'category_types',
          key: 'id'
        }
      },
      address1: {
        type: Sequelize.STRING
      },
      address2: {
        type: Sequelize.STRING
      },
      location: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.STRING
      },
      pinCode: {
        type: Sequelize.STRING
      },
      contactNumber: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      whatApp: {
        type: Sequelize.STRING
      },
      latitude: {
        type: Sequelize.STRING
      },
      longitude: {
        type: Sequelize.STRING
      },
      openingTime: {
        type: Sequelize.STRING
      },
      closingTime: {
        type: Sequelize.STRING
      },
      closedOn: {
        type: Sequelize.TEXT
      },
      isCovered: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      vehicleTypes: {
        type: Sequelize.ENUM('bike', 'car', 'both'),
        defaultValue: 'car'
      },
      hasEVCharging: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      hasSecurity: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      hasScanCode: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      capacity: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      hourlyRate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      dailyRate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('parkings');
  }
};
