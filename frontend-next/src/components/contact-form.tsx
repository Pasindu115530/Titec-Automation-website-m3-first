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
        <div className="w-full bg-[#020617] text-white rounded-3xl p-8 md:p-12 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Left Side: Text Content */}
                <div className="space-y-6">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-slate-800/50 border border-slate-700 text-sm text-slate-300">
                        Contact Us
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                        Let&apos;s Get In Touch.
                    </h1>
                    <p className="text-base text-slate-400">
                         Have a question or need a quote? Send us a message and we will respond shortly.
                    </p>
                </div>

                {/* Right Side: Form */}
                <div className="w-full">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-200">Full Name</label>
                            <div className="relative">
                                <input
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full bg-[#0F172A] border border-slate-800 rounded-lg pl-4 pr-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                                    placeholder="Enter your full name..."
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-200">Email Address</label>
                            <div className="relative">
                                <input
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full bg-[#0F172A] border border-slate-800 rounded-lg pl-4 pr-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                                    placeholder="Enter your email address..."
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-200">Message</label>
                            <div className="relative">
                                <textarea
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    className="w-full bg-[#0F172A] border border-slate-800 rounded-lg pl-4 pr-4 py-3 text-slate-200 min-h-[160px] resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                                    placeholder="Enter your main text here..."
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3.5 rounded-full transition-colors flex items-center justify-center gap-2 mt-4"
                        >
                            Submit Form
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
