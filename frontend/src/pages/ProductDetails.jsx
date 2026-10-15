import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${id}`);
        setProduct(res.data.product);
      } catch {
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await addToCart(product._id);
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <><Navbar /><p className="page-msg">Loading product...</p></>;
  if (error) return (
    <><Navbar />
      <div className="container">
        <p className="page-msg error">{error}</p>
        <button onClick={() => navigate("/products")}>Back to Products</button>
      </div>
    </>
  );

  return (
    <div>
      <Navbar />
      <div className="container">
        <button className="back-btn" onClick={() => navigate("/products")}>← Back</button>
        <div className="detail-layout">
          <img src={product.image} alt={product.name} className="detail-img" />
          <div className="detail-info">
            <h1>{product.name}</h1>
            <span className="tag">{product.category}</span>
            <p className="detail-desc">{product.description}</p>
            <h2 className="price">₹{product.price.toLocaleString()}</h2>
            <p className="stock">{product.stock > 0 ? `${product.stock} in stock` : "Out of Stock"}</p>
            <button onClick={handleAddToCart} disabled={adding}>
              {adding ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;