const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const BookingStatus = sequelize.define('BookingStatus', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'booking_statuses',
  timestamps: true,
});

module.exports = BookingStatus;
