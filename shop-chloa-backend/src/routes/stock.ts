import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import Product from '../models/Product';
import StockLot from '../models/StockLot';
const router = Router();

// Get stock inventory (computed per product)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user?._id || (req as any).user?.id;
    const products = await Product.find({ userId }).populate('lots');
    const inventory = products.map((p: any) => {
      const total = (p.lots || []).reduce((sum: number, lot: any) => sum + (lot.quantity || 0), 0);
      const earliestExpiry = (p.lots || [])
        .map((l: any) => l.expiryDate)
        .filter(Boolean)
        .sort()[0] || null;
      let status: 'good' | 'low' | 'out' = 'good';
      if (total === 0) status = 'out';
      else if (total < 10) status = 'low';
      return {
        id: String(p._id),
        name: p.name,
        category: String(p.category),
        currentStock: total,
        minStock: 10,
        maxStock: 9999,
        lastUpdated: p.updatedAt,
        status,
        earliestExpiry,
      };
    });
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stock' });
  }
});

// Increase/decrease stock for a product by creating an adjustment lot (positive or negative)
router.post('/:productId/adjust', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user?._id || (req as any).user?.id;
    const { productId } = req.params;
    const { delta, note } = req.body as { delta: number; note?: string };
    if (typeof delta !== 'number' || delta === 0) {
      return res.status(400).json({ error: 'Delta must be a non-zero number' });
    }
    const product = await Product.findOne({ _id: productId, userId });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    // Create an adjustment lot with zero prices and optional batch note
    const lot = await StockLot.create({
      mrp: 0,
      purchasePrice: 0,
      sellPrice: 0,
      quantity: delta,
      batchNumber: note,
      product: product._id,
    });
    product.lots.push(lot._id);
    await product.save();
    res.status(201).json({ success: true, lot });
  } catch (err) {
    res.status(500).json({ error: 'Failed to adjust stock' });
  }
});

// Stock summary for dashboard
router.get('/summary', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user?._id || (req as any).user?.id;
    const products = await Product.find({ userId }).populate('lots');
    let totals = { total: 0, good: 0, low: 0, out: 0 } as any;
    products.forEach((p: any) => {
      const total = (p.lots || []).reduce((sum: number, lot: any) => sum + (lot.quantity || 0), 0);
      totals.total += 1;
      if (total === 0) totals.out += 1;
      else if (total < 10) totals.low += 1;
      else totals.good += 1;
    });
    res.json(totals);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stock summary' });
  }
});

// Expiring lots within N days
router.get('/expiring', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user?._id || (req as any).user?.id;
    const days = parseInt(String(req.query.days || '7'));
    const now = new Date();
    const until = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    const products = await Product.find({ userId }).populate('lots');
    const expiring: any[] = [];
    products.forEach((p: any) => {
      (p.lots || []).forEach((lot: any) => {
        if (lot.expiryDate && lot.expiryDate <= until) {
          expiring.push({
            productId: String(p._id),
            name: p.name,
            batch: lot.batchNumber,
            expiryDate: lot.expiryDate,
            stock: lot.quantity,
            daysLeft: Math.ceil((lot.expiryDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)),
          });
        }
      });
    });
    res.json(expiring.sort((a, b) => a.daysLeft - b.daysLeft));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch expiring lots' });
  }
});

export default router;
