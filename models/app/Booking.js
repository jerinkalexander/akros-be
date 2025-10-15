const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const Shop = require('../admin/Shop');
const User = require('../User');
const BookingStatus = require('../bookingstatus');

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
      model: User,
      key: 'id',
    },
  },
  statusId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: BookingStatus,
      key: 'id',
    },
  },
  bookingDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  bookingTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER, // e.g., hours or days
    allowNull: true,
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  tableName: 'bookings',
  timestamps: true,
});

// Associations
Booking.belongsTo(Shop, { foreignKey: 'shopId' });
Shop.hasMany(Booking, { foreignKey: 'shopId' });

Booking.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Booking, { foreignKey: 'userId' });

Booking.belongsTo(BookingStatus, { foreignKey: 'statusId' });
BookingStatus.hasMany(Booking, { foreignKey: 'statusId' });

module.exports = Booking;
