import { createContext, useState, useEffect, useContext, useMemo } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { authUser } = useAuth()

  const fetchCart = async () => {
    try {
      if (!authUser) {
        setCart([])
        return
      }

      const res = await api.get("/cart")
      setCart(res.data.cart);
    } catch (err) {
      console.error("Error fetching cart", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [authUser]);

  const addToCart = async (product, size, quantity) => {
    if (!authUser) return

    try {
      await api.post("/cart", {
        productId: product._id,
        size,
        quantity,
      });

      await fetchCart();
    } catch (error) {
      console.error("Add to cart failed", error);
      throw error;
    }
  };


  async function removeFromCart(item) {
    try {
      await api.delete("/cart", {
        data: {
          productId: item.productId._id,
          size: item.size,
        },
      });

      await fetchCart();
    } catch (err) {
      console.error("Error removing item:", err);
    }
  }

  async function clearCart() {
    try {
      const deleteItems = cart.map((item) =>
        api.delete("/cart", {
          data: {
            productId: item.productId._id,
            size: item.size,
          },
        })
      )

      await Promise.all(deleteItems)

      setCart([])
    } catch (error) {
      console.log("error for removing cart", error)
    }
  }

  function resetCart() {
    setCart([])
  }

  async function updateQuantity(item, newQty) {
    if (newQty < 1) return;

    try {
      await api.patch("/cart", {
        productId: item.productId._id,
        size: item.size,
        quantity: newQty
      });

      await fetchCart();
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  }


  const subtotal = useMemo(() => {
    return cart.reduce(
      (acc, item) => acc + item.productId.price * item.quantity,
      0
    );
  }, [cart]);


  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, subtotal, clearCart, resetCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
