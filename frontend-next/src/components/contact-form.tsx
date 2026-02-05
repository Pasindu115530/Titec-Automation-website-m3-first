"use client";

import React, { useState } from 'react';
import { FaFacebook, FaWhatsapp, FaEnvelope, FaPhone } from 'react-icons/fa';
import { contacts } from '@/assets/clients/Contacts';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function ContactForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [company, setCompany] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await api.post('/api/contact', {
                name,
                company,
                email,
                phone,
                message
            });

            toast.success('Message sent successfully! We will get back to you shortly.');

            // Reset form
            setName('');
            setCompany('');
            setEmail('');
            setPhone('');
            setMessage('');
        } catch (error) {
            console.error(error);
            toast.error('Failed to send message. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="w-full bg-[#314E91] text-white rounded-3xl p-8 md:p-12 overflow-hidden relative shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start relative z-10">
                {/* Left Side: Info Content */}
                <div className="space-y-6 pt-10">
                    <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white">
                        Contact Usss
                    </h2>
                    <p className="text-lg text-white/90 leading-relaxed max-w-sm">
                        Have a question or need a quote? Send us a message and we respond shortly.
                    </p>

                    <div className="pt-22 space-y-6">
                        <div className="flex items-center gap-4 text-white/90 group cursor-pointer hover:text-white transition-colors">
                            <div className="p-2.5 bg-white/10 rounded-lg backdrop-blur-sm group-hover:bg-white/20 transition-all">
                                <FaEnvelope className="w-5 h-5" />
                            </div>
                            <a href={`mailto:${contacts[0].email || ''}`} className="text-base font-medium">
                                {contacts[0].email}
                            </a>
                        </div>

                        <div className="flex items-center gap-4 text-white/90 group cursor-pointer hover:text-white transition-colors">
                            <div className="p-2.5 bg-white/10 rounded-lg backdrop-blur-sm group-hover:bg-white/20 transition-all">
                                <FaPhone className="w-5 h-5" />
                            </div>
                            <a href={`tel:${contacts[0].tel}`} className="text-base font-medium">
                                {contacts[0].tel}
                            </a>
                        </div>

                        <div className="flex items-center gap-4 text-white/90 group cursor-pointer hover:text-white transition-colors">
                            <div className="p-2.5 bg-white/10 rounded-lg backdrop-blur-sm group-hover:bg-white/20 transition-all">
                                <FaFacebook className="w-5 h-5" />
                            </div>
                            <a href={contacts[0].facebook || '#'} target="_blank" rel="noopener noreferrer" className="text-base font-medium">
                                Facebook
                            </a>
                        </div>

                        <div className="flex items-center gap-4 text-white/90 group cursor-pointer hover:text-white transition-colors">
                            <div className="p-2.5 bg-white/10 rounded-lg backdrop-blur-sm group-hover:bg-white/20 transition-all">
                                <FaWhatsapp className="w-5 h-5" />
                            </div>
                            <a href={contacts[0].whatsapp || '#'} target="_blank" rel="noopener noreferrer" className="text-base font-medium">
                                WhatsApp
                            </a>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form Card */}
                <div className="w-full bg-white rounded-3xl p-8 shadow-2xl">
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-slate-900">
                            We&apos;d love to hear from you! <br />
                            <span className="text-black">Let&apos;s get in touch</span>
                        </h3>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">Full Name</label>
                                <input
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                                    placeholder="Full Name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">Company</label>
                                <input
                                    value={company}
                                    onChange={e => setCompany(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                                    placeholder="Company Name"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">Email</label>
                                <input
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                                    placeholder="email@titecautomation.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">Phone Number</label>
                                <input
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                                    placeholder="+94 000-000-000"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700">Message</label>
                            <textarea
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 min-h-[120px] resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                                placeholder="Type your message here..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full bg-[#000619] hover:bg-[#021C74] text-white font-medium py-3.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-4 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
