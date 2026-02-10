"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, ArrowRight, Zap, MapPin } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { Card, CardContent } from "@/components/ui/card";
import { Project } from "@/types";
import Footer from "@/components/footer";
import Loader from "@/components/loader";
import { projectService } from "@/services/projectService";

import { getImageUrl } from "@/utils/image-utils";

// Helper to get image URL removed in favor of shared utility

interface ProjectsClientProps {
    initialProjects: Project[];
}

export default function ProjectsClient({ initialProjects }: ProjectsClientProps) {
    const { setIsOpen, setPrefilledMessage } = useCart();
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [isLoading, setIsLoading] = useState(false);

    // If initialProjects is empty (SSR fetch failed), fetch client-side
    useEffect(() => {
        const fetchProjects = async () => {
            if (projects.length === 0) {
                setIsLoading(true);
                try {
                    const data = await projectService.getProjects();
                    setProjects(data);
                } catch (error) {
                    console.error("Failed to fetch projects client-side:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchProjects();
    }, []);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <>
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
                                <Card className="h-full group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col">
                                    <div className="relative h-64 overflow-hidden shrink-0">
                                        <img
                                            src={getImageUrl(project.thumbnail_path)}
                                            alt={project.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <Button
                                                className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300 gap-2 bg-white text-black hover:bg-gray-100"
                                                onClick={() => {
                                                    setPrefilledMessage(`Requesting a system similar to "${project.title}"`);
                                                    setIsOpen(true);
                                                    toast.success("Opening quotation form");
                                                }}
                                            >
                                                <MessageSquare className="h-4 w-4" />
                                                Request Similar System
                                            </Button>
                                        </div>
                                        {/* Status Badge */}
                                        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${project.status === 'Completed' ? 'bg-green-500/90 text-white' :
                                            project.status === 'In Progress' ? 'bg-orange-500/90 text-white' :
                                                'bg-gray-500/90 text-white'
                                            }`}>
                                            {project.status || 'Project'}
                                        </div>
                                    </div>
                                    <CardContent className="p-6 flex flex-col flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                                <Zap className="h-5 w-5" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-500">{project.client}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                            {project.title}
                                        </h3>
                                        <div className="space-y-2 mb-4">
                                            {project.location && (
                                                <div className="flex items-center text-xs text-gray-400">
                                                    <MapPin className="h-3 w-3 mr-1" />
                                                    {project.location}
                                                </div>
                                            )}
                                        </div>

                                        {/* Technologies List */}
                                        {project.technologies && project.technologies.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mb-4">
                                                {project.technologies.slice(0, 3).map((tech, i) => (
                                                    <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-medium border border-gray-200">
                                                        {tech}
                                                    </span>
                                                ))}
                                                {project.technologies.length > 3 && (
                                                    <span className="px-2 py-0.5 bg-gray-50 text-gray-400 rounded text-[10px] font-medium border border-gray-100">
                                                        +{project.technologies.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                                            {project.description}
                                        </p>
                                        <div className="mt-auto pt-4 border-t border-gray-100">
                                            <Link href={`/projects/${project.id}`} className="flex items-center text-indigo-600 font-medium text-sm group/link">
                                                View Details
                                                <ArrowRight className="h-4 w-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                                            </Link>
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
                            <Link href="/contact">
                                <Button size="lg" variant="secondary" className="gap-2 button-2">
                                    Contact Us
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
}
