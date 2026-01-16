import React from 'react';
import { contacts } from '@/assets/clients/Contacts';
import { FaFacebook, FaWhatsapp, FaEnvelope, FaPhone } from 'react-icons/fa';
import Link from 'next/link';

export default function SocialLinksGrid() {
    const contact = contacts[0];

    const socialLinks = [
        {
            name: 'Facebook',
            handle: '@TiTecAutomation', // Fallback/Derived handle
            url: contact.facebook,
            icon: <FaFacebook className="w-8 h-8 text-white" />,
            colorClass: 'bg-blue-600',
            gradient: 'from-blue-600 to-blue-400'
        },
        {
            name: 'WhatsApp',
            handle: contact.tel,
            url: contact.whatsapp,
            icon: <FaWhatsapp className="w-8 h-8 text-white" />,
            colorClass: 'bg-green-500',
            gradient: 'from-green-500 to-emerald-400'
        },
        {
            name: 'Email',
            handle: 'madhusanka1171',
            url: `mailto:${contact.email}`,
            icon: <FaEnvelope className="w-8 h-8 text-white" />,
            colorClass: 'bg-indigo-600',
            gradient: 'from-indigo-600 to-indigo-400'
        },
        {
            name: 'Phone',
            handle: contact.tel,
            url: `tel:${contact.tel}`,
            icon: <FaPhone className="w-8 h-8 text-white" />,
            colorClass: 'bg-blue-600',
            gradient: 'from-blue-600 to-cyan-400'
        }
    ];

    return (
        <div className="w-full bg-[#3F6BFC] text-white rounded-3xl p-8 md:p-12 overflow-hidden relative shadow-xl">
            {/* Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start relative z-10 w-full">

                {/* Left Side: Info Content */}
                <div className="space-y-6 pt-10">
                    <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white">
                        View Us On
                    </h2>
                    <p className="text-lg text-white/90 leading-relaxed max-w-sm">
                        Stay connected and follow us on your preferred social media platform.
                    </p>
                </div>

                {/* Right Side: Social Grid Card */}
                <div className="w-full bg-white rounded-3xl p-8 shadow-2xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {socialLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative bg-slate-50 border border-slate-200 rounded-2xl p-6 transition-all duration-300 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/10"
                            >
                                <div className="flex flex-col h-full justify-between space-y-6">
                                    <div className="flex items-start justify-between">
                                        <div className={`p-3 rounded-xl bg-gradient-to-br ${link.gradient} shadow-md`}>
                                            {/* Icons are sized w-8 h-8 in config, scaling down slightly container if needed, but icon size is fixed in object */}
                                            {/* We need to clean up the icon prop usage or just render it. The icon prop has className hardcoded. */}
                                            <div className="text-white">
                                                {/* Re-rendering icon with specific class if possible, or just using what's passed */}
                                                {/* Since JSX element is passed, we just render it. */}
                                                {link.icon}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-1">
                                            {link.name}
                                        </h3>
                                        <p className="text-slate-500 text-xs">
                                            {link.handle}
                                        </p>
                                    </div>

                                    <div className="flex items-center text-indigo-600 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                                        View Profile
                                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
