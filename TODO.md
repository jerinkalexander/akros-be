# TODO List for User Location Feature

## Completed Tasks
- [x] Create UserLocation model with latitude, longitude, locationName, and userId fields
- [x] Generate migration for user_locations table
- [x] Update associations.js to include UserLocation model and define relationships
- [x] Add POST /user-location endpoint to save/update user location
- [x] Add GET /user-locations endpoint to retrieve all user locations
- [x] Add GET /user-location endpoint to retrieve default location
- [x] Add isDefault flag to support multiple locations per user
- [x] Update migration to add isDefault column and remove unique constraint on userId
- [x] Run database migration to create the table and alter it
- [x] Integrate UserLocation into userProfileRoute.js

## Next Steps
- [ ] Test the API endpoints using Postman or similar tool
- [ ] Update Postman collection with new endpoints
- [ ] Ensure authentication middleware is properly applied
- [ ] Handle edge cases (e.g., invalid coordinates, database errors)
- [ ] Add validation for latitude/longitude ranges if needed
- [ ] Consider adding location history if multiple locations per user are required in the future
