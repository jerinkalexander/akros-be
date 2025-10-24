const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const UserLocation = sequelize.define('UserLocation', {
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false
  },
  locationName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'user_locations',
  timestamps: true
});

module.exports = UserLocation;
