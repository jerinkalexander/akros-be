'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_devices', {
      id: {
        type: Sequelize.STRING(255),
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      device_type: {
        type: Sequelize.ENUM('ios', 'android'),
        allowNull: false
      },
      push_token: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    }, {
      indexes: [
        { fields: ['user_id'] },
        { fields: ['is_active'] }
      ]
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_devices');
  }
};
