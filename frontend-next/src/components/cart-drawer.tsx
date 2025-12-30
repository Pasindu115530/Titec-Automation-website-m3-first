'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, Send } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';

export default function CartDrawer() {
    const { isOpen, setIsOpen, items, removeItem, updateQuantity, clearCart } = useCart();

    const handleCheckout = () => {
        // Implement actual checkout/quotation logic here
        alert('Listing your items and requesting a quotation...');
        // clearCart(); // Optional: clear after request
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 z-[51] w-full sm:w-[400px] bg-white shadow-2xl flex flex-col"
                    >
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="h-5 w-5 text-indigo-600" />
                                <h2 className="text-lg font-bold text-gray-800">Your Quotation List</h2>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-5 space-y-4">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-gray-400">
                                    <ShoppingBag className="h-16 w-16 opacity-20" />
                                    <p>Your list is empty.</p>
                                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                                        Browse Projects
                                    </Button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="flex gap-4 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                        <div className="h-20 w-20 rounded-lg bg-white shrink-0 flex items-center justify-center overflow-hidden border border-gray-200">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <ShoppingBag className="h-8 w-8 text-gray-300" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                                                <p className="text-xs text-gray-500">{item.category || 'Product'}</p>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center border border-gray-200 rounded-md bg-white">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="px-2 py-1 text-gray-600 hover:bg-gray-50"
                                                    >-</button>
                                                    <span className="text-xs font-medium px-2">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="px-2 py-1 text-gray-600 hover:bg-gray-50"
                                                    >+</button>
                                                </div>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => removeItem(item.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className="p-5 border-t border-gray-100 bg-gray-50/50">
                                <p className="text-xs text-gray-500 mb-4 text-center">Prices are available upon request. Submit this list to receive a formal quotation.</p>
                                <Button className="w-full gap-2 text-lg h-12 shadow-lg shadow-indigo-500/20" onClick={handleCheckout}>
                                    <Send className="h-5 w-5" />
                                    Get Quotation
                                </Button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
