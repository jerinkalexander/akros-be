// models/UserProfile.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const PhoneNumber = require('../User');

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
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'profiles',
  timestamps: true
});

// Association (one-to-one: each user has one profile)
PhoneNumber.hasOne(UserProfile, {
  foreignKey: 'userId',
  as: 'profile',
  onDelete: 'CASCADE'
});
UserProfile.belongsTo(PhoneNumber, {
  foreignKey: 'userId',
  as: 'user'
});

module.exports = UserProfile;
