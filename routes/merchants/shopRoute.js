const express = require('express');
const router = express.Router();
const Shop = require('../../models/admin/Shop');
const CategoryType = require('../../models/admin/CategoryType');
const ShopImage = require('../../models/admin/ShopImage');

// ✅ GET all shops for logged-in merchant (owner)
router.get('/', async (req, res) => {
  try {
    const merchantId = req.user.id; // Get merchant ID from JWT token

    // Fetch all shops where ownerId matches the merchant's ID
    const shops = await Shop.findAll({
      where: { ownerId: merchantId },
      include: [
        {
          model: CategoryType,
          attributes: ['id', 'name']
        },
        {
          model: ShopImage,
          attributes: ['id', 'imageUrl', 'createdAt']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    if (shops.length === 0) {
      return res.status(200).json({
        message: 'No shops found for this merchant',
        data: [],
        count: 0
      });
    }

    res.status(200).json({
      message: 'Merchant shops retrieved successfully',
      count: shops.length,
      data: shops
    });
  } catch (error) {
    console.error('Error fetching merchant shops:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch shops' });
  }
});

// ✅ GET single shop by ID (verify it belongs to merchant)
router.get('/:shopId', async (req, res) => {
  try {
    const merchantId = req.user.id;
    const { shopId } = req.params;

    const shop = await Shop.findOne({
      where: { 
        id: shopId,
        ownerId: merchantId // Ensure merchant owns this shop
      },
      include: [
        {
          model: CategoryType,
          attributes: ['id', 'name']
        },
        {
          model: ShopImage,
          attributes: ['id', 'imageUrl', 'createdAt']
        }
      ]
    });

    if (!shop) {
      return res.status(404).json({ 
        error: 'Shop not found or you do not have permission to access it' 
      });
    }

    res.status(200).json({
      message: 'Shop retrieved successfully',
      data: shop
    });
  } catch (error) {
    console.error('Error fetching shop:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch shop' });
  }
});

// ✅ UPDATE shop (merchant can only update their own shops)
router.put('/:shopId', async (req, res) => {
  try {
    const merchantId = req.user.id;
    const { shopId } = req.params;

    // Verify merchant owns this shop
    const shop = await Shop.findOne({
      where: { 
        id: shopId,
        ownerId: merchantId
      }
    });

    if (!shop) {
      return res.status(403).json({ 
        error: 'You do not have permission to update this shop' 
      });
    }

    // Update the shop
    await shop.update(req.body);

    res.status(200).json({
      message: 'Shop updated successfully',
      data: shop
    });
  } catch (error) {
    console.error('Error updating shop:', error);
    res.status(500).json({ error: error.message || 'Failed to update shop' });
  }
});

module.exports = router;
