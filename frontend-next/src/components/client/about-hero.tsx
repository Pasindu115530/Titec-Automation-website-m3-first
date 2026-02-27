"use client";

import { motion } from "framer-motion";

export default function AboutHero() {
    return (
        <section className="relative bg-[#0C2340] text-white py-24 px-6 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Radial Gradient for "Spotlight" effect */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1a3b5c] via-[#0C2340] to-[#0C2340] opacity-60"></div>

                {/* Circuit Board / Computer Lines Pattern */}
                <svg className="absolute inset-0 w-full h-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
                    <pattern id="circuit-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                        <path d="M20 20 h20 v20 h-20 z" fill="none" stroke="currentColor" strokeWidth="1" />
                        <path d="M60 60 h20 v20 h-20 z" fill="none" stroke="currentColor" strokeWidth="1" />
                        <path d="M10 50 h30 v-20" fill="none" stroke="currentColor" strokeWidth="1" />
                        <path d="M70 30 v20 h20" fill="none" stroke="currentColor" strokeWidth="1" />
                        <circle cx="45" cy="45" r="2" fill="currentColor" />
                        <circle cx="85" cy="85" r="2" fill="currentColor" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
                </svg>

                {/* Animated Grid Overlay */}
                <div className="absolute inset-0 bg-grid-white"></div>
            </div>

            <div className="container mx-auto max-w-5xl text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-8 border border-white/20"
                >
                    <span className="text-sm font-medium tracking-wide">Industry Leaders in Automation</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-5xl md:text-7xl font-bold mb-6 font-poppins"
                >
                    About <span className="text-glow-blue">Titec</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-xl md:text-2xl text-gray-300 font-light mb-12"
                >
                    Trusted by industry leaders worldwide.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="max-w-3xl mx-auto"
                >
                    <p className="text-lg text-gray-300 leading-relaxed">
                        TiTec Automation Solutions is a dynamic and forward-thinking company 
                        that specializes in providing state-of-the-art automation solutions to clients 
                        in various industries. With a strong emphasis on innovation and 
                        sustainability, we offer a comprehensive range of services to meet the 
                        evolving needs of our clients.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
