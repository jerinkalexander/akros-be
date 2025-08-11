const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const CategoryType = require('./CategoryType');

const Entity = sequelize.define('Entity', {
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
}, {
  tableName: 'entities',
  timestamps: true,
});

// Association
Entity.belongsTo(CategoryType, { foreignKey: 'categoryTypeId' });
CategoryType.hasMany(Entity, { foreignKey: 'categoryTypeId' });

module.exports = Entity;