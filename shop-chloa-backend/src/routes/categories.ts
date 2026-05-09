import { Router } from "express";
import Category from "../models/Category";
import { authenticateToken } from "../middleware/authMiddleware";
import Product from "../models/Product";
import mongoose from "mongoose";
const router = Router();

// Get all categories for the authenticated user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    console.log(`Fetching categories for user: ${userId}`);
    const categories = await Category.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "category",
        as: "products"
      }
      },
      {
      $addFields: {
        productCount: { $size: "$products" }
      }
      },
      // {
      // $project: {
      //   products: 0 // exclude products array from result
      // }
      // }
    ]);
    // res.json(categoriesWithCount);
    // const categories = await Category.find({ userId });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// Get a single category for the authenticated user
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const category = await Category.findOne({ _id: req.params.id, userId });
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch category" });
  }
});

// Create a category for the authenticated user
router.post("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { name, description } = req.body;
    const category = new Category({ name, description, userId });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: "Failed to create category" });
  }
});

// Update a category for the authenticated user
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { name, description } = req.body;
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, userId },
      { name, description },
      { new: true }
    );
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: "Failed to update category" });
  }
});

// Delete a category for the authenticated user
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const category = await Category.findOneAndDelete({ _id: req.params.id, userId });
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete category" });
  }
});

export default router;
