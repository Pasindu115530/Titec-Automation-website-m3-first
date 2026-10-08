"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { serviceService } from "@/services/serviceService";
import { ServiceCategory } from "@/types";
import Footer from "@/components/footer";
import Loader from "@/components/loader";

export default function ServiceDetailPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [service, setService] = useState<ServiceCategory | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchService = async () => {
            setLoading(true);
            try {
                const data = await serviceService.getServiceBySlug(slug);
                setService(data);
            } catch (error) {
                console.error("Failed to fetch service:", error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchService();
        }
    }, [slug]);

    if (loading) {
        return <Loader />;
    }

    if (!service) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Service Not Found</h1>
                    <p className="text-gray-600">The service you are looking for does not exist.</p>
                    <a href="/" className="mt-4 inline-block text-blue-600 hover:underline">Go back home</a>
                </div>
            </div>
        );
    }

    const imageUrl = service.image_path
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${service.image_path}`
        : null;

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            {/* Hero Section */}
            <section className="relative h-[60vh] w-full overflow-hidden flex items-center justify-center">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={service.title}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gray-800" />
                )}
                <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"></div>
                <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-black text-white font-orbitron tracking-widest drop-shadow-lg mb-4 uppercase">
                        {service.title}
                    </h1>
                    <div className="w-24 h-1 bg-blue-500 mx-auto mb-6"></div>
                    <p className="text-xl md:text-2xl text-gray-200 font-light max-w-3xl mx-auto">
                        {service.description}
                    </p>
                </div>
            </section>

            {/* Breadcrumb / Navigation (Simple) */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-6 py-4">
                    <a href="/" className="text-blue-600 font-medium hover:underline flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </a>
                </div>
            </div>

            {/* Content Section */}
            <section className="py-20 px-6">
                <div className="container mx-auto max-w-7xl">
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl font-bold text-gray-800 section-title mb-4">
                            <span className="text-blue-900">SERVICE</span> CAPABILITIES
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Comprehensive solutions tailored to your specific industrial needs.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {service.items.map((item, index) => (
                            <div
                                key={item.id}
                                className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
                            >
                                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                                    <span className="font-orbitron font-bold text-blue-600 text-xl group-hover:text-white">
                                        {index + 1 < 10 ? `0${index + 1}` : index + 1}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed text-sm">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="bg-blue-900 py-16 px-6 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
                    backgroundSize: '32px 32px',
                }}></div>
                <div className="container mx-auto text-center relative z-10">
                    <h2 className="text-3xl font-bold font-orbitron mb-6">Need a Custom Solution?</h2>
                    <p className="text-gray-300 max-w-2xl mx-auto mb-8 text-lg">
                        Contact our engineering team to discuss your specific requirements and get a detailed quotation.
                    </p>
                    <a href="/#quote" className="inline-block px-8 py-4 bg-white text-blue-900 font-bold rounded-none hover:bg-gray-100 transition shadow-lg tracking-wider font-orbitron">
                        CONTACT US
                    </a>
                </div>
            </section>

            <Footer />
        </div>
    );
}
