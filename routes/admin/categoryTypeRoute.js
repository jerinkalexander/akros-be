const express = require('express');
const router = express.Router();
const CategoryType = require('../../models/admin/CategoryType');

// Create a new category type
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    const categoryType = await CategoryType.create({ name });
    res.status(201).json(categoryType);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all category types
router.get('/', async (req, res) => {
  try {
    const types = await CategoryType.findAll();
    res.json(types);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET one category type by ID
router.get('/:id', async (req, res) => {
  try {
    const categoryType = await CategoryType.findByPk(req.params.id);

    if (!categoryType) {
      return res.status(404).json({ error: 'Category type not found' });
    }

    res.json(categoryType);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a category type by ID
router.put('/:id', async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const categoryType = await CategoryType.findByPk(id);
    if (!categoryType) {
      return res.status(404).json({ error: 'Category type not found' });
    }
    categoryType.name = name;
    await categoryType.save();
    res.json(categoryType);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a category type by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const categoryType = await CategoryType.findByPk(id);
    if (!categoryType) {
      return res.status(404).json({ error: 'Category type not found' });
    }
    await categoryType.destroy();
    res.json({ message: 'Category type deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;