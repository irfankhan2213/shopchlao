
import { Router } from 'express';
import Report from '../models/Report';
import { authenticateToken } from '../middleware/authMiddleware';
import Customer from '../models/Customer';
import Sale from '../models/Sale';

const router = Router();

// Get dashboard stats
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Total pending udhaar
    const customers = await Customer.find({ userId });
    const totalUdhaar = customers.reduce((sum, c) => sum + (c.totalUdhaar || 0), 0);
    
    // Today's sales
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    
    // Assuming sales don't natively have userId yet (or do they?), let's fetch sales where customerId is in our list
    const customerIds = customers.map(c => c._id);
    const todaysSales = await Sale.find({ 
      customerId: { $in: customerIds },
      date: { $gte: startOfToday }
    });
    const todaysSalesTotal = todaysSales.reduce((sum, s) => sum + (s.total || 0), 0);
    const todaysPaidTotal = todaysSales.reduce((sum, s) => sum + (s.paidAmount || 0), 0);
    
    res.json({
      totalPendingUdhaar: totalUdhaar,
      todaysSales: todaysSalesTotal,
      todaysPaid: todaysPaidTotal,
      activeCustomers: customers.filter(c => (c.totalUdhaar || 0) > 0).length
    });
  } catch (err) {
    console.error('Failed to fetch dashboard stats', err);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

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
