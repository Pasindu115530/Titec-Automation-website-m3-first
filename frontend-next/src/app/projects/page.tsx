'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Check, ArrowRight, ShieldCheck, Zap, Factory } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { Card, CardContent } from '@/components/ui/card';

// Mock Data (Simulating Backend)
const projects = [
    {
        id: 'p1',
        title: 'Automated Packaging Line',
        client: 'Global Foods Ltd',
        category: 'Packaging',
        description: 'High-speed packaging system with vision quality control.',
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
        icon: Factory
    },
    {
        id: 'p2',
        title: 'Robotic Welding Cell',
        client: 'AutoParts Manufacturing',
        category: 'Robotics',
        description: 'Precision welding automation for automotive components.',
        image: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&q=80&w=800',
        icon: Zap
    },
    {
        id: 'p3',
        title: 'Smart Sorting Warehouse',
        client: 'Logistics Plus',
        category: 'Logistics',
        description: 'AI-driven conveyor sorting system for distribution centers.',
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800',
        icon: Factory
    },
    {
        id: 'p4',
        title: 'Water Treatment Control',
        client: 'City Municipal',
        category: 'Process Control',
        description: 'SCADA system upgrade for municipal water treatment plant.',
        image: 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&q=80&w=800',
        icon: ShieldCheck
    },
    {
        id: 'p5',
        title: 'Pharmaceutical Assembly',
        client: 'MediTech Corp',
        category: 'Assembly',
        description: 'Clean-room assembly automation for medical devices.',
        image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=800',
        icon: ShieldCheck
    },
    {
        id: 'p6',
        title: 'Solar Panel Inspection',
        client: 'Green Energy Co',
        category: 'Quality Control',
        description: 'Automated visual inspection system for solar manufacturing.',
        image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=800',
        icon: Zap
    }
];

export default function ProjectsPage() {
    const { addItem } = useCart();

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative py-20 bg-gray-900 text-white overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1531297461136-82ae8ce1cf75?auto=format&fit=crop&q=80')] bg-cover bg-center" />
                <div className="container relative z-10 mx-auto px-6 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-bold mb-6"
                    >
                        Our Projects
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-300 max-w-2xl mx-auto"
                    >
                        Explore our portfolio of cutting-edge automation solutions delivered to industry leaders worldwide.
                    </motion.p>
                </div>
            </section>

            {/* Projects Grid */}
            <div className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="h-full group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <Button
                                            className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300 gap-2 bg-white text-black hover:bg-gray-100"
                                            onClick={() => addItem({ id: project.id, name: project.title, image: project.image, category: project.category })}
                                        >
                                            <Plus className="h-4 w-4" />
                                            Add to Quote
                                        </Button>
                                    </div>
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-indigo-600 uppercase tracking-wider">
                                        {project.category}
                                    </div>
                                </div>
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                            <project.icon className="h-5 w-5" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-500">{project.client}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                        {project.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed mb-6">
                                        {project.description}
                                    </p>
                                    <div className="flex items-center text-indigo-600 font-medium text-sm group/link cursor-pointer" onClick={() => addItem({ id: project.id, name: project.title, image: project.image, category: project.category })}>
                                        Request Info
                                        <ArrowRight className="h-4 w-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <section className="bg-indigo-600 py-20 text-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-4">Have a Custom Project in Mind?</h2>
                    <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">We specialize in tailored automation solutions. Contact our engineering team for a free consultation.</p>
                    <div className="flex justify-center gap-4">
                        <Button size="lg" variant="secondary" className="gap-2">
                            Contact Us
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
