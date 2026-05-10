
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

import Customer from '../models/Customer';
import LedgerEntry from '../models/LedgerEntry';
import StockLot from '../models/StockLot';

// Create a sale
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { customerId, customerName, items, total, paidAmount = 0, udhaarAmount = 0, paymentMethod, date, attachments } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Sale items required' });
    }
    const saleDate = date || new Date().toISOString();
    const sale = new Sale({ 
      customerId, 
      customerName, 
      items, 
      total, 
      paidAmount,
      udhaarAmount,
      paymentMethod, 
      date: saleDate,
      attachments
    });
    await sale.save();

    if (customerId) {
      const customer = await Customer.findById(customerId);
      if (customer) {
        customer.totalSpent = (customer.totalSpent || 0) + total;
        customer.totalPaid = (customer.totalPaid || 0) + paidAmount;
        customer.totalUdhaar = (customer.totalUdhaar || 0) + udhaarAmount;
        customer.lastPurchaseDate = saleDate;
        await customer.save();

        const ledger = new LedgerEntry({
          customerId,
          type: 'SALE',
          amount: total,
          balanceAfter: customer.totalUdhaar,
          referenceId: sale._id,
          notes: `Sale of ${items.length} items. Paid: ${paidAmount}, Udhaar: ${udhaarAmount}`,
          date: saleDate,
          attachments
        });
        await ledger.save();
      }
    }

    // Deduct stock
    for (const item of items) {
      let remainingToDeduct = item.qty;
      // Find lots for this product, sort by oldest first
      const lots = await StockLot.find({ product: item.productId, quantity: { $gt: 0 } }).sort({ createdAt: 1 });
      for (const lot of lots) {
        if (remainingToDeduct <= 0) break;
        if (lot.quantity >= remainingToDeduct) {
          lot.quantity -= remainingToDeduct;
          remainingToDeduct = 0;
        } else {
          remainingToDeduct -= lot.quantity;
          lot.quantity = 0;
        }
        await lot.save();
      }
    }

    res.status(201).json(sale);
  } catch (err) {
    console.error('Failed to create sale', err);
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
