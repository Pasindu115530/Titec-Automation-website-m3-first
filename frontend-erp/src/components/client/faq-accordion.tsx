"use client";

import { useState } from "react";
import { FAQs } from "@/assets/FAQ";
import type { FAQ } from "@/assets/FAQ";

export default function FaqAccordion() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div className="space-y-4">
            {FAQs.map((FAQ: FAQ, i) => (
                <div key={i} className="border rounded-lg overflow-hidden">
                    <button
                        className="w-full text-left px-4 py-3 flex justify-between items-center bg-white"
                        onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    >
                        <span className="font-medium">{FAQ.question}</span>
                        <span className="text-gray-500">{openIndex === i ? '−' : '+'}</span>
                    </button>

                    {openIndex === i && (
                        <div className="px-4 py-3 bg-gray-50 text-gray-700">{FAQ.answer}</div>
                    )}
                </div>
            ))}
        </div>
    );
}
