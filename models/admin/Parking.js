const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const CategoryType = require('./CategoryType');

const Parking = sequelize.define('Parking', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  categoryTypeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: CategoryType,
      key: 'id',
    },
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  address1: {
    type: DataTypes.STRING,
  },
  address2: {
    type: DataTypes.STRING,
  },
  location: {
    type: DataTypes.STRING,
  },
  state: {
    type: DataTypes.STRING,
  },
  pinCode: {
    type: DataTypes.STRING,
  },
  contactNumber: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  whatApp: {
    type: DataTypes.STRING,
  },
  latitude: {
    type: DataTypes.STRING,
  },
  longitude: {
    type: DataTypes.STRING,
  },
  openingTime: {
    type: DataTypes.STRING,
  },
  closingTime: {
    type: DataTypes.STRING,
  },
  closedOn: {
    type: DataTypes.TEXT,
  },
  isCovered: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  vehicleTypes: {
    type: DataTypes.ENUM('bike', 'car', 'both'),
    defaultValue: 'car',
  },
  hasEVCharging: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  hasSecurity: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  hasScanCode: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  hourlyRate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  dailyRate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
}, {
  tableName: 'parkings',
  timestamps: true,
});

// Associations
Parking.belongsTo(CategoryType, { foreignKey: 'categoryTypeId' });
CategoryType.hasMany(Parking, { foreignKey: 'categoryTypeId' });

module.exports = Parking;
