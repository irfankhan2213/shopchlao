import { Router } from 'express';
import LedgerEntry from '../models/LedgerEntry';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Get ledger for a specific customer
router.get('/:customerId', authenticateToken, async (req, res) => {
  try {
    const { customerId } = req.params;
    
    // Sort by date descending (newest first)
    const ledger = await LedgerEntry.find({ customerId }).sort({ date: -1 });
    
    res.json(ledger);
  } catch (err) {
    console.error('Failed to fetch ledger', err);
    res.status(500).json({ error: 'Failed to fetch ledger' });
  }
});

export default router;
