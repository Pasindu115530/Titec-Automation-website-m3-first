import { serviceService } from '@/services/serviceService';
import SectionHeader from '@/components/section-header';
import Footer from '@/components/footer';
import Link from 'next/link';
import { Metadata } from 'next';
import { getImageUrl } from '@/utils/image-utils';
import { ServiceCategory } from '@/types';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.titecautomation.lk';

export const revalidate = 300; // Revalidate every 5 minutes

export const metadata: Metadata = {
    title: "Our Services | TiTEC Automation",
    description: "Explore our comprehensive range of industrial automation, solar power systems, and engineering services in Sri Lanka.",
    alternates: {
        canonical: `${baseUrl}/services`,
    },
};

export default async function ServicesPage() {
    let services: ServiceCategory[] = [];
    try {
        const fetchedServices = await serviceService.getServices();
        if (Array.isArray(fetchedServices)) {
            services = fetchedServices.sort((a, b) => a.sort_order - b.sort_order);
        }
    } catch {
        // Silently fail, handle empty state
    }

    return (
        <div className="min-h-screen flex flex-col font-sans">
            {/* Hero Section */}
            <section className="relative min-h-[40vh] flex items-center bg-linear-to-b from-(--hero-gradient-start) to-(--hero-gradient-end)">
                <div className="hero-bg-overlay absolute inset-0 z-0 bg-[url('/hero-bg1.png')] bg-no-repeat bg-center opacity-100 pointer-events-none" />
                <div className="relative z-10 max-w-7xl pt-32 mx-auto px-6 py-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-semibold text-(--blue-hover) leading-tight tracking-tight">
                        Our <span className="text-(--secondary-blue)">Services</span>
                    </h1>
                    <p className="mt-4 text-lg text-gray-700 max-w-3xl mx-auto font-medium">
                        Comprehensive engineering solutions to automate, secure, and power your operations.
                    </p>
                </div>
            </section>

            <section className="py-20 bg-gray-50 flex-grow">
                <div className="max-w-7xl mx-auto px-6">
                    <SectionHeader
                        title="What We"
                        highlightedText="OFFER"
                        subtitle="Industry-leading solutions tailored to your unique requirements."
                    />

                    {services.length > 0 ? (
                        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {services.map((service) => (
                                <Link
                                    key={service.id}
                                    href={`/services/${service.slug}`}
                                    className="group flex flex-col bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                                >
                                    <div className="h-56 bg-gray-200 relative overflow-hidden">
                                        {service.image_path ? (
                                            <img
                                                src={getImageUrl(service.image_path)}
                                                alt={service.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-linear-to-br from-blue-900 to-blue-700 flex items-center justify-center">
                                                <span className="text-white font-orbitron font-bold text-lg px-4 text-center">
                                                    {service.title}
                                                </span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gray-900/10 group-hover:bg-transparent transition-colors duration-300"></div>
                                    </div>
                                    <div className="p-8 flex flex-col flex-grow">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                                            {service.title}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                                            {service.description}
                                        </p>
                                        <div className="mt-auto flex items-center text-blue-600 font-bold text-sm uppercase tracking-wider">
                                            Explore Solutions
                                            <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="mt-12 text-center py-16 bg-white rounded-xl shadow-xs border border-gray-100">
                            <p className="text-gray-500 text-lg">Services are currently being updated.</p>
                            <p className="mt-2 text-gray-400">Please check back later or contact us directly.</p>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}
