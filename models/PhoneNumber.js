const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PhoneNumber = sequelize.define('PhoneNumber', {
  number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  }
}, {
  tableName: 'phone_numbers',
  timestamps: true
});

module.exports = PhoneNumber;
