const User = require('./User');
const Role = require('./Role');
const Shop = require('./admin/Shop');
const Parking = require('./admin/Parking');
const Booking = require('./app/Booking');
const ParkingBooking = require('./app/ParkingBooking');
const CategoryType = require('./admin/CategoryType');
const BookingStatus = require('./bookingstatus');

// Define associations
User.belongsTo(Role, { foreignKey: 'roleId' });
Role.hasMany(User, { foreignKey: 'roleId' });

// Shop associations
Shop.belongsTo(CategoryType, { foreignKey: 'categoryTypeId' });
CategoryType.hasMany(Shop, { foreignKey: 'categoryTypeId' });
Shop.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });
User.hasMany(Shop, { foreignKey: 'ownerId' });

// Parking associations
Parking.belongsTo(CategoryType, { foreignKey: 'categoryTypeId' });
CategoryType.hasMany(Parking, { foreignKey: 'categoryTypeId' });
Parking.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });
User.hasMany(Parking, { foreignKey: 'ownerId' });

// Booking associations (for shops)
Booking.belongsTo(Shop, { foreignKey: 'shopId' });
Shop.hasMany(Booking, { foreignKey: 'shopId' });

Booking.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Booking, { foreignKey: 'userId' });

Booking.belongsTo(BookingStatus, { foreignKey: 'statusId' });
BookingStatus.hasMany(Booking, { foreignKey: 'statusId' });

// Parking Booking associations
ParkingBooking.belongsTo(Parking, { foreignKey: 'parkingId' });
Parking.hasMany(ParkingBooking, { foreignKey: 'parkingId' });

ParkingBooking.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(ParkingBooking, { foreignKey: 'userId' });

ParkingBooking.belongsTo(BookingStatus, { foreignKey: 'statusId' });
BookingStatus.hasMany(ParkingBooking, { foreignKey: 'statusId' });

module.exports = {
  User,
  Role,
  Shop,
  Parking,
  Booking,
  ParkingBooking,
  CategoryType,
  BookingStatus
};
