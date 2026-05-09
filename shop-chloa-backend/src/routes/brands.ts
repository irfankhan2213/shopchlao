import { Router } from "express";
import Brand from "../models/Brand";
import { authenticateToken } from "../middleware/authMiddleware";
const router = Router();

// Get all brands for the authenticated user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const brands = await Brand.find({ userId });
    res.json(brands);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch brands" });
  }
});

// Get a single brand for the authenticated user
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const brand = await Brand.findOne({ _id: req.params.id, userId });
    if (!brand) return res.status(404).json({ error: "Brand not found" });
    res.json(brand);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch brand" });
  }
});

// Create a brand for the authenticated user
router.post("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { name, description } = req.body;
    const brand = new Brand({ name, description, userId });
    await brand.save();
    res.status(201).json(brand);
  } catch (err) {
    res.status(500).json({ error: "Failed to create brand" });
  }
});

// Update a brand for the authenticated user
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { name, description } = req.body;
    const brand = await Brand.findOneAndUpdate(
      { _id: req.params.id, userId },
      { name, description },
      { new: true }
    );
    if (!brand) return res.status(404).json({ error: "Brand not found" });
    res.json(brand);
  } catch (err) {
    res.status(500).json({ error: "Failed to update brand" });
  }
});

// Delete a brand for the authenticated user
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const brand = await Brand.findOneAndDelete({ _id: req.params.id, userId });
    if (!brand) return res.status(404).json({ error: "Brand not found" });
    res.json({ message: "Brand deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete brand" });
  }
});

export default router;
