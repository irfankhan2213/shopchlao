
import { Router } from 'express';
import Sale from '../models/Sale';
import { authenticateToken } from '../middleware/authMiddleware';
const router = Router();

// Get all sales
router.get('/', authenticateToken, async (req, res) => {
  try {
    const sales = await Sale.find();
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sales' });
  }
});

// Get a single sale
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) return res.status(404).json({ error: 'Sale not found' });
    res.json(sale);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sale' });
  }
});

// Create a sale
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { customerId, customerName, items, total, paymentMethod, date } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Sale items required' });
    }
    const sale = new Sale({ customerId, customerName, items, total, paymentMethod, date: date || new Date().toISOString() });
    await sale.save();
    res.status(201).json(sale);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create sale' });
  }
});

// Update a sale
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) return res.status(404).json({ error: 'Sale not found' });
    const { customerId, customerName, items, total, paymentMethod, date } = req.body;
    if (customerId) sale.customerId = customerId;
    if (customerName) sale.customerName = customerName;
    if (items) sale.items = items;
    if (total) sale.total = total;
    if (paymentMethod) sale.paymentMethod = paymentMethod;
    if (date) sale.date = date;
    await sale.save();
    res.json(sale);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update sale' });
  }
});

// Delete a sale
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const sale = await Sale.findByIdAndDelete(req.params.id);
    if (!sale) return res.status(404).json({ error: 'Sale not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete sale' });
  }
});

export default router;
