const express = require('express');
const router = express.Router();
const Shop = require('../../models/admin/Shop');
const CategoryType = require('../../models/admin/CategoryType');
const { Op } = require('sequelize');

// ✅ LIST All Shops with Pagination and Search
router.get('/shops', async (req, res) => {
  try {
    // Pagination params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Search param
    const search = req.query.search || '';

    // Build where clause for search
    const where = search
      ? {
          name: { [Op.like]: `%${search}%` }
        }
      : {};

    // Optional parking filter: if parking=true => only categoryTypeId 1
    // if parking=false => exclude categoryTypeId 1
    const parkingParam = (req.query.parking || '').toString().toLowerCase();
    if (parkingParam === 'true' || parkingParam === '1' || parkingParam === 'yes') {
      where.categoryTypeId = 1;
    } else if (parkingParam === 'false' || parkingParam === '0' || parkingParam === 'no') {
      where.categoryTypeId = { [Op.ne]: 1 };
    }

    const { count, rows: shops } = await Shop.findAndCountAll({
      where,
      include: [{ model: CategoryType }],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    res.json({
      total: count,
      page,
      pageSize: limit,
      shops
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get one Shop by ID (for app)
router.get('/shops/:id', async (req, res) => {
  try {
    const shop = await Shop.findByPk(req.params.id, {
      include: [{ model: CategoryType }]
    });

    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    res.json(shop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
