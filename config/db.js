const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('otp_db', 'root', 'root1234!', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
