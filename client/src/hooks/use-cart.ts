import { useState, useEffect } from 'react';
import { products } from '@/data/products';
import type { CartItemWithProduct } from '@/types';

const CART_STORAGE_KEY = 'saree_customs_cart';

export function useCart() {
    const [items, setItems] = useState<CartItemWithProduct[]>(() => {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(() => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    const addToCart = (productId: string) => {
        setItems(current => {
            const existing = current.find(item => item.productId === productId);
            if (existing) {
                return current.map(item =>
                    item.productId === productId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            const product = products.find(p => p.id === productId);
            if (!product) return current;

            return [...current, {
                id: crypto.randomUUID(),
                sessionId: 'local',
                productId,
                quantity: 1,
                createdAt: new Date(),
                product
            }];
        });
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

    return {
        items,
        addToCart,
        updateQuantity,
        removeFromCart
    };
}
