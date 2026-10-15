const mongoose = require("mongoose");
const Customer = require("../models/customer.model");
const Product = require("../models/product.model");

const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const user = await Customer.findById(req.user._id);

    if (user.wishlist.some((id) => id.toString() === productId)) {
      return res.status(409).json({ success: false, message: "Product already in wishlist" });
    }

    user.wishlist.push(productId);
    await user.save();

    res.json({ success: true, message: "Product added to wishlist" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getWishlist = async (req, res) => {
  try {
    const user = await Customer.findById(req.user._id).populate({
      path: "wishlist",
      select: "name price category image stock",
    });

    res.json({ success: true, count: user.wishlist.length, wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const user = await Customer.findById(req.user._id);

    const idx = user.wishlist.findIndex((id) => id.toString() === productId);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: "Product not in wishlist" });
    }

    user.wishlist.splice(idx, 1);
    await user.save();

    res.json({ success: true, message: "Product removed from wishlist" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { addToWishlist, getWishlist, removeFromWishlist };
