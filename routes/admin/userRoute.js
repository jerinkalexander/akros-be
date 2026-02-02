const express = require('express');
const router = express.Router();
const { User, Role } = require('../../models/associations');

// GET /admin/users - list all users with role 'user' (excluding soft-deleted)
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        { 
          model: Role, 
          where: { name: 'user' } 
        }
      ]
    });

    if (users.length === 0) {
      return res.status(200).json({
        message: 'No Users found',
        data: []
      });
    }

   res.status(200).json({
      message: 'Users retrieved successfully',
      count: users.length,
      data: users
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /admin/users/:id - soft-delete a user
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.destroy(); // with paranoid=true, this sets deletedAt
    res.json({ message: 'User soft-deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
