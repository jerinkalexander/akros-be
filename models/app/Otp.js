const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const User = require('../User');

const OTP = sequelize.define('OTP', {
  otp: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'otps',
  timestamps: true
});

// Define associations
User.hasMany(OTP, { foreignKey: 'userId' });
OTP.belongsTo(User, { foreignKey: 'userId' });

module.exports = OTP;
