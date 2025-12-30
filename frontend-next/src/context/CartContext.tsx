'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Define types
export type CartItem = {
    id: string;
    name: string;
    image?: string;
    quantity: number;
    category?: string;
};

interface CartContextType {
    items: CartItem[];
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // Load from local storage if needed
        const saved = localStorage.getItem('cart');
        if (saved) {
            try {
                setItems(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
    }, []);

    useEffect(() => {
        if (isMounted) {
            localStorage.setItem('cart', JSON.stringify(items));
        }
    }, [items, isMounted]);

    const addItem = (item: Omit<CartItem, 'quantity'>) => {
        setItems(current => {
            const existing = current.find(i => i.id === item.id);
            if (existing) {
                return current.map(i =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...current, { ...item, quantity: 1 }];
        });
        setIsOpen(true); // Open cart when adding
    };

    const removeItem = (id: string) => {
        setItems(current => current.filter(i => i.id !== id));
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity < 1) {
            removeItem(id);
            return;
        }
        setItems(current =>
            current.map(i => i.id === id ? { ...i, quantity } : i)
        );
    };

    const clearCart = () => {
        setItems([]);
        setIsOpen(false);
    };

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            items,
            isOpen,
            setIsOpen,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            totalItems
        }}>
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
