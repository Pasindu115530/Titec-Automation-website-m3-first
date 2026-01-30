"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Loader from "@/components/loader";
import Footer from "@/components/footer";
import { clients } from "@/assets/clients/clients";
import type { Client } from "@/assets/clients/clients";
import heroRobotArm from "@/assets/hero_robot_arm_17678560868133.png";
import { Project } from "@/types";
import { SERVICES } from "@/data/serviceData";
import { useCart } from "@/context/CartContext";
import { getImageUrl } from "@/utils/image-utils";

// Custom Hook for Scroll Detection
function useInView(threshold = 0) {
    const [isInView, setIsInView] = useState(false);
    const [element, setElement] = useState<HTMLElement | null>(null);

    useEffect(() => {
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsInView(entry.isIntersecting);
            },
            { threshold }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, [element, threshold]);

    return { ref: setElement, isInView };
}

interface HomeClientProps {
    initialProjects: Project[];
}

export default function HomeClient({ initialProjects }: HomeClientProps) {
    const [status, setStatus] = useState("loading");
    // Use passed projects or local state if we were fetching more, but for now just use props
    // We can keep state if we want to simulate the loading effect still
    const { setIsOpen } = useCart();

    // Refs for Scroll Animations
    const { ref: contentRef, isInView: contentInView } = useInView(0);
    const { ref: imageRef, isInView: imageInView } = useInView(0);

    useEffect(() => {
        // Simulate loading duration for effect
        const timer = setTimeout(() => {
            setStatus("complete");
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    if (status === "loading") {
        return <Loader />;
    }

    return (
        <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-white">
            {/* Main Content starts after loading */}

            <section
                className="relative min-h-screen flex items-center bg-gray-50 overflow-hidden font-inter text-gray-900"
                onMouseMove={(e) => {
                    const x = (window.innerWidth - e.pageX * 2) / 100;
                    const y = (window.innerHeight - e.pageY * 2) / 100;
                    document.documentElement.style.setProperty('--mouse-x', `${x}px`);
                    document.documentElement.style.setProperty('--mouse-y', `${y}px`);
                }}
            >
                {/* Background Grid Pattern (Parallax Layer 1) */}
                <div className="absolute inset-0 z-0 opacity-[0.4]" style={{
                    backgroundImage: `radial-gradient(#cbd5e1 1px, transparent 1px)`,
                    backgroundSize: '32px 32px',
                    transform: 'translate(var(--mouse-x), var(--mouse-y))',
                    transition: 'transform 0.1s ease-out'
                }}></div>

                {/* Floating Tech Particles (Parallax Layer 2 - Faster) */}
                <div className="absolute inset-0 pointer-events-none" style={{
                    transform: 'translate(calc(var(--mouse-x) * -2), calc(var(--mouse-y) * -2))',
                    transition: 'transform 0.1s ease-out'
                }}>
                    <div className="absolute top-1/4 left-1/4 w-4 h-4 border-2 border-gray-300 rounded-full animate-float opacity-60"></div>
                    <div className="absolute top-1/3 right-1/4 w-6 h-6 border border-blue-200 rotate-45 animate-float-delay opacity-50"></div>
                    <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-red-400 rounded-full animate-float opacity-40"></div>
                    <div className="absolute top-10 right-10 text-gray-200 text-6xl opacity-20 font-orbitron font-bold select-none">+</div>
                    <div className="absolute bottom-20 left-10 text-gray-200 text-8xl opacity-10 font-michroma font-bold select-none">01</div>
                </div>

                {/* Live System Widgets */}
                <div className="absolute top-34 right-6 hidden md:flex flex-col items-end z-20 opacity-40 pointer-events-none">
                    <div className="font-mono text-xs text-orange-500 font-bold tracking-widest mb-1 flex items-center">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></span>
                        LIVE SYSTEM
                    </div>
                    <div className="font-mono text-xs text-gray-400">
                        SYS.STATUS: <span className="text-blue-600">ONLINE</span>
                    </div>
                    <div className="font-mono text-xs text-gray-400 mt-1">
                        COORDS: <span className="text-gray-600">34.05N, 118.24W</span>
                    </div>
                </div>

                {/* Decorative Vertical Ruler/Dash Pattern (Left Side) */}
                <div className="absolute left-6 top-1/3 flex-col gap-2 opacity-50 z-0 hidden md:flex">
                    <div className="w-6 h-[2px] bg-gray-500"></div>
                    <div className="w-4 h-[2px] bg-gray-600"></div>
                    <div className="w-12 h-[3px] bg-black-900"></div>
                    <div className="w-4 h-[2px] bg-gray-600"></div>
                    <div className="w-6 h-[2px] bg-gray-600"></div>
                    <div className="w-3 h-[2px] bg-gray-600"></div>
                    <div className="w-8 h-[2px] bg-gray-600"></div>
                </div>

                {/* Decorative Vertical Ruler (Right Side - Mirrored) */}
                <div className="absolute right-6 bottom-1/3 flex-col gap-2 items-end opacity-80 z-0 hidden md:flex">
                    <div className="w-8 h-[2px] bg-blue-400"></div>
                    <div className="w-3 h-[2px] bg-blue-500"></div>
                    <div className="w-6 h-[2px] bg-gray-500"></div>
                    <div className="w-4 h-[2px] bg-blue-500"></div>
                    <div className="w-10 h-[3px] bg-gray-500"></div>
                    <div className="w-4 h-[2px] bg-blue-500"></div>
                    <div className="w-6 h-[2px] bg-gray-400"></div>
                </div>

                {/* Decorative Horizontal Scale (Bottom Left) */}
                <div className="absolute bottom-12 left-20 gap-4 opacity-40 z-0 hidden md:flex items-end">
                    <div className="h-4 w-px bg-gray-400"></div>
                    <div className="h-2 w-px bg-gray-300"></div>
                    <div className="h-2 w-px bg-gray-300"></div>
                    <div className="h-2 w-px bg-gray-300"></div>
                    <div className="h-3 w-px bg-gray-400"></div>
                    <div className="h-2 w-px bg-gray-300"></div>
                    <div className="h-2 w-px bg-gray-300"></div>
                    <div className="h-4 w-px bg-gray-800"></div>
                    <div className="h-2 w-px bg-gray-300"></div>
                </div>

                {/* Decorative Horizontal Barcode (Top Right) */}
                <div className="absolute top-28 right-20 gap-2 opacity-30 z-0 hidden md:flex">
                    <div className="w-12 h-1 bg-gray-400"></div>
                    <div className="w-2 h-1 bg-gray-300"></div>
                    <div className="w-2 h-1 bg-gray-300"></div>
                    <div className="w-6 h-1 bg-gray-800"></div>
                    <div className="w-2 h-1 bg-gray-300"></div>
                    <div className="w-8 h-1 bg-gray-400"></div>
                </div>

                {/* Soft Ambient Glows */}
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-linear-to-r from-blue-100/50 to-transparent rounded-full blur-3xl pointer-events-none mix-blend-multiply"></div>
                <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-linear-to-b from-gray-200/50 to-transparent rounded-full blur-3xl pointer-events-none mix-blend-multiply"></div>

                {/* Tech Decor: Circuit Paths */}
                <div className="absolute inset-x-0 top-1/4 h-px bg-linear-to-r from-transparent via-gray-300 to-transparent opacity-20"></div>
                <div className="absolute inset-y-0 right-1/3 w-px bg-linear-to-b from-transparent via-gray-300 to-transparent opacity-20"></div>

                {/* Tech Decor: Small Data Points */}
                <div className="absolute top-[22%] left-[15%] font-mono text-[10px] text-blue-400 opacity-60 tracking-widest uppercase">
                    sys_opt :: <span className="text-gray-400">active</span>
                </div>
                <div className="absolute bottom-[35%] right-[20%] font-mono text-[10px] text-gray-400 opacity-60 tracking-widest hidden md:block">
                    {'>>'} <span className="text-red-400">init_sequence</span>
                </div>
                <div className="absolute top-[40%] right-[5%] font-mono text-[10px] text-gray-300 opacity-40 -rotate-90 origin-bottom-right hidden lg:block">
                    EST_CONN_SECURE
                </div>

                {/* Tech Decor: Corner Accents */}
                <div className="absolute top-40 left-8 w-6 h-6 border-l-2 border-t-2 border-red-500/30"></div>
                <div className="absolute bottom-20 right-8 w-6 h-6 border-r-2 border-b-2 border-blue-500/30"></div>
                <div className="absolute top-1/2 left-4 w-1 h-8 bg-gray-200 rounded-full"></div>

                {/* Ambient Light Overlay */}
                <div className="absolute inset-0 bg-white/60 pointer-events-none z-0"></div>

                <div className="container mx-auto px-6 lg:px-12 relative z-10 h-full flex flex-col md:flex-row items-center justify-between pt-14">

                    {/* Left: Content Area */}
                    <div
                        ref={contentRef}
                        className="w-full md:w-1/2 flex flex-col justify-center items-start text-left mb-16 md:mb-0 z-20 md:pl-37"
                    >

                        {/* Badge (Welcome) */}
                        <div className={`inline-flex items-center mb-8 bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full border border-gray-100 shadow-sm transition-all duration-700 ease-in delay-0 ${contentInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
                            <span className="w-2 h-2 rounded-full bg-red-500 mr-3 animate-pulse"></span>
                            <span className="text-xs font-bold text-gray-600 tracking-[0.2em] uppercase font-orbitron">TITEC AUTOMATION SYSTEMS</span>
                        </div>

                        {/* Headline */}
                        <h1 className={`text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-linear-to-r from-gray-900 via-gray-700 to-gray-900 mb-2 leading-none font-orbitron tracking-widest drop-shadow-sm transition-all duration-700 ease-in delay-100 ${contentInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`} style={{ fontStyle: 'italic' }}>
                            FUTURE
                        </h1>
                        <p className={`text-xl md:text-2xl font-bold text-gray-800 uppercase tracking-[0.4em] mb-10 pl-2 font-orbitron transition-all duration-700 ease-in delay-200 ${contentInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
                            IS NEAR
                        </p>

                        {/* Subtext */}
                        <div className={`max-w-[800px] hidden md:block transition-all duration-700 ease-in delay-300 ${contentInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
                            <p className="text-sm text-gray-600 mb-8 leading-relaxed font-mono">
                                We are a <strong className="text-gray-900">Sri Lankan</strong> industrial automation company delivering advanced solutions that streamline production, minimize downtime, and significantly enhance product quality.
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 ease-in delay-500 ${contentInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
                            <button
                                onClick={() => setIsOpen(true)}
                                className="px-8 py-4 bg-blue-900 text-white font-bold rounded-none hover:bg-blue-800 transition-colors shadow-lg tracking-wider font-orbitron text-sm cursor-pointer"
                            >
                                GET QUOTE
                            </button>
                            <a href="/store" className="px-8 py-4 bg-white text-blue-900 border-2 border-blue-900 font-bold rounded-none hover:bg-blue-50 transition-colors tracking-wider font-orbitron text-sm flex items-center justify-center">
                                VISIT STORE
                            </a>
                        </div>
                    </div>

                    {/* Right: Image Area */}
                    <div
                        ref={imageRef}
                        className={`w-full md:w-1/2 flex justify-center md:justify-end relative items-center transition-all duration-700 ease-in delay-200 ${imageInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-24'}`}
                    >
                        <div className="relative z-10 w-full max-w-lg transform md:-translate-x-24">
                            <Image
                                src={heroRobotArm}
                                alt="Industrial Robot Arm"
                                className="w-full h-auto object-contain mix-blend-multiply"
                                priority
                                style={{
                                    filter: 'contrast(1.05) brightness(1.02)',
                                    maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%), linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
                                    WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%), linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
                                    maskComposite: 'intersect',
                                    WebkitMaskComposite: 'source-in'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Clients Section */}
            <section className="w-full bg-white py-12">
                <div className="w-full">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-bold text-gray-800 section-title">Our <span className="text-(--secondary-blue)">CLIENTS</span></h1>
                        <p className="mt-2 text-gray-600">Trusted by industry leaders.</p>
                    </div>

                    <div className="clients-scroll-container">
                        <div className="clients-scroll-track">
                            {clients.map((client: Client, index) => (
                                <div key={index} className="client-item relative group h-32 overflow-hidden bg-white flex items-center justify-center">
                                    <Image
                                        src={client.logo}
                                        alt={client.name}
                                        className="w-auto h-auto max-h-24 max-w-40 object-contain transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <a href="#" className="px-6 py-2 bg-white text-black font-medium rounded-full hover:bg-gray-100 transition">
                                            View Project
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* What We Do Section */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold text-gray-800 section-title"><span className="text-(--secondary-blue)">WHAT</span> We Do</h2>
                        <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
                            Designing and deploying tailored automation systems — from concept to commissioning.
                        </p>
                    </div>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {SERVICES.map((service) => (
                            <Link href={`/services/${service.slug}`} key={service.id} className="group relative block h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                                <Image
                                    src={service.image}
                                    alt={service.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                                <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end h-full">
                                    <h3 className="text-xl font-bold text-white mb-2 font-orbitron tracking-wide group-hover:text-blue-400 transition-colors">
                                        {service.title}
                                    </h3>
                                    <p className="text-gray-300 text-sm mb-4 line-clamp-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                                        {service.description}
                                    </p>
                                    <div className="flex items-center text-blue-400 font-bold text-sm tracking-wider uppercase opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-200">
                                        Explore <span className="ml-2 text-lg">→</span>
                                    </div>
                                    <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Projects Section */}
            <section className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold text-gray-800 section-title">Our <span className="text-(--secondary-blue)">PROJECTS</span></h2>
                        <p className="mt-2 text-gray-600">Selected deployments and case studies.</p>
                    </div>

                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {initialProjects.length > 0 ? (
                            initialProjects.map((project, index) => {
                                const imageUrl = getImageUrl(project.thumbnail_path, '');

                                return (
                                    <div key={project.id} className="group h-96 w-full max-w-sm mx-auto perspective-1000 cursor-pointer">
                                        <div className="relative h-full w-full shadow-xl rounded-xl transition-all duration-700 transform-style-3d group-hover:rotate-y-180">
                                            {/* Front Face */}
                                            <div className="absolute inset-0 h-full w-full bg-white rounded-xl backface-hidden flex flex-col overflow-hidden">
                                                <div className="h-48 bg-linear-to-br from-gray-200 to-gray-100 flex items-center justify-center text-gray-400 relative">
                                                    {imageUrl ? (
                                                        <img src={imageUrl} alt={project.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="font-semibold text-lg">PROJECT {index + 1}</span>
                                                    )}
                                                </div>
                                                <div className="p-6 flex flex-col justify-between grow">
                                                    <div>
                                                        <h3 className="text-xl font-bold text-gray-800">{project.title}</h3>
                                                        <div className="w-12 h-1 bg-red-500 mt-2"></div>
                                                        {project.client && (
                                                            <p className="text-xs text-blue-600 mt-1">{project.client}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Back Face */}
                                            <div className="absolute inset-0 h-full w-full bg-blue-900/90 backdrop-blur-sm rounded-xl p-8 text-white rotate-y-180 backface-hidden flex flex-col justify-center items-center text-center border border-white/10">
                                                <h3 className="text-2xl font-bold mb-4">{project.title}</h3>
                                                <p className="text-base leading-relaxed text-gray-100">
                                                    {project.description || "No description available."}
                                                </p>
                                                <Link href={`/projects/${project.id}`} className="button-1">View Details</Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <p className="text-gray-500">No projects available yet.</p>
                            </div>
                        )}

                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
}
