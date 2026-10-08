import React from 'react';
import { projectService } from '@/services/projectService';
import { Project } from '@/types';
import { getImageUrl } from '@/utils/image-utils';
import type { Metadata, ResolvingMetadata } from 'next';
import Footer from '@/components/footer';
import ProjectClient from './ProjectClient';

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
        // Will render not-found state in client component or handled below
    }

    if (!project) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Project Not Found</h1>
                    <p className="text-gray-500">The project you're looking for doesn't exist or has been removed.</p>
                </div>
            </div>
        );
    }

    // ── JSON-LD: CreativeWork / Engineering Project Schema ──
    const imageUrl = project.thumbnail_path
        ? getImageUrl(project.thumbnail_path)
        : null;

    const cleanDesc = stripHtml(project.description || '').replace(/\s+/g, ' ').trim();
    const canonicalUrl = `${baseUrl}/projects/${id}`;

    const projectJsonLd = {
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
        keywords: project.technologies?.join(', ') || undefined,
        genre: 'Industrial Automation',
        inLanguage: 'en',
    };

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
                name: project.title,
                item: canonicalUrl,
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <div className="min-h-screen bg-white">
                <div className="bg-gray-900 h-20"></div> {/* Spacer for fixed header */}
                <ProjectClient project={project} />
            </div>
            <Footer />
        </>
    );
}
