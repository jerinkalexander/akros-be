const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const CategoryType = sequelize.define('CategoryType', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'category_types',
  timestamps: true,
});

module.exports = CategoryType;