import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data.order);
      } catch {
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <><Navbar /><p className="page-msg">Loading...</p></>;
  if (!order) return <><Navbar /><p className="page-msg error">Order not found</p></>;

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="order-success">
          <h1>✅ Order {order.status === "PLACED" || order.status === "CONFIRMED" ? "Placed Successfully" : order.status}</h1>
          <p>Order ID: {order._id}</p>
          <p className="price">Total: ₹{order.totalAmount.toLocaleString()}</p>
          <p>Status: <span className={"status " + order.status.toLowerCase()}>{order.status}</span></p>
          <p>Payment: {order.paymentStatus}</p>

          <h3>Items</h3>
          {order.items.map((item, i) => (
            <div key={i} className="summary-item">
              <span>{item.name} × {item.quantity}</span>
              <span>₹{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}

          <h3>Shipping</h3>
          <p>{order.shippingAddress.fullName}</p>
          <p>{order.shippingAddress.addressLine1}, {order.shippingAddress.city}</p>
          <p>{order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
          <p>Phone: {order.shippingAddress.phone}</p>

          <div className="order-actions">
            <button onClick={() => navigate("/orders")}>View My Orders</button>
            <button onClick={() => navigate("/products")}>Continue Shopping</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
