'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('user_devices', 'id', {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert to STRING if needed
    await queryInterface.changeColumn('user_devices', 'id', {
      type: Sequelize.STRING(255),
      primaryKey: true,
      allowNull: false
    });
  }
};
