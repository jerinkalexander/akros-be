const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const User = require('../User');
const Parking = require('../admin/Parking');
const BookingStatus = require('../bookingstatus');

const ParkingBooking = sequelize.define('ParkingBooking', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  parkingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Parking,
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
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Duration in hours',
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  note: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'parking_bookings',
  timestamps: true,
});

// Associations
ParkingBooking.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(ParkingBooking, { foreignKey: 'userId' });

ParkingBooking.belongsTo(Parking, { foreignKey: 'parkingId' });
Parking.hasMany(ParkingBooking, { foreignKey: 'parkingId' });

ParkingBooking.belongsTo(BookingStatus, { foreignKey: 'statusId' });
BookingStatus.hasMany(ParkingBooking, { foreignKey: 'statusId' });

module.exports = ParkingBooking;
