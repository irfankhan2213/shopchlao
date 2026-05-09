import { Router } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import Product from "../models/Product";
import StockLot from "../models/StockLot";
const router = Router();

// Get all products (protected)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const products = await Product.find({ userId })
      .populate("lots")
      .populate("brand")
      .populate("category");
    const mappedProducts = products.map((product: any) => {
      const totalStock = product.lots.reduce(
        (sum: number, lot: any) => sum + (lot.quantity || 0),
        0
      );
      const prices = product.lots.map((lot: any) => ({
        mrp: lot.mrp,
        purchasePrice: lot.purchasePrice,
        sellPrice: lot.sellPrice,
      }));
      const expiryDates = product.lots
        .map((lot: any) => lot.expiryDate)
        .filter(Boolean);
      const earliestExpiry =
        expiryDates.length > 0 ? expiryDates.sort()[0] : null;
      let status = "In Stock";
      if (totalStock === 0) status = "Out of Stock";
      else if (totalStock < 10) status = "Low Stock";
      return {
        id: product._id,
        name: product.name,
        description: product.description,
        brand: product.brand?.name, // now populated
        category: product.category?.name, // now populated
        stock: totalStock,
        prices,
        status,
        expiry: earliestExpiry,
      };
    });
    res.json(mappedProducts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Get a single product
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const product = await Product.findOne({ _id: req.params.id, userId })
      .populate("lots")
      .populate("brand")
      .populate("category");
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// Create a product (protected)
router.post("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { name, description, category, brand, barcode } = req.body;
    if (!name || !category || !brand) {
      return res.status(400).json({ error: "Invalid product data" });
    }
    const product = new Product({
      name,
      description,
      category, // expects ObjectId
      brand, // expects ObjectId
      barcode,
      userId,
    });
    await product.save();
    const populatedProduct = await Product.findById(product._id)
      .populate("brand")
      .populate("category");
    res.status(201).json(populatedProduct);
  } catch (err) {
    console.log("Error creating product:", err);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// Update a product (protected)
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { name, description, category } = req.body;
    const product = await Product.findOne({ _id: req.params.id, userId });
    if (!product) return res.status(404).json({ error: "Product not found" });
    if (name) product.name = name;
    if (description) product.description = description;
    if (category) product.category = category;
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

// Delete a product for the authenticated user
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const product = await Product.findOneAndDelete({ _id: req.params.id, userId });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// Add a stock lot to a product
router.post("/:id/lots", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const product = await Product.findOne({ _id: req.params.id, userId });
    if (!product) return res.status(404).json({ error: "Product not found" });
    const { mrp, purchasePrice, sellPrice, quantity, batchNumber, expiryDate } = req.body;
    if (
      typeof mrp !== "number" ||
      typeof purchasePrice !== "number" ||
      typeof sellPrice !== "number" ||
      typeof quantity !== "number"
    ) {
      return res.status(400).json({ error: "Invalid lot data" });
    }
   
    const newLot = await StockLot.create({
      mrp,
      purchasePrice,
      sellPrice,
      quantity,
      batchNumber,
      expiryDate,
      product: product._id
    });
    product.lots.push(newLot._id);
    await product.save();
    res.status(201).json(newLot);
  } catch (err) {
    console.log("Error adding stock lot:", err);
    res.status(500).json({ error: "Failed to add stock lot" });
  }
});

// Get all lots for a product
router.get("/:id/lots", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const product = await Product.findOne({ _id: req.params.id, userId });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product.lots);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch lots" });
  }
});

// Update a stock lot
router.put("/:id/lots/:lotIdx", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const product = await Product.findOne({ _id: req.params.id, userId });
    if (!product) return res.status(404).json({ error: "Product not found" });
    const lotIdx = parseInt(req.params.lotIdx);
    if (isNaN(lotIdx) || lotIdx < 0 || lotIdx >= product.lots.length) {
      return res.status(404).json({ error: "Lot not found" });
    }
    const lot = product.lots[lotIdx];
    const { mrp, purchasePrice, sellPrice, quantity, batchNumber, expiryDate } =
      req.body;
    if (typeof mrp === "number") lot.mrp = mrp;
    if (typeof purchasePrice === "number") lot.purchasePrice = purchasePrice;
    if (typeof sellPrice === "number") lot.sellPrice = sellPrice;
    if (typeof quantity === "number") lot.quantity = quantity;
    if (batchNumber) lot.batchNumber = batchNumber;
    if (expiryDate) lot.expiryDate = expiryDate;
    await product.save();
    res.json(lot);
  } catch (err) {
    res.status(500).json({ error: "Failed to update lot" });
  }
});

// Delete a stock lot
router.delete("/:id/lots/:lotIdx", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const product = await Product.findOne({ _id: req.params.id, userId });
    if (!product) return res.status(404).json({ error: "Product not found" });
    const lotIdx = parseInt(req.params.lotIdx);
    if (isNaN(lotIdx) || lotIdx < 0 || lotIdx >= product.lots.length) {
      return res.status(404).json({ error: "Lot not found" });
    }
    product.lots.splice(lotIdx, 1);
    await product.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete lot" });
  }
});

export default router;
