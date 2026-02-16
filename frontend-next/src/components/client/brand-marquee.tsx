"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { getImageUrl } from "@/utils/image-utils";
import { Brand } from "@/types";
import { brandService } from "@/services/brandService";
import Link from "next/link";

// Helper component for individual marquee items
function MarqueeItem({ brand, index }: { brand: Brand, index: number }) {
    const itemRef = useRef<HTMLDivElement>(null);
    const [isCenter, setIsCenter] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsCenter(entry.isIntersecting);
            },
            {
                root: null, // viewport
                rootMargin: "0px -46% 0px -46%", // Extremely narrow center trigger zone (8% width) to ensure ONE item active
                threshold: 0.1 // Trigger as soon as it touches the zone
            }
        );

        if (itemRef.current) {
            observer.observe(itemRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Safety check for brand object
    if (!brand) return null;

    return (
        <div
            ref={itemRef}
            className={`flex-shrink-0 w-48 h-32 flex items-center justify-center p-4 transition-all duration-800 ease-[cubic-bezier(0.33,1,0.68,1)] relative group select-none
                ${isCenter
                    ? "scale-150 z-20 opacity-100 grayscale-0 blur-0"
                    : "scale-90 z-0 opacity-30 grayscale blur-[1px]"
                }
            `}
        >
            {brand.logo_path && (
                <div className="relative w-full h-full flex items-center justify-center z-10">
                    <img
                        src={getImageUrl(brand.logo_path)}
                        alt={brand.name}
                        className={`max-h-24 max-w-full object-contain transition-all duration-800 ease-[cubic-bezier(0.33,1,0.68,1)] ${isCenter ? 'filter-none' : 'filter grayscale'}`}
                    />
                </div>
            )}
        </div>
    );
}

export default function BrandMarquee() {
    const [brands, setBrands] = useState<Brand[]>([]);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const data = await brandService.getBrands();
                setBrands(data);
            } catch (error) {
                console.error("Failed to fetch brands for marquee:", error);
            }
        };

        fetchBrands();
    }, []);

    // If no brands with logos, don't render
    if (brands.length === 0) return null;

    // Triple the list to ensure smooth infinite scroll without gaps
    const marqueeBrands = [...brands, ...brands, ...brands];

    return (
        <section className="w-full bg-white py-16 overflow-hidden">
            <div className="container mx-auto px-6 lg:px-12 flex flex-col items-center">

                {/* Centered Heading - Matched to "What We Do" Section */}
                <div className="text-center mb-12 relative z-20">
                    <h2 className="text-4xl font-bold text-gray-800 section-title">
                        Our <span className="text-gradient-tech font-extrabold">BRANDS</span>
                        <div className="w-24 h-1 bg-linear-to-l from-blue-500 to-transparent mx-auto mt-4 rounded-full"></div>
                    </h2>
                    <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
                        We offer a wide range of intelligent electronics and automation products for modern living.
                    </p>
                </div>

                {/* Infinite Marquee */}
                <div className="w-full relative">

                    {/* Fade Out Mask (Left Edge) */}
                    <div className="absolute left-0 top-0 bottom-0 w-32 md:w-64 z-10 bg-gradient-to-r from-white via-white/90 to-transparent pointer-events-none"></div>

                    {/* Fade Out Mask (Right Edge) */}
                    <div className="absolute right-0 top-0 bottom-0 w-32 md:w-64 z-10 bg-gradient-to-l from-white via-white/90 to-transparent pointer-events-none"></div>

                    <div className="overflow-hidden flex items-center relative py-12">
                        <motion.div
                            className="flex gap-20 items-center"
                            animate={{
                                x: ["-33.33%", "0%"]
                            }}
                            transition={{
                                x: {
                                    repeat: Infinity,
                                    repeatType: "loop",
                                    duration: 40,
                                    ease: "linear",
                                }
                            }}
                        >
                            {marqueeBrands.map((brand, index) => (
                                <MarqueeItem key={`${brand.id}-${index}`} brand={brand} index={index} />
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
