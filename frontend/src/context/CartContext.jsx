import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/cart");
      setCartItems(res.data.cart || []);
    } catch {
      setError("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (productId) => {
    await api.post(`/cart/${productId}`);
    await fetchCart();
  };

  const updateQuantity = async (productId, quantity) => {
    await api.patch(`/cart/${productId}`, { quantity });
    await fetchCart();
  };

  const removeFromCart = async (productId) => {
    await api.delete(`/cart/${productId}`);
    await fetchCart();
  };

  const clearCart = () => setCartItems([]);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        error,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
