const express = require('express');
const router = express.Router();
const Shop = require('../../models/admin/Shop');
const CategoryType = require('../../models/admin/CategoryType');

// ✅ CREATE Shop
router.post('/', async (req, res) => {
  try {
    const {
      name,
      categoryTypeId,
      address1,
      address2,
      location,
      state,
      pinCode,
      contactNumber,
      email,
      whatApp,
      latitude,
      longitude,
      openingTime,
      closingTime,
      closedOn,
    } = req.body;

    const categoryType = await CategoryType.findByPk(categoryTypeId);
    if (!categoryType) {
      return res.status(404).json({ error: 'Category type not found' });
    }

    const shop = await Shop.create({
      name,
      categoryTypeId,
      address1,
      address2,
      location,
      state,
      pinCode,
      contactNumber,
      email,
      whatApp,
      latitude,
      longitude,
      openingTime,
      closingTime,
      closedOn,
    });

    res.status(201).json(shop);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ UPDATE Shop
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const shop = await Shop.findByPk(id);

    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    await shop.update(req.body);
    res.json(shop);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ GET Single Shop
router.get('/:id', async (req, res) => {
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

// ✅ LIST All Shops with Pagination and Search
router.get('/', async (req, res) => {
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
          name: { [require('sequelize').Op.like]: `%${search}%` }
        }
      : {};

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

// ✅ LIST Shops by CategoryType
router.get('/category/:categoryTypeId', async (req, res) => {
  try {
    const { categoryTypeId } = req.params;
    const shops = await Shop.findAll({
      where: { categoryTypeId },
      include: [{ model: CategoryType }]
    });

    res.json(shops);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE Shop
router.delete('/:id', async (req, res) => {
  try {
    const shop = await Shop.findByPk(req.params.id);

    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    await shop.destroy();
    res.json({ message: 'Shop deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
