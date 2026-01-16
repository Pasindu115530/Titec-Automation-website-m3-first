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
                        {service.items.map((item, index) => {
                            const pIndex = index % 5;

                            return (
                                <div key={index} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 relative overflow-hidden group hover:shadow-2xl transition-all duration-500">

                                    {/* Abstract Decorative Backgrounds (Targeted from user screenshots) */}
                                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                        {pIndex === 0 && ( /* Purple-Blue Waves */
                                            <svg viewBox="0 0 200 200" className="absolute bottom-0 right-0 w-full h-full p-4 opacity-40 translate-x-1/4 translate-y-1/4">
                                                <defs>
                                                    <linearGradient id="purpleBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                                        <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0" />
                                                        <stop offset="100%" stopColor="#8b5cf6" />
                                                    </linearGradient>
                                                </defs>
                                                {[...Array(12)].map((_, i) => (
                                                    <path
                                                        key={i}
                                                        d={`M ${-20 + i * 10} 200 Q ${50 + i * 10} ${100 - i * 5} ${150 + i * 10} 0`}
                                                        fill="none"
                                                        stroke="url(#purpleBlueGrad)"
                                                        strokeWidth="2"
                                                        opacity={0.3 + i * 0.05}
                                                    />
                                                ))}
                                                <path d="M 0 200 Q 100 100 200 0" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" />
                                            </svg>
                                        )}
                                        {pIndex === 1 && ( /* Yellow Diagonal Stripes */
                                            <svg viewBox="0 0 200 200" className="absolute bottom-0 right-0 w-3/4 h-3/4 opacity-40 translate-x-1/3 translate-y-1/3">
                                                <path d="M 0 200 Q 40 80 120 40 T 200 0 L 200 200 Z" fill="#eab308" opacity="0.1" />
                                                {[...Array(15)].map((_, i) => (
                                                    <line
                                                        key={i}
                                                        x1={50 + i * 8} y1="200" x2={150 + i * 8} y2="0"
                                                        stroke="#eab308"
                                                        strokeWidth="5"
                                                        opacity={0.4 + (i / 20)}
                                                    />
                                                ))}
                                            </svg>
                                        )}
                                        {pIndex === 2 && ( /* Red Sprinkles */
                                            <svg viewBox="0 0 200 200" className="absolute bottom-4 -right-12 w-1/2 h-1/2 opacity-30 translate-x-4">
                                                {[...Array(20)].map((_, i) => (
                                                    <line
                                                        key={i}
                                                        x1={Math.random() * 200} y1={Math.random() * 200}
                                                        x2={Math.random() * 200} y2={Math.random() * 200}
                                                        stroke="#ef4444"
                                                        strokeWidth="4"
                                                        strokeLinecap="round"
                                                        opacity={0.8}
                                                    />
                                                ))}
                                            </svg>
                                        )}
                                        {pIndex === 3 && ( /* Colorful Dotted Waves */
                                            <svg viewBox="0 0 200 200" className="absolute bottom-0 right-0 w-full h-full p-4 opacity-40 translate-x-1/3 translate-y-1/4">
                                                {[...Array(60)].map((_, i) => {
                                                    const x = 50 + Math.sin(i * 0.2) * 50 + (i % 5) * 10;
                                                    const y = 200 - i * 3;
                                                    const colors = ["#3b82f6", "#eab308", "#22c55e", "#ef4444", "#a855f7"];
                                                    return (
                                                        <circle
                                                            key={i}
                                                            cx={x} cy={y}
                                                            r={1.5 + (i % 3)}
                                                            fill={colors[i % colors.length]}
                                                            opacity={0.6}
                                                        />
                                                    );
                                                })}
                                            </svg>
                                        )}
                                        {pIndex === 4 && ( /* Green Dots Cluster */
                                            <svg viewBox="0 0 200 200" className="absolute bottom-0 right-0 w-3/4 h-3/4 opacity-30 translate-x-1/4 translate-y-1/4">
                                                {[...Array(35)].map((_, i) => (
                                                    <circle
                                                        key={i}
                                                        cx={50 + Math.random() * 150}
                                                        cy={50 + Math.random() * 150}
                                                        r={2 + Math.random() * 8}
                                                        fill="#22c55e"
                                                    />
                                                ))}
                                            </svg>
                                        )}
                                    </div>

                                    {/* Top Row: Number Only (Neutral) */}
                                    <div className="flex justify-between items-start mb-6 relative z-10">
                                        <span className="text-2xl font-bold text-gray-200 group-hover:text-gray-300 transition-colors duration-300 font-orbitron">
                                            {index + 1 < 10 ? `0${index + 1}` : index + 1}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="relative z-10 mt-2">
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 font-orbitron group-hover:text-blue-900 transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm leading-relaxed mb-4 font-inter">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
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
