"use client";

import React, { useState } from 'react';

export default function ContactForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        // Placeholder behaviour: in a real app send to backend or email provider
        // For now we just log and show a user message
        console.log({ name, email, message });
        alert('Thanks! Your message has been received (demo only).');
        setName('');
        setEmail('');
        setMessage('');
    }

    return (
        <div className="w-full bg-[#5D5076] text-white rounded-3xl p-8 md:p-12 overflow-hidden relative shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start relative z-10">
                {/* Left Side: Info Content */}
                <div className="space-y-6 pt-10">
                    <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white">
                        Contact Us
                    </h2>
                    <p className="text-lg text-white/90 leading-relaxed max-w-sm">
                        Have a question or need a quote? Send us a message and we will respond shortly.
                    </p>

                    <div className="pt-8 space-y-4">
                    </div>
                </div>

                {/* Right Side: Form Card */}
                <div className="w-full bg-white rounded-3xl p-8 shadow-2xl">
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-slate-900">
                            We&apos;d love to hear from you! <br />
                            <span className="text-indigo-600">Let&apos;s get in touch</span>
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
                                    placeholder="email@domain.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">Phone Number</label>
                                <input
                                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                                    placeholder="+1 (555) 000-0000"
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
                            className="w-full bg-[#4c3a69] hover:bg-[#3b2d52] text-white font-medium py-3.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-4"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
