import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import {
  getCartApi,
  addToCartApi,
  updateCartItemApi,
  removeCartItemApi,
  clearCartApi,
} from '../services/api';
import { AuthContext } from './AuthContext';
import { toast } from 'react-toastify';

const EMPTY_CART = { items: [], totalPrice: 0 };

const normalizeCartResponse = (data) => {
  if (!data) {
    return EMPTY_CART;
  }

  if (Array.isArray(data)) {
    return {
      items: data,
      totalPrice: data.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.quantity || 0)), 0),
    };
  }

  if (data.cart && typeof data.cart === 'object') {
    const cart = data.cart;
    return {
      items: Array.isArray(cart.items) ? cart.items : [],
      totalPrice: Number(cart.totalPrice || 0),
    };
  }

  if (typeof data === 'object') {
    const items = Array.isArray(data.items) ? data.items : [];
    return {
      items,
      totalPrice: Number(data.totalPrice || items.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.quantity || 0)), 0)),
    };
  }

  return EMPTY_CART;
};

const defaultCartContext = {
  cart: EMPTY_CART,
  cartLoading: false,
  cartCount: 0,
  fetchCart: async () => {},
  addToCart: async () => {},
  updateCartItem: async () => {},
  removeCartItem: async () => {},
  clearCart: async () => {},
};

export const CartContext = createContext(defaultCartContext);

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState(EMPTY_CART);
  const [cartLoading, setCartLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart(EMPTY_CART);
      return;
    }

    try {
      setCartLoading(true);
      const res = await getCartApi();
      setCart(normalizeCartResponse(res?.data));
    } catch (error) {
      setCart(EMPTY_CART);
    } finally {
      setCartLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (bookId, quantity = 1) => {
    try {
      const res = await addToCartApi({ bookId, quantity });
      setCart(normalizeCartResponse(res?.data));
      toast.success('Added to cart!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      const res = await updateCartItemApi(itemId, { quantity });
      setCart(normalizeCartResponse(res?.data));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update cart');
    }
  };

  const removeCartItem = async (itemId) => {
    try {
      const res = await removeCartItemApi(itemId);
      setCart(normalizeCartResponse(res?.data));
      toast.info('Item removed from cart');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      const res = await clearCartApi();
      setCart(normalizeCartResponse(res?.data));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to clear cart');
    }
  };

  const cartCount = Array.isArray(cart.items) ? cart.items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0) : 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartLoading,
        cartCount,
        fetchCart,
        addToCart,
        updateCartItem,
        removeCartItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
