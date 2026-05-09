
import { Router } from 'express';
import Settings from '../models/Settings';
import { authenticateToken } from '../middleware/authMiddleware';
const router = Router();

// Get settings (assume only one settings document)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const settings = await Settings.findOne();
    res.json(settings || {});
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update settings (upsert)
router.put('/', authenticateToken, async (req, res) => {
  try {
    const update = req.body;
    const settings = await Settings.findOneAndUpdate({}, update, { new: true, upsert: true });
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

export default router;
