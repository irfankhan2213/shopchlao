import { Router } from 'express';
import Payment from '../models/Payment';
import Customer from '../models/Customer';
import LedgerEntry from '../models/LedgerEntry';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Create a payment
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { customerId, amount, paymentMethod, notes, date, attachments } = req.body;
    
    if (!customerId || !amount) {
      return res.status(400).json({ error: 'Customer ID and amount are required' });
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const paymentDate = date || new Date().toISOString();
    
    const payment = new Payment({
      customerId,
      amount,
      paymentMethod,
      notes,
      date: paymentDate,
      attachments
    });
    
    await payment.save();

    // Update customer udhaar balance
    customer.totalPaid = (customer.totalPaid || 0) + amount;
    customer.totalUdhaar = Math.max(0, (customer.totalUdhaar || 0) - amount);
    await customer.save();

    // Create ledger entry
    const ledger = new LedgerEntry({
      customerId,
      type: 'PAYMENT',
      amount,
      balanceAfter: customer.totalUdhaar,
      referenceId: payment._id,
      notes: notes || `Payment received via ${paymentMethod}`,
      date: paymentDate,
      attachments
    });
    await ledger.save();

    res.status(201).json(payment);
  } catch (err) {
    console.error('Failed to process payment', err);
    res.status(500).json({ error: 'Failed to process payment' });
  }
});

export default router;
