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
            <section className="py-20 px-6 bg-gray-50">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Mission */}
                        <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 bg-[#0C2340] rounded-2xl flex items-center justify-center mb-6 text-white">
                                <Target className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#0C2340] mb-4">Our Mission</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Deliver practical automation that drives measurable ROI for customers.
                            </p>
                        </div>

                        {/* Vision */}
                        <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 bg-[#0C2340] rounded-2xl flex items-center justify-center mb-6 text-white">
                                <Eye className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#0C2340] mb-4">Our Vision</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Be the trusted partner for digital transformation in industrial operations.
                            </p>
                        </div>

                        {/* Values */}
                        <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 bg-[#0C2340] rounded-2xl flex items-center justify-center mb-6 text-white">
                                <Heart className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#0C2340] mb-4">Core Values</h3>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-gray-600">
                                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                                    <span>Safety first</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-600">
                                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                                    <span>Customer success</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-600">
                                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
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
