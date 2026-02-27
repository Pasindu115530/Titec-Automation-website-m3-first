import Footer from "@/components/footer";
import { Target, Eye, Heart, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AboutHero from "@/components/client/about-hero";

export default function About() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <AboutHero />

            {/* Mission / Vision / Values Section */}
            <section className="py-16 px-6 bg-gray-50">
                <div className="container mx-auto max-w-3xl">
                    <div className="flex flex-col gap-4">
                        {/* Vision */}
                        <div className="bg-white p-7 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow min-h-[160px] flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-11 h-11 bg-[#0C2340] rounded-xl flex items-center justify-center text-white flex-shrink-0">
                                    <Eye className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-bold text-[#0C2340] tracking-wide">OUR VISION</h3>
                            </div>
                            <p className="text-gray-600 leading-relaxed text-[15px]">
                                Empowering Tomorrow&apos;s World through Innovative Automation
                            </p>
                        </div>

                        {/* Mission */}
                        <div className="bg-white p-7 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow min-h-[160px] flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-11 h-11 bg-[#0C2340] rounded-xl flex items-center justify-center text-white flex-shrink-0">
                                    <Target className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-bold text-[#0C2340] tracking-wide">OUR MISSION</h3>
                            </div>
                            <p className="text-gray-600 leading-relaxed text-[15px]">
                                To be the trusted leader in automation and energy solutions, dedicated to
                                driving innovation, sustainability, and excellence in every project. We aim to
                                enrich the lives of our clients, employees, and communities while delivering
                                innovative solutions that adapt to the ever-evolving needs of a rapidly changing
                                world.
                            </p>
                        </div>

                        {/* Core Values */}
                        <div className="bg-white p-7 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow min-h-[160px] flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-11 h-11 bg-[#0C2340] rounded-xl flex items-center justify-center text-white flex-shrink-0">
                                    <Heart className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-bold text-[#0C2340] tracking-wide">CORE VALUES</h3>
                            </div>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-gray-600 text-[15px]">
                                    <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                    <span>Safety first</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-600 text-[15px]">
                                    <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                    <span>Customer success</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-600 text-[15px]">
                                    <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                    <span>Continuous improvement</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="bg-[#0C2340] rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden">
                        {/* Background accents */}
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-radial-dot"></div>

                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                Ready to Transform Your Operations?
                            </h2>
                            <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                                Let&apos;s discuss how we can help you achieve your automation goals with our expert solutions.
                            </p>
                            <Link href="/contact">
                                <Button className="bg-white text-[#0C2340] hover:bg-gray-100 text-lg px-8 py-6 rounded-full font-semibold transition-transform hover:scale-105">
                                    Get in Touch
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
