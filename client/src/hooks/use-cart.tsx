import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CartItemWithProduct, Product } from '@/types';

const CART_STORAGE_KEY = 'saree_customs_cart';

interface CartContextType {
  items: CartItemWithProduct[];
  addItem: (product: Product) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItemWithProduct[]>(() => {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
  });
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product) => {
      setItems(current => {
          const existing = current.find(item => item.productId === product.id);
          if (existing) {
              return current.map(item =>
                  item.productId === product.id
                      ? { ...item, quantity: item.quantity + 1 }
                      : item
              );
          }

          return [...current, {
              id: crypto.randomUUID(),
              sessionId: 'local',
              productId: product.id,
              quantity: 1,
              createdAt: new Date(),
              product
          }];
      });
      setCartOpen(true); // Open cart when adding item
  };

  const updateQuantity = (itemId: string, quantity: number) => {
      if (quantity < 1) return;
      setItems(current =>
          current.map(item =>
              item.id === itemId ? { ...item, quantity } : item
          )
      );
  };

  const removeFromCart = (itemId: string) => {
      setItems(current => current.filter(item => item.id !== itemId));
  };

  return (
    <CartContext.Provider value={{ items, addItem, updateQuantity, removeFromCart, cartOpen, setCartOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
