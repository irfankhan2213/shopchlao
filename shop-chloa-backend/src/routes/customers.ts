
import { Router } from 'express';
import Customer from '../models/Customer';
import { authenticateToken } from '../middleware/authMiddleware';
const router = Router();

// Get all customers
router.get('/', authenticateToken, async (req, res) => {
  try {
    const customers = await Customer.find({ userId: req.user.id });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Get a single customer
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const customer = await Customer.findOne({ _id: req.params.id, userId: req.user.id });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

// Create a customer
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });
    const customer = new Customer({ name, email, phone, address, userId: req.user.id });
    await customer.save();
    res.status(201).json(customer);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

// Update a customer
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const customer = await Customer.findOne({ _id: req.params.id, userId: req.user.id });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    const { name, email, phone, address } = req.body;
    if (name) customer.name = name;
    if (email) customer.email = email;
    if (phone) customer.phone = phone;
    if (address) customer.address = address;
    await customer.save();
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

// Delete a customer
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const customer = await Customer.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for file uploads using Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'shopchlao_receipts',
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'pdf'],
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`
    };
  },
});
const upload = multer({ storage });

// Upload attachment to customer
router.post('/:id/upload', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const customer = await Customer.findOne({ _id: req.params.id, userId: req.user.id });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const { description } = req.body;
    
    // Create url based on Cloudinary response (stored in req.file.path)
    const url = req.file.path;
    
    if (!customer.attachments) {
      customer.attachments = [];
    }
    
    customer.attachments.push({
      url,
      date: new Date(),
      description: description || 'Receipt/Document'
    });
    
    await customer.save();
    res.status(201).json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

export default router;
