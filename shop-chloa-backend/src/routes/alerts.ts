
import { Router } from 'express';
import Alert from '../models/Alert';
import { authenticateToken } from '../middleware/authMiddleware';
const router = Router();

// Get all alerts
router.get('/', authenticateToken, async (req, res) => {
  try {
    const alerts = await Alert.find();
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// Get a single alert
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) return res.status(404).json({ error: 'Alert not found' });
    res.json(alert);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch alert' });
  }
});

// Create an alert
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { type, message, date } = req.body;
    if (!type || !message) return res.status(400).json({ error: 'Type and message required' });
    const alert = new Alert({ type, message, date: date || new Date().toISOString() });
    await alert.save();
    res.status(201).json(alert);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create alert' });
  }
});

// Update an alert
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) return res.status(404).json({ error: 'Alert not found' });
    const { type, message, date } = req.body;
    if (type) alert.type = type;
    if (message) alert.message = message;
    if (date) alert.date = date;
    await alert.save();
    res.json(alert);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update alert' });
  }
});

// Delete an alert
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const alert = await Alert.findByIdAndDelete(req.params.id);
    if (!alert) return res.status(404).json({ error: 'Alert not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete alert' });
  }
});

export default router;
