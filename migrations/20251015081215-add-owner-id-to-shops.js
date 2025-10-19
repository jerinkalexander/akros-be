'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('shops', 'ownerId', {
      type: Sequelize.INTEGER,
      allowNull: true, // Allow null initially to avoid FK constraint on existing data
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('shops', 'ownerId');
  }
};
