const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const Entity = require('../admin/Shop');
const PhoneNumber = require('../User');

const Booking = sequelize.define('Booking', {
  entityId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Entity,
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
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
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

Booking.belongsTo(Entity, { foreignKey: 'entityId' });
Entity.hasMany(Booking, { foreignKey: 'entityId' });

Booking.belongsTo(PhoneNumber, { foreignKey: 'userId' });
PhoneNumber.hasMany(Booking, { foreignKey: 'userId' });

module.exports = Booking;
