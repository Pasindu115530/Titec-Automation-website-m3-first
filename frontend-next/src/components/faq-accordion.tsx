"use client";

import { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { FAQs } from "@/assets/FAQ";
import type { FAQ } from "@/assets/FAQ";

export default function FaqAccordion() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div className="space-y-6 mt-12">
            {FAQs.map((FAQ: FAQ, i) => {
                const isOpen = openIndex === i;
                return (
                    <div key={i} className="flex gap-4 items-start group">
                        {/* Toggle Button */}
                        <button
                            className="w-12 h-12 flex-shrink-0 rounded-full bg-[#091063] text-white flex items-center justify-center text-xl shadow-md transition-transform duration-200 hover:scale-105 active:scale-95"
                            onClick={() => setOpenIndex(isOpen ? null : i)}
                            aria-label={isOpen ? "Close question" : "Open question"}
                        >
                            {isOpen ? <FaMinus /> : <FaPlus />}
                        </button>

                        {/* Question/Answer Bubble */}
                        <div
                            className={`flex-1 bg-[#091063] text-white shadow-md transition-all duration-300 ease-in-out cursor-pointer ${isOpen ? 'rounded-3xl p-6' : 'rounded-[2rem] px-6 py-3 flex items-center min-h-[48px]'
                                }`}
                            onClick={() => setOpenIndex(isOpen ? null : i)}
                        >
                            <div className="w-full">
                                <h3 className={`font-medium text-sm leading-snug ${isOpen ? 'mb-4' : 'm-0'}`}>
                                    {FAQ.question}
                                </h3>
                                {isOpen && (
                                    <div className="text-xs text-white/90 leading-relaxed border-t border-white/20 pt-4 animate-in fade-in slide-in-from-top-1 duration-300">
                                        {FAQ.answer}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
