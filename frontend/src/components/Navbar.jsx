import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";

function Navbar() {
  const navigate = useNavigate();
  const { totalItems } = useCart();

  const handleLogout = async () => {
    try {
      await api.post("/customers/logout");
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="navbar">
      <Link to="/home" className="nav-brand">ShopKart</Link>
      <div className="nav-links">
        <Link to="/products">Products</Link>
        <Link to="/wishlist">Wishlist</Link>
        <Link to="/cart">Cart ({totalItems})</Link>
        <Link to="/orders">Orders</Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;