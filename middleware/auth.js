module.exports = (req, res, next) => {
  const userId = req.header('x-user-id'); // send phone_numbers.id via header
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: user ID required' });
  }
  req.user = { id: parseInt(userId) };
  next();
};