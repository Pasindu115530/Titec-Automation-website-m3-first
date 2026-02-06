
import { clients } from '@/assets/clients/clients';
import { projectService } from '@/services/projectService';
import { slugify } from '@/utils/slugify';
import { getImageUrl } from '@/utils/image-utils';
import SectionHeader from '@/components/section-header';
import Footer from '@/components/footer';
import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/types';

interface PageProps {
    params: Promise<{ slug: string }>;
}

// Generate static params for all clients
// Note: keeping this static for now as clients are static, but fetching projects dynamically
export async function generateStaticParams() {
    return clients.map((client) => ({
        slug: slugify(client.name),
    }));
}

export default async function ClientPage({ params }: PageProps) {
    const { slug } = await params;
    const client = clients.find((c) => slugify(c.name) === slug);

    if (!client) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-2xl font-bold">Client Not Found</h1>
            </div>
        );
    }

    // Fetch projects for this client from API
    let clientProjects: Project[] = [];
    try {
        const projects = await projectService.getProjectsByClient(client.name);
        clientProjects = projects || [];
    } catch (error) {
        console.error("Failed to fetch client projects:", error);
        clientProjects = [];
    }

    return (
        <>
            <section className="relative min-h-[40vh] flex items-center font-sans bg-linear-to-b from-(--hero-gradient-start) to-(--hero-gradient-end)">
                <div className="hero-bg-overlay absolute inset-0 z-0 bg-[url('/hero-bg1.png')] bg-no-repeat bg-center opacity-100 pointer-events-none" />
                <div className="relative z-10 max-w-7xl pt-32 mx-auto px-6 py-12 text-center">
                    {/* Client Logo */}
                    <div className="mb-6 flex justify-center">
                        <div className="p-4 bg-white rounded-xl shadow-md">
                            <Image
                                src={client.logo}
                                alt={client.name}
                                className="h-24 w-auto object-contain"
                                height={96}
                                width={200}
                            />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-semibold text-(--blue-hover) leading-tight tracking-tight">
                        Projects for <span className="text-(--secondary-blue)">{client.name}</span>
                    </h1>
                </div>
            </section>

            <section className="py-16 bg-gray-50 min-h-[40vh]">
                <div className="max-w-7xl mx-auto px-6">
                    <SectionHeader
                        title="Our Work with"
                        highlightedText={client.name.toUpperCase()}
                        subtitle="Explore our successful deployments."
                    />

                    {clientProjects?.length > 0 ? (
                        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {clientProjects.map((project) => (
                                <Link
                                    key={project.id}
                                    href={`/projects/${project.id}`}
                                    className="group block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="h-48 bg-gray-200 relative overflow-hidden">
                                        {project.thumbnail_path ? (
                                            <img src={getImageUrl(project.thumbnail_path)} alt={project.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="absolute inset-0 bg-linear-to-br from-gray-300 to-gray-100 flex items-center justify-center text-gray-500">
                                                <span className="text-lg font-medium">Project Image</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-(--secondary-blue) transition-colors">
                                            {project.title}
                                        </h3>
                                        <p className="mt-3 text-gray-600 line-clamp-2">
                                            {project.description}
                                        </p>
                                        <div className="mt-4 flex items-center text-(--primary-blue) font-medium text-sm">
                                            View Case Study
                                            <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="mt-12 text-center py-12 bg-white rounded-lg border border-gray-200 shadow-xs">
                            <p className="text-gray-500 text-lg">No visible projects listed for this client yet.</p>
                            <Link href="/contact" className="mt-4 inline-block text-(--secondary-blue) font-medium hover:underline">
                                Contact us to learn more about our work with {client.name}
                            </Link>
                        </div>
                    )}
                </div>
            </section>
            <Footer />
        </>
    );
}
