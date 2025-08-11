const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const PhoneNumber = require('./PhoneNumber');

const OTP = sequelize.define('OTP', {
  otp: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  phoneNumberId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: PhoneNumber,
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'otps',
  timestamps: true
});

// Define associations
PhoneNumber.hasMany(OTP, { foreignKey: 'phoneNumberId' });
OTP.belongsTo(PhoneNumber, { foreignKey: 'phoneNumberId' });

module.exports = OTP;
