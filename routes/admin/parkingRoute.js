const express = require('express');
const router = express.Router();
const Parking = require('../../models/admin/Parking');
const CategoryType = require('../../models/admin/CategoryType');

// ✅ CREATE Parking
router.post('/', async (req, res) => {
  try {
    const {
      name,
      categoryTypeId,
      ownerId,
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
      isCovered,
      vehicleTypes,
      hasEVCharging,
      hasSecurity,
      hasScanCode,
      capacity,
      hourlyRate,
      dailyRate,
    } = req.body;

    const categoryType = await CategoryType.findByPk(categoryTypeId);
    if (!categoryType) {
      return res.status(404).json({ error: 'Category type not found' });
    }

    const parking = await Parking.create({
      name,
      categoryTypeId,
      ownerId,
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
      isCovered,
      vehicleTypes,
      hasEVCharging,
      hasSecurity,
      hasScanCode,
      capacity,
      hourlyRate,
      dailyRate,
    });

    res.status(201).json(parking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ UPDATE Parking
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const parking = await Parking.findByPk(id);

    if (!parking) {
      return res.status(404).json({ error: 'Parking not found' });
    }

    await parking.update(req.body);
    res.json(parking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ GET Single Parking
router.get('/:id', async (req, res) => {
  try {
    const parking = await Parking.findByPk(req.params.id, {
      include: [{ model: CategoryType }]
    });

    if (!parking) {
      return res.status(404).json({ error: 'Parking not found' });
    }

    res.json(parking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ LIST All Parkings with Pagination and Search
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

    const { count, rows: parkings } = await Parking.findAndCountAll({
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
      parkings
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ LIST Parkings by CategoryType
router.get('/category/:categoryTypeId', async (req, res) => {
  try {
    const { categoryTypeId } = req.params;
    const parkings = await Parking.findAll({
      where: { categoryTypeId },
      include: [{ model: CategoryType }]
    });

    res.json(parkings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE Parking
router.delete('/:id', async (req, res) => {
  try {
    const parking = await Parking.findByPk(req.params.id);

    if (!parking) {
      return res.status(404).json({ error: 'Parking not found' });
    }

    await parking.destroy();
    res.json({ message: 'Parking deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
