import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, subtotal, clearCart } = useCart();

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errs = {};
    if (!address.fullName.trim()) errs.fullName = "Required";
    if (!address.phone.trim()) errs.phone = "Required";
    else if (!/^\d{10}$/.test(address.phone.trim())) errs.phone = "Enter 10 digit number";
    if (!address.addressLine1.trim()) errs.addressLine1 = "Required";
    if (!address.city.trim()) errs.city = "Required";
    if (!address.state.trim()) errs.state = "Required";
    if (!address.pincode.trim()) errs.pincode = "Required";
    else if (!/^\d{6}$/.test(address.pincode.trim())) errs.pincode = "Must be 6 digits";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;
    if (cartItems.length === 0) {
      setApiError("Cart is empty");
      return;
    }

    setPlacing(true);
    setApiError("");

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setApiError("Failed to load payment gateway");
        setPlacing(false);
        return;
      }

      const { data } = await api.post("/orders/create-payment-order", {
        shippingAddress: address,
      });

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "ShopKart",
        description: "ShopKart Order",
        order_id: data.razorpayOrderId,
        handler: async function (response) {
          try {
            await api.post("/orders/verify-payment", {
              shopKartOrderId: data.shopKartOrderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            clearCart();
            navigate(`/orders/${data.shopKartOrderId}`);
          } catch {
            setApiError("Payment verification failed");
            setPlacing(false);
          }
        },
        prefill: {
          name: address.fullName,
          contact: address.phone,
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", function () {
        setApiError("Payment failed. Your cart has not been cleared. Please try again.");
        setPlacing(false);
      });
      paymentObject.open();
    } catch (err) {
      setApiError(err.response?.data?.message || "Failed to create order");
      setPlacing(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>Checkout</h1>

        {apiError && <p className="error-msg">{apiError}</p>}

        <div className="checkout-layout">
          <div className="shipping-form">
            <h2>Shipping Details</h2>
            {["fullName", "phone", "addressLine1", "city", "state", "pincode"].map((field) => (
              <div key={field} className="form-group">
                <input
                  name={field}
                  placeholder={field === "addressLine1" ? "Address" : field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1")}
                  value={address[field]}
                  onChange={handleChange}
                />
                {errors[field] && <span className="field-error">{errors[field]}</span>}
              </div>
            ))}
          </div>

          <div className="order-summary">
            <h2>Order Summary</h2>
            {cartItems.map((item) => (
              <div key={item._id} className="summary-item">
                <span>{item.product?.name} × {item.quantity}</span>
                <span>₹{(item.product?.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <hr />
            <div className="summary-item total">
              <strong>Total</strong>
              <strong>₹{subtotal.toLocaleString()}</strong>
            </div>
            <button onClick={handlePlaceOrder} disabled={placing}>
              {placing ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
