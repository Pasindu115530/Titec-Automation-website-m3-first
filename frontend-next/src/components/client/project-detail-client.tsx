'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, MapPin, Layers } from 'lucide-react';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Project } from '@/types';
import Link from 'next/link';
import { getImageUrl } from '@/utils/image-utils';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

interface ProjectDetailClientProps {
    project: Project | null;
}

export default function ProjectDetailClient({ project }: ProjectDetailClientProps) {
    const { setIsOpen, setPrefilledMessage } = useCart();

    // Combine thumbnail and gallery for full slideshow
    const allImages = project
        ? [
            ...(project.thumbnail_path ? [project.thumbnail_path] : []),
            ...(project.project_image_urls || []),
          ]
        : [];

    const initialImage = allImages.length > 0 ? getImageUrl(allImages[0]) : getImageUrl('');
    const [activeImage, setActiveImage] = useState<string>(initialImage);

    if (!project) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h1>
                <Link href="/projects">
                    <Button variant="outline">Back to Projects</Button>
                </Link>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-white">
                <div className="bg-gray-900 h-20"></div> {/* Spacer for fixed header */}

                <div className="max-w-7xl mx-auto px-6 py-12">
                    <Link href="/projects" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 mb-8 transition-colors">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Projects
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Left: Gallery */}
                        <div className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="aspect-video bg-gray-100 rounded-xl overflow-hidden shadow-lg border border-gray-100"
                            >
                                <img
                                    src={activeImage}
                                    alt={project.title}
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>

                            {allImages.length > 1 && (
                                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                                    {allImages.map((path, index) => {
                                        const url = getImageUrl(path);
                                        return (
                                            <div
                                                key={index}
                                                onClick={() => setActiveImage(url)}
                                                className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${activeImage === url ? 'border-indigo-600 ring-2 ring-indigo-100' : 'border-transparent hover:border-indigo-300'}`}
                                            >
                                                <img src={url} alt={`${project.title} image ${index + 1}`} className="w-full h-full object-cover" />
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Right: Info */}
                        <div>
                            <motion.h1
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-4xl font-bold text-gray-900 mb-2"
                            >
                                {project.title}
                            </motion.h1>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-8">
                                <div className="flex items-center">
                                    <User className="h-4 w-4 mr-1.5 text-indigo-500" />
                                    {project.client}
                                </div>
                                {project.location && (
                                    <div className="flex items-center">
                                        <MapPin className="h-4 w-4 mr-1.5 text-indigo-500" />
                                        {project.location}
                                    </div>
                                )}
                                {project.completion_date && (
                                    <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-1.5 text-indigo-500" />
                                        {new Date(project.completion_date).toLocaleDateString()}
                                    </div>
                                )}
                            </div>

                            <div className="prose prose-indigo max-w-none mb-8 text-gray-600 leading-relaxed">
                                <p className="whitespace-pre-wrap">{project.description}</p>
                            </div>

                            {project.technologies && project.technologies.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center">
                                        <Layers className="h-4 w-4 mr-2" />
                                        Technologies Used
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {project.technologies.map((tech, i) => (
                                            <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-100">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="pt-8 border-t border-gray-100">
                                <Button
                                    size="lg"
                                    className="w-full sm:w-auto cursor-pointer button-1"
                                    onClick={() => {
                                        setPrefilledMessage(`Requesting a system similar to "${project.title}"`);
                                        setIsOpen(true);
                                        toast.success("Opening quotation form");
                                    }}
                                >
                                    Request Similar Solution
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
