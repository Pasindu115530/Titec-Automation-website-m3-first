import Link from "next/link";
import { SERVICES } from "@/data/services";
import { notFound } from "next/navigation";
import Image from "next/image";
import Footer from "@/components/footer";

interface PageProps {
    params: {
        slug: string;
    };
}

export async function generateStaticParams() {
    return SERVICES.map((service) => ({
        slug: service.slug,
    }));
}

export default async function ServiceDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const service = SERVICES.find((s) => s.slug === slug);

    if (!service) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            {/* Hero Section */}
            <section className="relative h-[60vh] w-full overflow-hidden flex items-center justify-center">
                <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority
                />
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
                    <Link href="/" className="text-blue-600 font-medium hover:underline flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </Link>
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
                            <div key={index} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">

                                {/* Decorative Background Element */}
                                <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none opacity-[0.03] group-hover:opacity-10 transition-opacity duration-300">
                                    {index % 3 === 0 && (
                                        <svg viewBox="0 0 100 100" className="w-full h-full text-blue-900 fill-current">
                                            <path d="M0 100 Q 50 50 100 100 T 200 100 V 100 H 0 Z" transform="scale(1, -1) translate(0, -100)" />
                                            <path d="M0 80 Q 50 30 100 80 T 200 80" fill="none" stroke="currentColor" strokeWidth="4" />
                                            <path d="M0 60 Q 50 10 100 60 T 200 60" fill="none" stroke="currentColor" strokeWidth="4" />
                                        </svg>
                                    )}
                                    {index % 3 === 1 && (
                                        <svg viewBox="0 0 100 100" className="w-full h-full text-blue-900 fill-current">
                                            <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                                <circle cx="2" cy="2" r="2" />
                                            </pattern>
                                            <rect width="100" height="100" fill="url(#dots)" />
                                        </svg>
                                    )}
                                    {index % 3 === 2 && (
                                        <svg viewBox="0 0 100 100" className="w-full h-full text-blue-900">
                                            <path d="M0 100 L100 0" stroke="currentColor" strokeWidth="8" />
                                            <path d="M20 100 L100 20" stroke="currentColor" strokeWidth="8" />
                                            <path d="M40 100 L100 40" stroke="currentColor" strokeWidth="8" />
                                            <path d="M60 100 L100 60" stroke="currentColor" strokeWidth="8" />
                                        </svg>
                                    )}
                                </div>

                                {/* Top Row: Number + Icon */}
                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    {/* Index (Top Left) */}
                                    <span className="text-4xl font-black text-gray-200 group-hover:text-blue-600 transition-colors duration-300 font-orbitron">
                                        {index + 1 < 10 ? `0${index + 1}` : index + 1}
                                    </span>

                                    {/* Icon / Image Box (Top Right) */}
                                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-sm bg-gray-50 border border-gray-100">
                                        <Image
                                            src={item.image || service.image}
                                            alt={item.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="relative z-10 mt-2">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 font-orbitron group-hover:text-blue-900 transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-4 group-hover:text-gray-600 transition-colors">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="bg-blue-900 py-16 px-6 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-radial-dot"></div>
                <div className="container mx-auto text-center relative z-10">
                    <h2 className="text-3xl font-bold font-orbitron mb-6">Need a Custom Solution?</h2>
                    <p className="text-gray-300 max-w-2xl mx-auto mb-8 text-lg">
                        Contact our engineering team to discuss your specific requirements and get a detailed quotation.
                    </p>
                    <Link href="/#quote" className="inline-block px-8 py-4 bg-white text-blue-900 font-bold rounded-none hover:bg-gray-100 transition shadow-lg tracking-wider font-orbitron">
                        CONTACT US
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
}
