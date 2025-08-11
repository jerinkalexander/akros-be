const express = require('express');
const router = express.Router();
const Entity = require('../../models/admin/Entity');
const CategoryType = require('../../models/admin/CategoryType');

// Create a new Entity under a category type
router.post('/', async (req, res) => {
  try {
    const { name, categoryTypeId } = req.body;
    // Check if category type exists
    const categoryType = await CategoryType.findByPk(categoryTypeId);
    if (!categoryType) {
      return res.status(404).json({ error: 'Category type not found' });
    }
    const entity = await Entity.create({ name, categoryTypeId });
    res.status(201).json(entity);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all entity under a category type
router.get('/category/:categoryTypeId', async (req, res) => {
  try {
    const { categoryTypeId } = req.params;
    const entity = await Entity.findAll({ where: { categoryTypeId } });
    res.json(entity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all Entities
router.get('/', async (req, res) => {
  try {
    const entities = await Entity.findAll();
    res.json(entities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;