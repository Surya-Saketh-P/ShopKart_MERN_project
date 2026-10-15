const mongoose = require("mongoose");
const Customer = require("../models/customer.model");
const Product = require("../models/product.model");

const addToCart = async (req, res) => {
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
    const existing = user.cart.find((item) => item.product.toString() === productId);

    const newQty = existing ? existing.quantity + 1 : 1;

    if (newQty > product.stock) {
      return res.status(400).json({ success: false, message: "Not enough stock" });
    }

    if (existing) {
      existing.quantity = newQty;
    } else {
      user.cart.push({ product: productId, quantity: 1 });
    }

    await user.save();
    res.json({ success: true, message: "Cart updated", cart: user.cart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getCart = async (req, res) => {
  try {
    const user = await Customer.findById(req.user._id).populate({
      path: "cart.product",
      select: "name price image stock category",
    });

    res.json({ success: true, cart: user.cart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({ success: false, message: "Quantity must be at least 1" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (quantity > product.stock) {
      return res.status(400).json({ success: false, message: "Quantity exceeds stock" });
    }

    const user = await Customer.findById(req.user._id);
    const item = user.cart.find((i) => i.product.toString() === productId);

    if (!item) {
      return res.status(404).json({ success: false, message: "Product not in cart" });
    }

    item.quantity = quantity;
    await user.save();

    res.json({ success: true, message: "Quantity updated", cart: user.cart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const user = await Customer.findById(req.user._id);
    const idx = user.cart.findIndex((i) => i.product.toString() === productId);

    if (idx === -1) {
      return res.status(404).json({ success: false, message: "Product not in cart" });
    }

    user.cart.splice(idx, 1);
    await user.save();

    res.json({ success: true, message: "Removed from cart", cart: user.cart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { addToCart, getCart, updateQuantity, removeFromCart };
