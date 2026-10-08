'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, MapPin, Layers } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { Project } from '@/types';
import { getImageUrl } from '@/utils/image-utils';

interface ProjectClientProps {
    project: Project;
}

export default function ProjectClient({ project }: ProjectClientProps) {
    const { setIsOpen, setPrefilledMessage } = useCart();
    const [activeImage, setActiveImage] = useState<string>('');

    // Gather all images for the gallery
    const allImages = [
        ...(project.thumbnail_path ? [project.thumbnail_path] : []),
        ...(project.project_image_urls || []),
    ];

    useEffect(() => {
        if (project.thumbnail_path) {
            setActiveImage(getImageUrl(project.thumbnail_path));
        } else if (project.project_image_urls && project.project_image_urls.length > 0) {
            setActiveImage(getImageUrl(project.project_image_urls[0]));
        } else {
            setActiveImage(getImageUrl(''));
        }
    }, [project]);

    return (
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
                        {activeImage ? (
                            <img
                                src={activeImage}
                                alt={project.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
                                <span className="text-sm">No image available</span>
                            </div>
                        )}
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
                                        <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
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
    );
}
