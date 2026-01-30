'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { quotationService } from '@/services/quotationService';

// Define types
export type CartItem = {
    id: string;
    name: string;
    image?: string;
    quantity: number;
    category?: string;
    description?: string;
};

export type QuotationRequest = {
    id: string;
    customerId?: string;
    customerName?: string;
    customerEmail?: string;
    items: CartItem[];
    status: 'pending' | 'reviewed' | 'quoted' | 'rejected';
    submittedAt: string;
    notes?: string;
};

interface CartContextType {
    items: CartItem[];
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    addItem: (item: Omit<CartItem, 'quantity'>, openDrawer?: boolean) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    submitQuotationRequest: (data: { name: string; email: string; phone: string; message: string }) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // Load from local storage if needed - using 'quotationCart' key instead of 'cart'
        const saved = localStorage.getItem('quotationCart');
        if (saved) {
            try {
                setItems(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse quotation cart", e);
            }
        }
    }, []);

    useEffect(() => {
        if (isMounted) {
            localStorage.setItem('quotationCart', JSON.stringify(items));
        }
    }, [items, isMounted]);

    const addItem = (item: Omit<CartItem, 'quantity'>, openDrawer: boolean = true) => {
        setItems(current => {
            const existing = current.find(i => i.id === item.id);
            if (existing) {
                return current.map(i =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...current, { ...item, quantity: 1 }];
        });
        if (openDrawer) {
            setIsOpen(true); // Open cart when adding
        }
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

    const submitQuotationRequest = async (customerData: { name: string; email: string; phone: string; message: string }) => {
        // Map cart items to backend format: { product_id, quantity }
        const formattedItems = items.map(item => ({
            product_id: parseInt(item.id), // Ensure ID is number for backend if needed, or keep string if backend supports UUID
            quantity: item.quantity
        }));

        const payload = {
            ...customerData,
            items: formattedItems
        };

        try {
            await quotationService.createQuotationRequest(payload);
            clearCart();
        } catch (error) {
            console.error("Submission failed", error);
            throw error;
        }
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
            totalItems,
            submitQuotationRequest,
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
