const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/config');

const s3Client = new S3Client({
  region: config.doSpaces.region,
  endpoint: config.doSpaces.endpoint,
  credentials: {
    accessKeyId: config.doSpaces.accessKeyId,
    secretAccessKey: config.doSpaces.secretAccessKey,
  },
  forcePathStyle: false,
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

      const upload = new Upload({
        client: s3Client,
        params: uploadParams,
      });

      const result = await upload.done();

      return {
        imageUrl: result.Location,
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
