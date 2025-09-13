'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('entities', {
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
    await queryInterface.dropTable('entities');
  }
};