"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { getImageUrl } from "@/utils/image-utils";
import { Project } from "@/types";
import Link from "next/link";

interface ClientMarqueeProps {
    projects: Project[];
}

// Helper component for individual marquee items
function MarqueeItem({ client, index }: { client: Project, index: number }) {
    const itemRef = useRef<HTMLAnchorElement>(null);
    const [isCenter, setIsCenter] = useState(false);

    // Safety check for client object
    if (!client) return null; // Prevent rendering if client is undefined/null

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

    return (
        <Link
            href={`/projects/${client.id}`}
            ref={itemRef}
            className={`flex-shrink-0 w-48 h-32 flex items-center justify-center p-4 transition-all duration-800 ease-[cubic-bezier(0.33,1,0.68,1)] relative group cursor-pointer
                ${isCenter
                    ? "scale-150 z-20 opacity-100 grayscale-0 blur-0"
                    : "scale-90 z-0 opacity-30 grayscale blur-[1px]"
                }
            `}
        >
            {client.logo_path && (
                <div className="relative w-full h-full flex items-center justify-center z-10">
                    <img
                        src={getImageUrl(client.logo_path, '')}
                        alt={client.client}
                        className={`max-h-24 max-w-full object-contain transition-all duration-800 ease-[cubic-bezier(0.33,1,0.68,1)] ${isCenter ? 'filter-none' : 'filter grayscale'}`}
                    />
                </div>
            )}
        </Link>
    );
}

export default function ClientMarquee({ projects }: ClientMarqueeProps) {
    // Extract unique clients with logos
    const uniqueClients = React.useMemo(() => {
        if (!Array.isArray(projects)) return [];

        const seen = new Set();
        return projects.filter(project => {
            if (!project || !project.logo_path) return false;
            // Use client name as unique key, or combined with logo path if client has multiple representations
            const key = project.client || project.title; // Fallback to title if client name missing
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }, [projects]);

    // If no clients with logos, don't render (or render fallback)
    if (uniqueClients.length === 0) return null;

    // Triple the list to ensure smooth infinite scroll without gaps
    const marqueeClients = [...uniqueClients, ...uniqueClients, ...uniqueClients];

    return (
        <section className="w-full bg-white py-16 overflow-hidden">
            <div className="container mx-auto px-6 lg:px-12 flex flex-col items-center">

                {/* Centered Heading - Matched to "What We Do" Section */}
                <div className="text-center mb-12 relative z-20">
                    <h2 className="text-4xl font-bold text-gray-800 section-title">
                        Our <span className="text-gradient-tech font-extrabold">CLIENTS</span>
                    </h2>
                    <div className="w-24 h-1 bg-linear-to-r from-blue-500 to-transparent mx-auto mt-4 rounded-full"></div>
                    <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
                        Trusted by industry leaders to deliver precision automation solutions.
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
                                x: ["0%", "-33.33%"]
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
                            {marqueeClients.map((client, index) => (
                                <MarqueeItem key={`${client.id}-${index}`} client={client} index={index} />
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
