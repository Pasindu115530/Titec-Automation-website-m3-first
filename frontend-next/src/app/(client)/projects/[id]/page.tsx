import { Metadata, ResolvingMetadata } from 'next';
import { projectService } from '@/services/projectService';
import { getImageUrl } from '@/utils/image-utils';
import ProjectDetailClient from '@/components/client/project-detail-client';
import { Project } from '@/types';

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
            {/* Project JSON-LD */}
            {projectJsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
                />
            )}

            {/* Breadcrumb JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />

            {/* Interactive client shell */}
            <ProjectDetailClient project={project} />
        </>
    );
}
