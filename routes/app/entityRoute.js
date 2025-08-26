const express = require('express');
const router = express.Router();
const Entity = require('../../models/admin/Entity');
const CategoryType = require('../../models/admin/CategoryType');

// ✅ Get all Entities (for app)
router.get('/entities', async (req, res) => {
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

// ✅ Get one Entity by ID (for app)
router.get('/entities/:id', async (req, res) => {
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

module.exports = router;
