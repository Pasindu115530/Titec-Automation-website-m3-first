"use client"

import Loader from "@/components/loader";
import Footer from "../../components/footer";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

const PRODUCTS = [
    { id: 'p1', name: 'Industrial Sensor', price: 149, desc: 'Robust sensor for harsh environments.', category: 'Sensors' },
    { id: 'p2', name: 'PLC Starter Kit', price: 549, desc: 'Includes PLC, power supply and I/O modules.', category: 'Controllers' },
    { id: 'p3', name: 'HMI Panel 7"', price: 299, desc: '7-inch touch HMI with pre-built templates.', category: 'Interfaces' },
    { id: 'p4', name: 'Servo Motor 1kW', price: 899, desc: 'High-precision servo motor with encoder.', category: 'Motors' },
    { id: 'p5', name: 'Safety Relay Module', price: 199, desc: 'Certified safety relay for emergency stops.', category: 'Safety' },
    { id: 'p6', name: 'Industrial Switch 8-Port', price: 349, desc: 'Ruggedized Ethernet switch for harsh conditions.', category: 'Networking' },
]

export default function Store() {
    const [loading, setLoading] = useState(true);
    const { addItem } = useCart();
    const { isAdmin } = useAuth();

    // Helper function to create a pause
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const loadingFunc = async () => {
        setLoading(true);
        await sleep(1000);
        setLoading(false);
    }

    useEffect(() => {
        loadingFunc();
    }, []);

    const handleAddToQuotation = (product: typeof PRODUCTS[0]) => {
        addItem({
            id: product.id,
            name: product.name,
            category: product.category,
            description: product.desc,
        });
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <>
            <main className="max-w-6xl mx-auto px-6 py-12">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold">Product Catalog</h1>
                    <p className="text-gray-600">Browse our products. Request a quotation for pricing.</p>
                </div>

                {isAdmin && (
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                            <strong>Admin View:</strong> Prices are hidden from customers. Customers can only add items to quotation requests.
                        </p>
                    </div>
                )}

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {PRODUCTS.map(p => (
                        <div key={p.id} className="border rounded-lg p-4 bg-white hover:shadow-lg transition-shadow">
                            <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded mb-4 flex items-center justify-center">
                                <ShoppingBag className="w-16 h-16 text-gray-400" />
                            </div>
                            <div className="space-y-2">
                                <div className="font-semibold text-lg">{p.name}</div>
                                <div className="text-xs text-gray-500 uppercase">{p.category}</div>
                                <div className="text-gray-600 text-sm mb-3">{p.desc}</div>
                                <div className="flex items-center justify-between pt-2">
                                    {/* Price is hidden for customers, shown for admins */}
                                    {isAdmin ? (
                                        <div className="text-lg font-bold text-gray-700">${p.price}</div>
                                    ) : (
                                        <div className="text-sm text-gray-500 italic">Price on request</div>
                                    )}
                                    <Button 
                                        onClick={() => handleAddToQuotation(p)}
                                        size="sm"
                                        className="gap-2"
                                    >
                                        <ShoppingBag className="w-4 h-4" />
                                        Add to Quotation
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </>
    )
}
