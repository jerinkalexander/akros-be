const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/config');

// Validate DO Spaces configuration early to provide clearer errors
const { accessKeyId, secretAccessKey, region, endpoint, bucket } = config.doSpaces || {};

if (!accessKeyId || !secretAccessKey) {
  console.log(config.doSpaces);
  // Fail fast with a clear message — the AWS SDK error is cryptic when creds are missing
  throw new Error('DigitalOcean Spaces credentials are missing. Please set DO_SPACES_ACCESS_KEY and DO_SPACES_SECRET_KEY in your environment.');
}

const s3Client = new S3Client({
  region: region,
  endpoint: endpoint,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
  forcePathStyle: true,
});

class DOSpacesService {
  constructor() {
    this.bucket = config.doSpaces.bucket;
  }

  async uploadImage(file, folder = 'shop-images') {
    try {
      const fileExtension = file.originalname.split('.').pop();
      const fileName = `${folder}/${uuidv4()}.${fileExtension}`;

      const uploadParams = {
        Bucket: this.bucket,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read', // Make the image publicly accessible
      };
      // log the params for debugging (not an error)
      console.debug('Uploading image to DO Spaces with params:', {
        Bucket: uploadParams.Bucket,
        Key: uploadParams.Key,
        ContentType: uploadParams.ContentType,
        // Don't log Body or credentials
      });

      const upload = new Upload({
        client: s3Client,
        params: uploadParams,
      });

      const result = await upload.done();

      // Some SDK responses (lib-storage) don't expose a consistent `Location` field.
      // Build a public URL for DigitalOcean Spaces if needed.
      let imageUrl = (result && result.Location) ? result.Location : null;
      if (!imageUrl) {
        // If endpoint contains protocol, strip it for bucket subdomain form
        const endpointHost = (endpoint || '').replace(/^https?:\/\//, '').replace(/\/$/, '');
        if (endpointHost) {
          // DigitalOcean spaces commonly use the form: https://{bucket}.{region}.digitaloceanspaces.com/{key}
          imageUrl = `https://${this.bucket}.${endpointHost}/${fileName}`;
        } else {
          imageUrl = `/${this.bucket}/${fileName}`; // fallback relative path
        }
      }

      return {
        imageUrl,
        imageKey: fileName,
      };
    } catch (error) {
      console.error('Error uploading image to DO Spaces:', error);
      throw new Error('Failed to upload image');
    }
  }

  async deleteImage(imageKey) {
    try {
      const deleteParams = {
        Bucket: this.bucket,
        Key: imageKey,
      };

      const command = new DeleteObjectCommand(deleteParams);
      await s3Client.send(command);

      return true;
    } catch (error) {
      console.error('Error deleting image from DO Spaces:', error);
      throw new Error('Failed to delete image');
    }
  }
}

module.exports = new DOSpacesService();
