import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext({
  cartItems: [],
  wishlistItems: [],
  addToCart: () => {},
  addToWishlist: () => {},
  toggleWishlist: () => {},
  removeFromCart: () => {},
  updateCartQuantity: () => {},
  removeFromWishlist: () => {},
});

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('sridurga_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (err) {
        console.warn('Unable to parse saved cart data', err);
      }
    }

    const savedWishlist = localStorage.getItem('sridurga_wishlist');
    if (savedWishlist) {
      try {
        setWishlistItems(JSON.parse(savedWishlist));
      } catch (err) {
        console.warn('Unable to parse saved wishlist data', err);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sridurga_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('sridurga_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToCart = (product, qty = 1) => {
    setCartItems((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prevCart, { ...product, quantity: qty }];
    });
  };

  const addToWishlist = (product, qty = 1) => {
    setWishlistItems((prevWishlist) => {
      const existing = prevWishlist.find((item) => item.id === product.id);
      if (existing) {
        return prevWishlist.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prevWishlist, { ...product, quantity: qty }];
    });
  };

  const toggleWishlist = (product) => {
    setWishlistItems((prevWishlist) => {
      const existing = prevWishlist.find((item) => item.id === product.id);
      if (existing) {
        return prevWishlist.filter((item) => item.id !== product.id);
      }
      return [...prevWishlist, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateCartQuantity = (productId, delta) => {
    setCartItems((prevCart) => prevCart
      .map((item) => (item.id === productId ? { ...item, quantity: item.quantity + delta } : item))
      .filter((item) => item.quantity > 0));
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((prevWishlist) => prevWishlist.filter((item) => item.id !== productId));
  };

  return (
    <CartContext.Provider value={{ cartItems, wishlistItems, addToCart, addToWishlist, toggleWishlist, removeFromCart, updateCartQuantity, removeFromWishlist }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
