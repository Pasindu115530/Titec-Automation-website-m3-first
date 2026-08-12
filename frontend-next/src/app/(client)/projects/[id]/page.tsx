'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, MapPin, Layers } from 'lucide-react';
import Loader from '@/components/loader';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { projectService } from '@/services/projectService';
import { Project } from '@/types';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getImageUrl } from '@/utils/image-utils';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

export default function ProjectDetailsPage() {
    const params = useParams();
    const id = params.id as string;
    const { setIsOpen, setPrefilledMessage } = useCart();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState<string>('');

    useEffect(() => {
        const loadProject = async () => {
            try {
                const data = await projectService.getProjectById(id);
                setProject(data);

                // Set initial active image (priority: thumbnail -> first gallery image -> placeholder)
                if (data.thumbnail_path) {
                    setActiveImage(getImageUrl(data.thumbnail_path));
                } else if (data.project_image_urls && data.project_image_urls.length > 0) {
                    setActiveImage(getImageUrl(data.project_image_urls[0]));
                } else {
                    setActiveImage(getImageUrl('')); // Use proper fallback or utility default
                }
            } catch (error) {
                console.error('Failed to load project', error);
            } finally {
                setLoading(false);
            }
        };

type Props = {
    params: Promise<{ id: string }>;
};

// Re-validate every 60 seconds (ISR) so new projects appear quickly
export const revalidate = 60;

// ── Pre-render known project pages at build time ──
// Falls back gracefully if the API is unreachable during build
export async function generateStaticParams() {
    try {
        const projects = await projectService.getProjects();
        return (Array.isArray(projects) ? projects : []).map((project: Project) => ({
            id: String(project.id),
        }));
    } catch {
        return [];
    }
}

// Helper: strip HTML tags from text
function stripHtml(html: string): string {
    return html.replace(/<[^>]*>?/gm, '');
}

// Helper: build a clean 155-char description
function buildDescription(rawHtml: string, fallback: string): string {
    const clean = stripHtml(rawHtml).replace(/\s+/g, ' ').trim();
    return clean.length > 10
        ? clean.substring(0, 155).trim()
        : fallback;
}

export async function generateMetadata(
    { params }: Props,
    _parent: ResolvingMetadata
): Promise<Metadata> {
    const { id } = await params;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.titecautomation.lk';

    let project: Project | null = null;
    try {
        project = await projectService.getProjectById(id);
    } catch {
        // Project not found — return minimal metadata
    }

    if (!project) {
        return {
            title: 'Project Not Found | TiTEC Automation',
            description: 'The requested project could not be found.',
        };
    }

    const imageUrl = project.thumbnail_path
        ? getImageUrl(project.thumbnail_path)
        : `${baseUrl}/og-image.jpg`;

    const description = buildDescription(
        project.description || '',
        `Industrial automation project by TiTEC Automation Sri Lanka — ${project.title}.`
    );

    const canonicalUrl = `${baseUrl}/projects/${id}`;
    const titleSuffix = project.client ? ` | ${project.client}` : '';
    const title = `${project.title}${titleSuffix} | TiTEC Automation`;

    // Build keyword list from technologies + location
    const keywords: string[] = [
        ...(project.technologies ?? []),
        'industrial automation',
        'TiTEC Automation',
        'Sri Lanka',
        ...(project.location ? [project.location] : []),
        ...(project.client ? [project.client] : []),
    ].filter(Boolean);

    return {
        title,
        description,
        keywords,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title,
            description,
            type: 'article',
            url: canonicalUrl,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: project.title,
                },
            ],
            siteName: 'TiTEC Automation',
            // Article-specific fields
            publishedTime: project.completion_date || undefined,
            modifiedTime: (project as any).updated_at || project.completion_date || undefined,
            authors: ['TiTEC Automation'],
            tags: project.technologies ?? [],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [imageUrl],
        },
    };
}

export default async function ProjectDetailsPage({ params }: Props) {
    const { id } = await params;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.titecautomation.lk';

    let project: Project | null = null;
    try {
        project = await projectService.getProjectById(id);
    } catch {
        // Will render not-found state in client component
    }

    // ── JSON-LD: CreativeWork / Engineering Project Schema ──
    const imageUrl = project?.thumbnail_path
        ? getImageUrl(project.thumbnail_path)
        : null;

    const cleanDesc = project ? stripHtml(project.description || '').replace(/\s+/g, ' ').trim() : '';
    const canonicalUrl = `${baseUrl}/projects/${id}`;

    const projectJsonLd = project
        ? {
              '@context': 'https://schema.org',
              '@type': 'CreativeWork',
              '@id': canonicalUrl,
              name: project.title,
              description: cleanDesc,
              url: canonicalUrl,
              image: imageUrl ? [{ '@type': 'ImageObject', url: imageUrl, caption: project.title }] : undefined,
              creator: {
                  '@type': 'Organization',
                  name: 'TiTEC Automation',
                  url: baseUrl,
                  sameAs: [baseUrl],
              },
              // If a client/recipient is named, surface it as the recipient organization
              ...(project.client && {
                  funder: {
                      '@type': 'Organization',
                      name: project.client,
                  },
                  about: {
                      '@type': 'Thing',
                      name: project.client,
                  },
              }),
              dateCreated: project.completion_date || undefined,
              datePublished: project.completion_date || undefined,
              dateModified: (project as any).updated_at || project.completion_date || undefined,
              locationCreated: project.location
                  ? { '@type': 'Place', name: project.location }
                  : undefined,
              // Technologies used surface as keywords
              keywords: project.technologies?.join(', ') || undefined,
              // Material type can help disambiguation
              genre: 'Industrial Automation',
              inLanguage: 'en',
          }
        : null;

    // ── JSON-LD: BreadcrumbList ──
    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: baseUrl,
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Projects',
                item: `${baseUrl}/projects`,
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: project?.title ?? 'Project',
                item: canonicalUrl,
            },
        ],
    };

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
            </div>
            <Footer />
        </>
    );
}
