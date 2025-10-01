const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const Shop = require('../admin/Shop');
const PhoneNumber = require('../User');

const Booking = sequelize.define('Booking', {
  shopId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Shop,
      key: 'id',
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: PhoneNumber,
      key: 'id',
    },
  },
  bookingDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  bookingTime: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  tableName: 'bookings',
  timestamps: true,
});

Booking.belongsTo(Shop, { foreignKey: 'shopId' });
Shop.hasMany(Booking, { foreignKey: 'shopId' });

Booking.belongsTo(PhoneNumber, { foreignKey: 'userId' });
PhoneNumber.hasMany(Booking, { foreignKey: 'userId' });

module.exports = Booking;
