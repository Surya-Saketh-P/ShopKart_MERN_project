# 🛍️ ShopKart — Fullstack MERN E-Commerce Platform

A production-style e-commerce web application built using the **MERN stack** (MongoDB, Express, React, Node.js), developed across Engineering Labs 01 to 06.

---

## 📑 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
- [API Reference](#-api-reference)
- [Testing & Postman Collection](#-testing--postman-collection)

---

## ✨ Features

### 🔐 1. Authentication & Session Management (Labs 01 & 02)
- Customer registration with validation (password min 6 chars, email format).
- Secure password hashing using `bcrypt`.
- JWT-based authentication stored in `httpOnly` cookies with fallback to `Bearer` tokens.
- Protected route handling on both backend and frontend.

### 📦 2. Product Catalog & Discovery (Lab 03)
- Dynamic product browsing with category filtering (Electronics, Fashion, Books, Home).
- Real-time client-side and server-side search by product name/keyword.
- Detailed product view page (`/products/:id`) with stock tracking.
- Pre-configured database seeder (`node seed.js`) with realistic products.

### ❤️ 3. Wishlist System (Lab 04)
- MongoDB relationship referencing via `ObjectId`s (`ref: "Product"`).
- Add/remove items with duplicate prevention (HTTP `409 Conflict`).
- Dedicated Wishlist page displaying populated product details.
- Instant UI state reflection without full-page reloads.

### 🛒 4. Shopping Cart (Lab 05)
- Global cart state powered by React Context API (`CartContext`).
- Auto-increment quantity when re-adding existing items.
- In-cart quantity adjustment (`+` / `-`) strictly bounded by product inventory stock limits.
- Dynamic derived calculations for total item count and order subtotal.
- Cart badge in navigation bar syncing across routes.

### 💳 5. Checkout & Razorpay Payment Gateway (Lab 06)
- Comprehensive shipping address form with strict client-side and server-side validation (6-digit pincode, 10-digit phone).
- Server-side order total calculation ignoring any client-tampered totals.
- Razorpay order creation via official Razorpay Node.js SDK.
- Razorpay Checkout modal integration with payment failure handling.
- Cryptographic payment verification using HMAC SHA-256 signature matching.
- Automatic cart clearing upon successful payment confirmation.
- Order snapshot architecture preserving purchase-time price, name, and image.
- Order History (`/orders`) and Order Confirmation/Details (`/orders/:id`) pages.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, React Router DOM 7, Axios, Vanilla CSS |
| **Backend** | Node.js, Express 5, Mongoose 9, JSON Web Token (JWT), bcrypt |
| **Payment Gateway** | Razorpay Node SDK & Razorpay Checkout.js |
| **Database** | MongoDB Atlas / Local MongoDB |

---

## 📁 Project Architecture

```text
MERN_LAB/
├── backend/
│   ├── config/
│   │   └── razorpay.js          # Razorpay client instance
│   ├── controllers/
│   │   ├── customer.controller.js # Register, login, logout, profile
│   │   ├── product.controller.js  # CRUD & search/filter products
│   │   ├── wishlist.controller.js # Add, get, remove wishlist
│   │   ├── cart.controller.js     # Add, update qty, remove cart
│   │   └── order.controller.js    # Create Razorpay order, verify HMAC, fetch orders
│   ├── middlewares/
│   │   └── auth.middleware.js   # JWT cookie & Bearer token verification
│   ├── models/
│   │   ├── customer.model.js    # Customer schema with embedded cart & wishlist refs
│   │   ├── product.model.js     # Product schema with stock & validations
│   │   └── order.model.js       # Order snapshot schema with shipping & payment status
│   ├── routes/                  # Express route routers
│   ├── utils/                   # Token generator utility
│   ├── seed.js                  # Database seeder script
│   ├── index.js                 # Express server entry point
│   ├── .env.example             # Template for environment variables
│   └── .gitignore               # Ignores .env and node_modules
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx       # Dynamic navigation bar with badge counts
│   │   ├── context/
│   │   │   └── CartContext.jsx  # Global Cart state management
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Landing page
│   │   │   ├── Login.jsx        # Login page
│   │   │   ├── Register.jsx     # Registration page
│   │   │   ├── Products.jsx     # Catalog with search & filter
│   │   │   ├── ProductDetails.jsx # Single product view
│   │   │   ├── Wishlist.jsx     # Customer wishlist page
│   │   │   ├── Cart.jsx         # Shopping cart page
│   │   │   ├── Checkout.jsx     # Shipping address & Razorpay checkout
│   │   │   ├── Orders.jsx       # Order history list
│   │   │   └── OrderDetails.jsx # Order confirmation & invoice summary
│   │   ├── services/
│   │   │   └── api.js           # Axios instance with credentials
│   │   ├── App.jsx              # Routes configuration
│   │   ├── main.jsx             # React entry point
│   │   └── index.css            # Minimal clean UI styling (no gradients)
│   ├── vite.config.js           # Vite dev server with /api proxy rewrite
│   └── package.json
└── .gitignore                   # Root gitignore protecting secrets
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or free MongoDB Atlas URI)
- [Razorpay Account](https://dashboard.razorpay.com/) (Free Test Mode keys)

---

### 1. Clone Repository

```bash
git clone https://github.com/Surya-Saketh-P/ShopKart_MERN_project.git
cd ShopKart_MERN_project
```

---

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` file from the provided template:
   ```bash
   cp .env.example .env
   ```

4. Configure your environment variables in `backend/.env`:
   ```env
   PORT=3000
   MONGO_URI="your_mongodb_connection_string"
   JWT_SECRET="your_jwt_secret_key"
   RAZORPAY_KEY_ID="rzp_test_YOUR_KEY_ID"
   RAZORPAY_KEY_SECRET="YOUR_KEY_SECRET"
   ```

5. Seed sample products into MongoDB:
   ```bash
   node seed.js
   ```

6. Start the backend server:
   ```bash
   node index.js
   ```
   > The backend runs on `http://localhost:3000`.

---

### 3. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   > The application will be accessible at `http://localhost:5173`.

---

## 📡 API Reference

### 👤 Customer Authentication (`/customers`)
| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `POST` | `/customers/register` | No | Register a new user |
| `POST` | `/customers/login` | No | Login and receive JWT cookie & token |
| `GET` | `/customers/me` | Yes | Get currently authenticated profile |
| `POST` | `/customers/logout` | No | Clear authentication cookie |

### 📦 Product Catalog (`/products`)
| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `GET` | `/products` | No | Get all products (supports `?search=` and `?category=`) |
| `GET` | `/products/:id` | No | Get single product details by ID |
| `POST` | `/products` | No | Add a product to the catalog |

### ❤️ Wishlist (`/wishlist`)
| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `POST` | `/wishlist/:productId` | Yes | Add product to user wishlist (prevents duplicates) |
| `GET` | `/wishlist` | Yes | Get populated wishlist items |
| `DELETE` | `/wishlist/:productId` | Yes | Remove product from wishlist |

### 🛒 Shopping Cart (`/cart`)
| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `POST` | `/cart/:productId` | Yes | Add product to cart (auto-increments qty) |
| `GET` | `/cart` | Yes | Get populated cart items and quantities |
| `PATCH` | `/cart/:productId` | Yes | Update item quantity (validates stock limit) |
| `DELETE` | `/cart/:productId` | Yes | Remove item from cart |

### 💳 Checkout & Orders (`/orders`)
| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `POST` | `/orders/create-payment-order` | Yes | Validate cart/stock & create Razorpay order |
| `POST` | `/orders/verify-payment` | Yes | Verify HMAC signature, set status to PAID, clear cart |
| `GET` | `/orders` | Yes | Get all placed orders for current user |
| `GET` | `/orders/:id` | Yes | Get specific order details (ownership protected) |

---

## 🧪 Testing & Postman Collection

All endpoints are fully automated and verified.

### Automated Test Runner
You can run an automated end-to-end verification script against your running backend:
```bash
# In backend directory
node seed.js
node index.js
```
The test suite validates status codes, error states, duplicate prevention, stock boundaries, Razorpay orders, and cryptographic HMAC signatures.

---

## 📄 License
This project was developed for educational purposes as part of the MERN Stack Engineering Labs curriculum.
