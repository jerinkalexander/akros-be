// models/Category.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // adjust path to your db config

const Category = sequelize.define('Category', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  icon: {
    type: DataTypes.STRING, // store image path or URL
    allowNull: false,
  },
}, {
  tableName: 'categories',
  timestamps: true,
});

module.exports = Category;
