// models/UserProfile.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const PhoneNumber = require('./PhoneNumber');

const UserProfile = sequelize.define('UserProfile', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  carNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  place: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phoneNumberId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'user_profiles',
  timestamps: true
});

// Association
PhoneNumber.hasMany(UserProfile, {
  foreignKey: 'phoneNumberId',
  onDelete: 'CASCADE'
});
UserProfile.belongsTo(PhoneNumber, {
  foreignKey: 'phoneNumberId'
});

module.exports = UserProfile;
