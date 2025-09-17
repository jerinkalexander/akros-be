const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UserToken = sequelize.define('UserToken', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  phoneId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: false
  },
}, {
  tableName: 'user_tokens',
  timestamps: true
});

module.exports = UserToken;