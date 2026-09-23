import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const WishlistContext = createContext();

const WISHLIST_STORAGE_KEY = 'qamrah_wishlist_items_v1';

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading wishlist from storage', e);
      return [];
    }
  });

  const { addToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems));
    } catch (e) {
      console.error('Error saving wishlist to storage', e);
    }
  }, [wishlistItems]);

  const isInWishlist = (id) => {
    return wishlistItems.some((item) => item.id === id);
  };

  const addToWishlist = (product) => {
    if (!isInWishlist(product.id)) {
      setWishlistItems((prev) => [...prev, product]);
      addToast(`Added ${product.name} to your Wishlist ♥`);
    }
  };

  const removeFromWishlist = (id) => {
    setWishlistItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) {
        addToast(`Removed ${item.name} from Wishlist`);
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        clearWishlist,
        wishlistCount: wishlistItems.length
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
