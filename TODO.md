# Shop Images Feature Implementation

## TODO List

- [x] Install dependencies: multer, @aws-sdk/client-s3, @aws-sdk/lib-storage
- [x] Create ShopImage model with shopId foreign key, imageUrl, imageKey
- [x] Create migration for shop_images table
- [x] Add hasMany association in Shop model
- [x] Create DO Spaces utility for upload/delete operations
- [x] Add DO Spaces config to config.js
- [x] Create shop image routes: upload, list, delete
- [x] Update shop create/update routes to handle image uploads
- [x] Run migration
- [x] Test endpoints
- [x] Error handling
