
import { projectService } from '../../../services/projectService';
import SectionHeader from '../../../components/section-header';
import Footer from '../../../components/footer';
import Link from 'next/link';

interface PageProps {
    params: { slug: string };
}

// Removing generateStaticParams as data is now dynamic from API
// Or we could fetch all IDs to pre-render if desired, but dynamic is safer for unknown API data.
// We can use default behavior (dynamic rendering)

export default async function ProjectPage({ params }: PageProps) {
    const { slug } = params;

    let project = null;
    try {
        project = await projectService.getProjectById(slug);
    } catch (error) {
        console.error("Failed to fetch project:", error);
    }

    if (!project) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-2xl font-bold">Project Not Found</h1>
                <Link href="/" className="ml-4 text-blue-600 hover:underline">Go Home</Link>
            </div>
        );
    }

    return (
        <>
            <section className="relative min-h-[50vh] flex items-center font-sans bg-linear-to-b from-(--hero-gradient-start) to-(--hero-gradient-end)">
                <div className="hero-bg-overlay absolute inset-0 z-0 bg-[url('/hero-bg1.png')] bg-no-repeat bg-center opacity-100 pointer-events-none" />
                <div className="relative z-10 max-w-7xl pt-32 mx-auto px-6 py-12">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold mb-4">
                        {project.clientName}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-(--blue-hover) leading-tight tracking-tight mb-6">
                        {project.title}
                    </h1>
                    <p className="text-xl text-gray-700 max-w-3xl">
                        {project.description}
                    </p>
                </div>
            </section>

            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    <div className="rounded-2xl overflow-hidden shadow-xl bg-gray-100 aspect-video flex items-center justify-center relative">
                        {project.image ? (
                            <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="absolute inset-0 bg-linear-to-tr from-gray-200 to-gray-50 flex items-center justify-center">
                                <span className="text-gray-400 font-medium text-lg">Project Details Image</span>
                            </div>
                        )}
                    </div>

                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Project Overview</h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="mb-4">
                                {project.details}
                            </p>
                            <p>
                                Our team worked closely with {project.clientName} to deliver a solution that met their specific operational goals. The result was improved efficiency, reduced error rates, and a safer working environment.
                            </p>
                        </div>

                        <div className="mt-10 border-t border-gray-100 pt-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Technology Used</h3>
                            <div className="flex flex-wrap gap-2">
                                {['PLC Automation', 'SCADA', 'Industrial Robotics', 'Safety Systems'].map((tag) => (
                                    <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="mt-10">
                            <Link href="/contact" className="button-1 inline-flex items-center">
                                Request Similar Solution
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}
