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

// Helper: strip HTML tags from text
function stripHtml(html: string): string {
    return html.replace(/<[^>]*>?/gm, '');
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { id } = await params;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.titecautomation.lk';

    let project: Project | null = null;
    try {
        project = await projectService.getProjectById(id);
    } catch {
        // Project not found
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

    const cleanDesc = stripHtml(project.description || '');
    const description = cleanDesc.substring(0, 155).trim() ||
        `Industrial automation project by TiTEC Automation Sri Lanka — ${project.title}.`;

    const canonicalUrl = `${baseUrl}/projects/${id}`;
    const titleSuffix = project.client ? ` | ${project.client}` : '';
    const title = `${project.title}${titleSuffix} | TiTEC Automation`;

    return {
        title,
        description,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title,
            description,
            type: 'article',
            url: canonicalUrl,
            images: [{ url: imageUrl, alt: project.title }],
            siteName: 'TiTEC Automation',
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

    // ── JSON-LD: CreativeWork Schema ──
    const imageUrl = project?.thumbnail_path
        ? getImageUrl(project.thumbnail_path)
        : null;

    const cleanDesc = project ? stripHtml(project.description || '') : '';

    const projectJsonLd = project
        ? {
              '@context': 'https://schema.org',
              '@type': 'CreativeWork',
              name: project.title,
              description: cleanDesc,
              image: imageUrl ? [imageUrl] : undefined,
              creator: {
                  '@type': 'Organization',
                  name: 'TiTEC Automation',
                  url: baseUrl,
              },
              dateCreated: project.completion_date || undefined,
              locationCreated: project.location
                  ? { '@type': 'Place', name: project.location }
                  : undefined,
              keywords: project.technologies?.join(', ') || undefined,
              url: `${baseUrl}/projects/${id}`,
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
