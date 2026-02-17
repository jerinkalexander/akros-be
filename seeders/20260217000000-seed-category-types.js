/**
 * Seeder: add initial CategoryType 'Pay & Park'
 */
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('category_types', [
      {
        name: 'Pay & Park',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('category_types', { name: 'Pay & Park' }, {});
  }
};
