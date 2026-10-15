import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Wishlist() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/wishlist");
      setWishlist(res.data.wishlist || []);
    } catch {
      setError("Unable to load wishlist.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await api.delete(`/wishlist/${productId}`);
      setWishlist((prev) => prev.filter((p) => p._id !== productId));
    } catch {
      alert("Failed to remove");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>My Wishlist</h1>

        {loading && <p className="page-msg">Loading your wishlist...</p>}
        {error && (
          <div className="page-msg error">
            <p>{error}</p>
            <button onClick={fetchWishlist}>Try Again</button>
          </div>
        )}

        {!loading && !error && wishlist.length === 0 && (
          <div className="empty-state">
            <p>Your wishlist is empty ❤️</p>
            <p>Start saving products you love.</p>
            <button onClick={() => navigate("/products")}>Browse Products</button>
          </div>
        )}

        <div className="product-grid">
          {wishlist.map((p) => (
            <div className="card" key={p._id}>
              <img src={p.image} alt={p.name} />
              <div className="card-body">
                <h3>{p.name}</h3>
                <span className="tag">{p.category}</span>
                <p className="price">₹{p.price.toLocaleString()}</p>
                <p className="stock">{p.stock > 0 ? `${p.stock} in stock` : "Out of Stock"}</p>
                <div className="card-actions">
                  <button onClick={() => navigate(`/products/${p._id}`)}>View Details</button>
                  <button onClick={() => handleRemove(p._id)}>Remove ♥</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Wishlist;
