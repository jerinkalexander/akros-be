const express = require('express');
const router = express.Router();
const Entity = require('../../models/admin/Entity');
const CategoryType = require('../../models/admin/CategoryType');

// ✅ CREATE Entity
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

    const entity = await Entity.create({
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

    res.status(201).json(entity);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ UPDATE Entity
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const entity = await Entity.findByPk(id);

    if (!entity) {
      return res.status(404).json({ error: 'Entity not found' });
    }

    await entity.update(req.body);
    res.json(entity);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ GET Single Entity
router.get('/:id', async (req, res) => {
  try {
    const entity = await Entity.findByPk(req.params.id, {
      include: [{ model: CategoryType }]
    });

    if (!entity) {
      return res.status(404).json({ error: 'Entity not found' });
    }

    res.json(entity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ LIST All Entities
router.get('/', async (req, res) => {
  try {
    const entities = await Entity.findAll({
      include: [{ model: CategoryType }],
      order: [['createdAt', 'DESC']]
    });

    res.json(entities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ LIST Entities by CategoryType
router.get('/category/:categoryTypeId', async (req, res) => {
  try {
    const { categoryTypeId } = req.params;
    const entities = await Entity.findAll({
      where: { categoryTypeId },
      include: [{ model: CategoryType }]
    });

    res.json(entities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE Entity
router.delete('/:id', async (req, res) => {
  try {
    const entity = await Entity.findByPk(req.params.id);

    if (!entity) {
      return res.status(404).json({ error: 'Entity not found' });
    }

    await entity.destroy();
    res.json({ message: 'Entity deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
