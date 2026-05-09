
import { Router } from 'express';
import Report from '../models/Report';
import { authenticateToken } from '../middleware/authMiddleware';
const router = Router();

// Get all reports
router.get('/', authenticateToken, async (req, res) => {
  try {
    const reports = await Report.find();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// Get a single report
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch report' });
  }
});

// Create a report
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { type, data, date } = req.body;
    if (!type || !data) return res.status(400).json({ error: 'Type and data required' });
    const report = new Report({ type, data, date: date || new Date().toISOString() });
    await report.save();
    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create report' });
  }
});

// Update a report
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    const { type, data, date } = req.body;
    if (type) report.type = type;
    if (data) report.data = data;
    if (date) report.date = date;
    await report.save();
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update report' });
  }
});

// Delete a report
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete report' });
  }
});

export default router;
