const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UserDevice = sequelize.define('UserDevice', {
  id: {
    type: DataTypes.STRING(255),
    primaryKey: true,
    allowNull: false
  },
  userId: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  deviceType: {
    type: DataTypes.ENUM('ios', 'android'),
    allowNull: false
  },
  pushToken: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  }
}, {
  tableName: 'user_devices',
  timestamps: false
});

module.exports = UserDevice;
