const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('parkmate_db', 'root', 'root1234!', {
  logging: false,
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
