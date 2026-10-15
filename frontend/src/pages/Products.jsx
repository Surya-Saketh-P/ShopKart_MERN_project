import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";

function Products() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [wishlistLoading, setWishlistLoading] = useState({});
  const [wishlistDone, setWishlistDone] = useState({});
  const [cartLoading, setCartLoading] = useState({});

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      const res = await api.get("/products", { params });
      setProducts(res.data.products || []);
    } catch {
      setError("Something went wrong while loading products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, category]);

  const handleWishlist = async (productId) => {
    if (wishlistLoading[productId]) return;
    setWishlistLoading((p) => ({ ...p, [productId]: true }));
    try {
      await api.post(`/wishlist/${productId}`);
      setWishlistDone((p) => ({ ...p, [productId]: true }));
    } catch (err) {
      alert(err.response?.data?.message || "Could not add to wishlist");
    } finally {
      setWishlistLoading((p) => ({ ...p, [productId]: false }));
    }
  };

  const handleAddToCart = async (productId) => {
    if (cartLoading[productId]) return;
    setCartLoading((p) => ({ ...p, [productId]: true }));
    try {
      await addToCart(productId);
    } catch (err) {
      alert(err.response?.data?.message || "Could not add to cart");
    } finally {
      setCartLoading((p) => ({ ...p, [productId]: false }));
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>Products</h1>
        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Books">Books</option>
            <option value="Home">Home</option>
          </select>
        </div>

        {loading && <p className="page-msg">Loading products...</p>}
        {error && <p className="page-msg error">{error}</p>}
        {!loading && !error && products.length === 0 && <p className="page-msg">No products found.</p>}

        <div className="product-grid">
          {products.map((p) => (
            <div className="card" key={p._id}>
              <img src={p.image} alt={p.name} />
              <div className="card-body">
                <h3>{p.name}</h3>
                <span className="tag">{p.category}</span>
                <p className="price">₹{p.price.toLocaleString()}</p>
                <p className="stock">{p.stock > 0 ? `${p.stock} in stock` : "Out of Stock"}</p>
                <div className="card-actions">
                  <button onClick={() => navigate(`/products/${p._id}`)}>View Details</button>
                  <button
                    onClick={() => handleWishlist(p._id)}
                    disabled={wishlistLoading[p._id] || wishlistDone[p._id]}
                  >
                    {wishlistLoading[p._id] ? "Saving..." : wishlistDone[p._id] ? "♥ Wishlisted" : "♡ Wishlist"}
                  </button>
                  <button
                    onClick={() => handleAddToCart(p._id)}
                    disabled={cartLoading[p._id]}
                  >
                    {cartLoading[p._id] ? "Adding..." : "Add to Cart"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Products;