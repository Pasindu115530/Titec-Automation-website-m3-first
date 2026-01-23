'use client';

import React from 'react';
import { MdHomeRepairService } from "react-icons/md";
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function FloatingActionButtons() {
    const { setIsOpen } = useCart();

    return (
        <div className="fixed bottom-10 right-10 z-[99]">
            <div className="flex flex-col gap-1.5 items-center justify-center">
                <div
                    onClick={() => setIsOpen(true)}
                    className="bg-(--secondary-blue) rounded-full p-4 cursor-pointer hover:scale-105 transition-transform shadow-lg"
                >
                    <ShoppingBag color="white" size={30} />
                </div>
                <div className="bg-(--cta-hover-red) rounded-full p-4  cursor-pointer hover:scale-105 transition-transform shadow-lg">
                    <MdHomeRepairService color="white" size={30} />
                </div>
            </div>
        </div>
    );
}
