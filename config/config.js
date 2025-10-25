require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT
  },
  // ...test and production configs...

  // Digital Ocean Spaces configuration
  doSpaces: {
    accessKeyId: process.env.DO_SPACES_ACCESS_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET_KEY,
    region: process.env.DO_SPACES_REGION || 'blr1',
    endpoint: process.env.DO_SPACES_ENDPOINT || 'https://shop-images.blr1.digitaloceanspaces.com',
    bucket: process.env.DO_SPACES_BUCKET || 'shop-images'
  }
};
