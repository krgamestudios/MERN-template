const router = require('express').Router();
const Character = require('../database/models/character');
const authMiddleware = require('../middleware/auth');

// Load character by slot
router.get('/', authMiddleware, async (req, res) => {
  try {
    const slot = parseInt(req.query.slot || 1);
    const char = await Character.findOne({ userId: req.userId, slot });
    res.json(char);
  } catch (error) {
    res.status(500).send('Error loading character.');
  }
});

// Save/update character in slot
router.post('/save', authMiddleware, async (req, res) => {
  try {
    const { slot, stats, log } = req.body;
    const characterData = { stats, log, userId: req.userId, slot };
    const updated = await Character.findOneAndUpdate(
      { userId: req.userId, slot },
      characterData,
      { upsert: true, new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).send('Error saving character.');
  }
});

module.exports = router;
