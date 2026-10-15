import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";

function Cart() {
  const navigate = useNavigate();
  const { cartItems, loading, error, fetchCart, updateQuantity, removeFromCart, subtotal } = useCart();

  if (loading) return <><Navbar /><p className="page-msg">Loading your cart...</p></>;

  if (error) return (
    <><Navbar />
      <div className="container">
        <div className="page-msg error">
          <p>Unable to load your cart.</p>
          <button onClick={fetchCart}>Try Again</button>
        </div>
      </div>
    </>
  );

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>My Cart</h1>

        {cartItems.length === 0 ? (
          <div className="empty-state">
            <p>Your cart is empty 🛒</p>
            <p>Looks like you haven't added anything yet.</p>
            <button onClick={() => navigate("/products")}>Browse Products</button>
          </div>
        ) : (
          <>
            <div className="cart-list">
              {cartItems.map((item) => (
                <div className="cart-item" key={item._id}>
                  <img src={item.product?.image} alt={item.product?.name} />
                  <div className="cart-item-info">
                    <h3>{item.product?.name}</h3>
                    <p className="price">₹{item.product?.price?.toLocaleString()}</p>
                    <div className="qty-controls">
                      <button
                        disabled={item.quantity <= 1}
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                      >−</button>
                      <span>{item.quantity}</span>
                      <button
                        disabled={item.quantity >= item.product?.stock}
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      >+</button>
                    </div>
                    <p>Subtotal: ₹{(item.product?.price * item.quantity).toLocaleString()}</p>
                    <button className="remove-btn" onClick={() => removeFromCart(item.product._id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-summary">
              <h2>Order Summary</h2>
              <p>Items: {cartItems.reduce((s, i) => s + i.quantity, 0)}</p>
              <p className="price">Subtotal: ₹{subtotal.toLocaleString()}</p>
              <button onClick={() => navigate("/checkout")}>Proceed to Checkout</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;
