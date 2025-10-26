const express = require('express');
const multer = require('multer');
const router = express.Router();
const ShopImage = require('../../models/admin/ShopImage');
const Shop = require('../../models/admin/Shop');
const doSpacesService = require('../../utils/doSpaces');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// ✅ UPLOAD Shop Image
router.post('/upload/:shopId', upload.array('images', 1), async (req, res) => {
  try {
    const { shopId } = req.params;

    // Check if shop exists
    const shop = await Shop.findByPk(shopId);
    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No image file provided' });
    }


    const file = req.files[0]; 
 
    // Upload to Digital Ocean Spaces
    const uploadResult = await doSpacesService.uploadImage(file, `shop-${shopId}`);

    // Save to database
    const shopImage = await ShopImage.create({
      shopId: parseInt(shopId),
      imageUrl: uploadResult.imageUrl,
      imageKey: uploadResult.imageKey,
    });

    res.status(201).json({
      message: 'Image uploaded successfully',
      shopImage
    });
  } catch (error) {
    console.error('Error uploading shop image:', error);
    res.status(500).json({ error: error.message || 'Failed to upload image' });
  }
});

// ✅ LIST Shop Images
router.get('/:shopId', async (req, res) => {
  try {
    const { shopId } = req.params;

    // Check if shop exists
    const shop = await Shop.findByPk(shopId);
    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    const images = await ShopImage.findAll({
      where: { shopId: parseInt(shopId) },
      order: [['createdAt', 'DESC']]
    });

    res.json(images);
  } catch (error) {
    console.error('Error fetching shop images:', error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ DELETE Shop Image
router.delete('/:imageId', async (req, res) => {
  try {
    const { imageId } = req.params;

    const shopImage = await ShopImage.findByPk(imageId);
    if (!shopImage) {
      return res.status(404).json({ error: 'Shop image not found' });
    }

    // Delete from Digital Ocean Spaces
    await doSpacesService.deleteImage(shopImage.imageKey);

    // Delete from database
    await shopImage.destroy();

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting shop image:', error);
    res.status(500).json({ error: error.message || 'Failed to delete image' });
  }
});

module.exports = router;
