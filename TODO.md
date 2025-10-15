# TODO: Add Parking Category Feature

## Overview
Add a new "Parking" category with a dedicated Parking model for better maintenance and UI separation. Parking will have basic details (name, address, etc.) and options like covered parking, bike/car support, EV charging, security, scan code, plus capacity, rates, etc.

## Steps
- [x] Create new Parking model (models/admin/Parking.js) with fields similar to Shop plus parking-specific options.
- [x] Create migration for Parking table (migrations/202509XX-create-parkings.js).
- [x] Update Booking model to support parking bookings (add parkingId, update associations).
- [x] Create routes for Parking CRUD (routes/admin/parkingRoute.js).
- [x] Update associations (models/associations.js) to include Parking.
- [x] Update seeder to add "Parking" category (seeders/20251001000000-seed-roles.js).
- [x] Run migrations and seeders.
- [x] Add ownerId to Shop and Parking models for ownership mapping.
- [x] Update routes to include ownerId in create/update operations.
- [x] Test: Create parking via API, book it.
- [x] Update any dependent routes if needed (e.g., app/bookingRoute.js for parking bookings).

## Notes
- Parking fields: name, addresses, location, contacts, geo, timings, plus isCovered (boolean), vehicleTypes (enum: bike/car/both), hasEVCharging (boolean), hasSecurity (boolean), hasScanCode (boolean), capacity (integer), hourlyRate (decimal), dailyRate (decimal).
- Booking: Add optional parkingId; update to handle both shop and parking bookings.
- Ensure no breaking changes to existing Shop/Booking functionality.
