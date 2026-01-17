'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, Send } from 'lucide-react';
import { useCart } from '@/context/CartContext';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

export default function CartDrawer() {
    const { isOpen, setIsOpen, items, removeItem, updateQuantity, submitQuotationRequest } = useCart();
    const router = useRouter();

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);



    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setIsSubmitting(true);
            await submitQuotationRequest(formData);
            toast.success('Quotation request submitted successfully!');
            setIsOpen(false);
            // Reset form (optional, since modal closes)
            setFormData({ name: '', email: '', phone: '', message: '' });
        } catch (error) {
            console.error('Submission error:', error);
            toast.error('Failed to submit request. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
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
                        className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm flex items-center justify-center p-4"
                    >
                        {/* Modal Container */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
                            >
                                <X className="h-5 w-5 text-gray-500" />
                            </button>

                            {/* Left Side: Form */}
                            <div className="md:w-1/2 p-6 md:p-8 overflow-y-auto border-r border-gray-100">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">Request Quotation</h2>
                                    <p className="text-sm text-gray-500 mt-1">Fill in your details and we'll get back to you with a formal quote.</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Phone Number</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                required
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Message (Optional)</label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            rows={4}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none"
                                            placeholder="Any specific requirements or questions?"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full h-12 text-lg bg-(--secondary-blue) hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 mt-4"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Sending...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <Send className="h-5 w-5" />
                                                Send Request
                                            </span>
                                        )}
                                    </Button>
                                </form>
                            </div>

                            {/* Right Side: Cart Items */}
                            <div className="md:w-1/2 p-6 md:p-8 bg-gray-50/50 flex flex-col h-[50vh] md:h-auto">
                                <div className="flex items-center gap-2 mb-4">
                                    <ShoppingBag className="h-5 w-5 text-indigo-600" />
                                    <h3 className="font-semibold text-gray-900">Items in your list ({items.length})</h3>
                                </div>

                                <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                                    {items.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
                                            <ShoppingBag className="h-12 w-12 opacity-20 mb-3" />
                                            <p>Your list is empty</p>
                                            <button
                                                onClick={() => {
                                                    setIsOpen(false);
                                                    router.push('/store');
                                                }}
                                                className='w-full h-12 text-lg bg-(--secondary-blue) hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 mt-4 text-white font-medium rounded-lg transition-all'
                                            >
                                                Visit Store
                                            </button>
                                        </div>
                                    ) : (
                                        items.map((item) => (
                                            <div key={item.id} className="flex gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                                <div className="h-16 w-16 rounded-lg bg-gray-50 shrink-0 flex items-center justify-center border border-gray-100 overflow-hidden">
                                                    {item.image ? (
                                                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <ShoppingBag className="h-6 w-6 text-gray-300" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                    <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                                                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-gray-400 hover:text-red-500"
                                                    onClick={() => removeItem(item.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-xs text-gray-500 text-center">
                                        By submitting this request, you agree to share your contact details with our sales team.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
