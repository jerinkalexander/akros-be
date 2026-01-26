'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Get the admin role
    const adminRole = await queryInterface.sequelize.query(
      'SELECT id FROM roles WHERE name = ?',
      { replacements: ['admin'], type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (!adminRole || adminRole.length === 0) {
      throw new Error('Admin role not found. Please run the role seeder first.');
    }

    const adminRoleId = adminRole[0].id;

    // Check if admin user already exists
    const existingAdmin = await queryInterface.sequelize.query(
      'SELECT id FROM users WHERE number = ?',
      { replacements: ['9809664605'], type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (existingAdmin && existingAdmin.length > 0) {
      console.log('Admin user already exists');
      return;
    }

    await queryInterface.bulkInsert('users', [
      {
        number: '9809664605',
        password: hashedPassword,
        roleId: adminRoleId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', {
      number: '9809664605'
    }, {});
  }
  
};
