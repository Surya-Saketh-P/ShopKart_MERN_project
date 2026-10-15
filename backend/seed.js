require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/product.model");

const sampleProducts = [
  {
    name: "Wireless Noise Cancelling Headphones",
    description: "Premium over-ear Bluetooth headphones with active noise cancellation and 30-hour battery life.",
    price: 4999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
    stock: 20,
  },
  {
    name: "Mechanical Gaming Keyboard",
    description: "RGB backlit mechanical keyboard with tactile blue switches and detachable USB-C cable.",
    price: 2499,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80",
    stock: 15,
  },
  {
    name: "Smart Fitness Watch",
    description: "Waterproof fitness tracker with heart rate monitor, AMOLED display, and sleep tracking.",
    price: 3499,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
    stock: 12,
  },
  {
    name: "Classic Cotton Crewneck T-Shirt",
    description: "100% breathable organic cotton slim-fit everyday t-shirt in slate grey.",
    price: 799,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&q=80",
    stock: 35,
  },
  {
    name: "Urban Denim Jacket",
    description: "Vintage-washed rugged denim jacket with brass buttons and dual chest pockets.",
    price: 2199,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&q=80",
    stock: 18,
  },
  {
    name: "Clean Code by Robert C. Martin",
    description: "A handbook of agile software craftsmanship. The essential guide for writing maintainable code.",
    price: 999,
    category: "Books",
    image: "https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?w=500&q=80",
    stock: 25,
  },
  {
    name: "Atomic Habits by James Clear",
    description: "An easy and proven way to build good habits and break bad ones. Global bestseller.",
    price: 499,
    category: "Books",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80",
    stock: 40,
  },
  {
    name: "Minimalist Ceramic Coffee Mug",
    description: "Handcrafted 350ml matte ceramic mug, microwave and dishwasher safe.",
    price: 399,
    category: "Home",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&q=80",
    stock: 30,
  },
  {
    name: "Ergonomic Desk Lamp",
    description: "Adjustable LED desk lamp with 5 brightness levels, touch control, and USB charging port.",
    price: 1299,
    category: "Home",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80",
    stock: 14,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    for (const p of sampleProducts) {
      const exists = await Product.findOne({ name: p.name });
      if (!exists) {
        await Product.create(p);
        console.log(`+ Added: ${p.name}`);
      } else {
        console.log(`• Already exists: ${p.name}`);
      }
    }

    console.log("Seeding finished successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();
