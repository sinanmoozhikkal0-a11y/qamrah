import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { api } from '../services/api';

const CartContext = createContext();

const CART_STORAGE_KEY = 'qamrah_cart_items_v2';
const DEFAULT_FREE_SHIPPING_THRESHOLD = 999;
const DEFAULT_STANDARD_SHIPPING_FEE = 49;

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading cart from storage', e);
      return [];
    }
  });

  const [shippingFee, setShippingFee] = useState(DEFAULT_STANDARD_SHIPPING_FEE);
  const [freeThreshold, setFreeThreshold] = useState(DEFAULT_FREE_SHIPPING_THRESHOLD);
  const [coupon, setCoupon] = useState(null);
  const { addToast } = useToast();

  // Load dynamic shipping rules from CMS settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await api.settings.get();
        if (res.success && res.data) {
          if (res.data.shippingCharge !== undefined) setShippingFee(Number(res.data.shippingCharge));
          if (res.data.freeShippingThreshold !== undefined) setFreeThreshold(Number(res.data.freeShippingThreshold));
        }
      } catch (e) {
        // use fallback defaults
      }
    };
    loadSettings();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Error saving cart to storage', e);
    }
  }, [cartItems]);

  const addToCart = (
    product,
    selectedWeight = '250g',
    quantity = 1,
    packDesign = 'Classic QAMRAH Pack',
    packPriceAdjustment = 0
  ) => {
    if (!product) return;

    if (product.inStock === false || (product.stock !== undefined && Number(product.stock) <= 0)) {
      addToast(`"${product.name}" is currently out of stock.`, 'error');
      return;
    }

    // Find matching weight price if available
    let unitPrice = product.price;
    let unitOriginalPrice = product.originalPrice || product.mrp || product.price;

    if (product.availableWeights) {
      const weightOption = product.availableWeights.find((w) => w.label === selectedWeight);
      if (weightOption) {
        unitPrice = weightOption.price;
        unitOriginalPrice = weightOption.originalPrice || weightOption.price;
      }
    }

    const itemKey = product.slug || product.id || product._id;

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => (item.id === itemKey || item.slug === product.slug) && item.weight === selectedWeight && item.packDesign === packDesign
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            id: itemKey,
            productId: product._id || product.id || itemKey,
            name: product.name,
            slug: product.slug,
            image: product.mainImage || product.image || '/images/pouch_cashew.jpg',
            categoryName: product.categoryName || product.category || 'Premium Nuts',
            weight: selectedWeight,
            price: unitPrice,
            originalPrice: unitOriginalPrice,
            quantity: quantity,
            packDesign: packDesign || 'Classic QAMRAH Pack',
            packPriceAdjustment: Number(packPriceAdjustment) || 0
          }
        ];
      }
    });

    const packNotice = packPriceAdjustment > 0 ? ` (${packDesign} +₹${packPriceAdjustment})` : '';
    addToast(`Added ${quantity}x ${product.name} [${selectedWeight}]${packNotice} to cart`);
  };

  const removeFromCart = (id, weight, packDesign = 'Classic QAMRAH Pack') => {
    setCartItems((prev) => {
      const itemToRemove = prev.find(
        (item) => item.id === id && item.weight === weight && (item.packDesign === packDesign || !item.packDesign)
      );
      if (itemToRemove) {
        addToast(`Removed ${itemToRemove.name} from cart`);
      }
      return prev.filter(
        (item) => !(item.id === id && item.weight === weight && (item.packDesign === packDesign || !item.packDesign))
      );
    });
  };

  const updateQuantity = (id, weight, newQty, packDesign = 'Classic QAMRAH Pack') => {
    if (newQty <= 0) {
      removeFromCart(id, weight, packDesign);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.weight === weight && (item.packDesign === packDesign || !item.packDesign)
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  const increaseQuantity = (id, weight, packDesign = 'Classic QAMRAH Pack') => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.weight === weight && (item.packDesign === packDesign || !item.packDesign)
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (id, weight, packDesign = 'Classic QAMRAH Pack') => {
    setCartItems((prev) =>
      prev.reduce((acc, item) => {
        if (item.id === id && item.weight === weight && (item.packDesign === packDesign || !item.packDesign)) {
          if (item.quantity > 1) {
            acc.push({ ...item, quantity: item.quantity - 1 });
          }
        } else {
          acc.push(item);
        }
        return acc;
      }, [])
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setCoupon(null);
  };

  const applyCoupon = (code) => {
    const cleanCode = (code || '').trim().toUpperCase();
    if (cleanCode === 'QAMRAH10') {
      setCoupon({ code: 'QAMRAH10', discountPercent: 10, label: '10% Welcome Luxury Discount' });
      addToast('Coupon QAMRAH10 applied! 10% off your order.');
      return { success: true, message: '10% discount applied!' };
    } else if (cleanCode === 'GOLD20') {
      setCoupon({ code: 'GOLD20', discountPercent: 20, label: '20% Gold Member Privilege' });
      addToast('Coupon GOLD20 applied! 20% off your order.');
      return { success: true, message: '20% discount applied!' };
    } else {
      return { success: false, message: 'Invalid promo code. Try "QAMRAH10" or "GOLD20"' };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    addToast('Coupon code removed');
  };

  // Calculations with pack design adjustments
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price + (item.packPriceAdjustment || 0)) * item.quantity,
    0
  );
  const discountAmount = coupon ? Math.round((subtotal * coupon.discountPercent) / 100) : 0;
  const discountedSubtotal = subtotal - discountAmount;
  const shipping = subtotal === 0 || discountedSubtotal >= freeThreshold ? 0 : shippingFee;
  const total = subtotal === 0 ? 0 : discountedSubtotal + shipping;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const amountToFreeShipping = Math.max(0, freeThreshold - discountedSubtotal);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        coupon,
        applyCoupon,
        removeCoupon,
        subtotal,
        discountAmount,
        discountedSubtotal,
        shipping,
        total,
        totalItems,
        amountToFreeShipping,
        freeShippingThreshold: freeThreshold,
        shippingFee
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
