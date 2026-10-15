import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders");
        setOrders(res.data.orders || []);
      } catch {
        setError("Unable to load orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <><Navbar /><p className="page-msg">Loading orders...</p></>;

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>My Orders</h1>

        {error && <p className="page-msg error">{error}</p>}

        {!error && orders.length === 0 && (
          <div className="empty-state">
            <p>You have not placed any orders yet.</p>
            <button onClick={() => navigate("/products")}>Start Shopping</button>
          </div>
        )}

        {orders.map((order) => (
          <div className="order-card" key={order._id}>
            <div className="order-header">
              <span>Order #{order._id.slice(-8)}</span>
              <span>{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="order-items-list">
              {order.items.map((item, i) => (
                <p key={i}>{item.name} × {item.quantity}</p>
              ))}
            </div>
            <div className="order-footer">
              <span className="price">Total: ₹{order.totalAmount.toLocaleString()}</span>
              <span className={"status " + order.status.toLowerCase()}>{order.status}</span>
              <button onClick={() => navigate(`/orders/${order._id}`)}>View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;
