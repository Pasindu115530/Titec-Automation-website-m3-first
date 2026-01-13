"use client";

import Footer from "../../components/footer";
import { Target, Eye, Heart, CheckCircle2 } from "lucide-react";
import * as motion from "framer-motion/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function About() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
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
                        About <span className="text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]">Titec</span>
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
                            We design and deliver industrial automation solutions that help manufacturers improve reliability, efficiency, and safety. Our team blends hardware, controls and software expertise to deliver turnkey systems.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Mission / Vision / Values Section */}
            <section className="py-20 px-6 bg-gray-50">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Mission */}
                        <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 bg-[#0C2340] rounded-2xl flex items-center justify-center mb-6 text-white">
                                <Target className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#0C2340] mb-4">Our Mission</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Deliver practical automation that drives measurable ROI for customers.
                            </p>
                        </div>

                        {/* Vision */}
                        <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 bg-[#0C2340] rounded-2xl flex items-center justify-center mb-6 text-white">
                                <Eye className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#0C2340] mb-4">Our Vision</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Be the trusted partner for digital transformation in industrial operations.
                            </p>
                        </div>

                        {/* Values */}
                        <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 bg-[#0C2340] rounded-2xl flex items-center justify-center mb-6 text-white">
                                <Heart className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#0C2340] mb-4">Core Values</h3>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-gray-600">
                                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                                    <span>Safety first</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-600">
                                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                                    <span>Customer success</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-600">
                                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                                    <span>Continuous improvement</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="bg-[#0C2340] rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden">
                        {/* Background accents */}
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-radial-dot"></div>

                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                Ready to Transform Your Operations?
                            </h2>
                            <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                                Let&apos;s discuss how we can help you achieve your automation goals with our expert solutions.
                            </p>
                            <Link href="/contact">
                                <Button className="bg-white text-[#0C2340] hover:bg-gray-100 text-lg px-8 py-6 rounded-full font-semibold transition-transform hover:scale-105">
                                    Get in Touch
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
