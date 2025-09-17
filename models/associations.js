const User = require('./User');
const Role = require('./Role');

// Define associations
User.belongsTo(Role, { foreignKey: 'roleId' });
Role.hasMany(User, { foreignKey: 'roleId' });

module.exports = {
  User,
  Role
};