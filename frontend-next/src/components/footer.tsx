import Link from 'next/link';
import { contacts } from '../assets/clients/Contacts';
import { FaFacebook, FaWhatsapp, FaEnvelope, FaPhone, FaArrowRight } from 'react-icons/fa';

export default function Footer() {
    const contact = contacts[0];

    return (
        <footer className="w-full">
            {/* CTA Section */}
            <div className="bg-gradient-to-b from-[#000033] to-black py-24 px-6 text-center relative overflow-hidden">
                {/* Decorative circles/glow matching the reference vibe */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-900/40 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="relative z-10 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Let&apos;s make something<br />great together.
                    </h2>
                    <p className="text-blue-200/80 mb-10 text-lg">
                        Let us know what challenges you are<br className="hidden md:block" />
                        trying to solve so we can help.
                    </p>

                    <Link
                        href="/about"
                        className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300 group"
                        aria-label="Contact Us"
                    >
                        <FaArrowRight className="text-xl group-hover:transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* Footer Links Section */}
            <div className="bg-black text-white pt-12 pb-8 border-t border-white/10">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Brand */}
                    <div>
                        <h4 className="text-xl font-bold mb-4">Titec Automation</h4>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Industrial automation solutions and services.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>
                                <Link href="/store" className="hover:text-blue-400 transition-colors">
                                    Store
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="hover:text-blue-400 transition-colors">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-blue-400 transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-semibold mb-4">Contact</h4>
                        <ul className="space-y-3">
                            <li>
                                <a href={`mailto:${contact.email}`} className="flex items-center gap-3 text-gray-400 hover:text-blue-400 transition-colors text-sm">
                                    <FaEnvelope className="text-blue-500" />
                                    <span>{contact.email}</span>
                                </a>
                            </li>
                            <li>
                                <a href={`tel:${contact.tel}`} className="flex items-center gap-3 text-gray-400 hover:text-green-400 transition-colors text-sm">
                                    <FaPhone className="text-green-500" />
                                    <span>{contact.tel}</span>
                                </a>
                            </li>
                            <li>
                                <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-green-400 transition-colors text-sm">
                                    <FaWhatsapp className="text-green-500" />
                                    <span>WhatsApp</span>
                                </a>
                            </li>
                            <li>
                                <a href={contact.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-blue-400 transition-colors text-sm">
                                    <FaFacebook className="text-blue-600" />
                                    <span>Facebook</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/10 text-center text-gray-600 text-sm">
                    &copy; {new Date().getFullYear()} Titec Automation. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
