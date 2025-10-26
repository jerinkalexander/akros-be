const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const Shop = require('./Shop');

const ShopImage = sequelize.define('ShopImage', {
  shopId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Shop,
      key: 'id',
    },
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imageKey: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'shop_images',
  timestamps: true,
});

// Associations will be defined in associations.js

module.exports = ShopImage;
