const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const CategoryType = require('./CategoryType');

const Shop = sequelize.define('Shop', {
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
    allowNull: true, // Allow null for existing data, but require for new entries
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
    type: DataTypes.TEXT, // Assuming multiple days as comma-separated string
  },
}, {
  tableName: 'shops',
  timestamps: true,
});

// Associations
Shop.belongsTo(CategoryType, { foreignKey: 'categoryTypeId' });
CategoryType.hasMany(Shop, { foreignKey: 'categoryTypeId' });

module.exports = Shop;
