const express = require("express");

const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");

const {
  registerCustomer,
  loginCustomer,
  getMe,
  logoutCustomer,
} = require("../controllers/customer.controller");

router.post("/register", registerCustomer);
router.post("/login", loginCustomer);
router.get("/me", authMiddleware, getMe);
router.post("/logout", authMiddleware, logoutCustomer);

module.exports = router;