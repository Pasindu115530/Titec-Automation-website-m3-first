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
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input value={name} onChange={e => setName(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Your name" />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input value={email} onChange={e => setEmail(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="you@example.com" />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea value={message} onChange={e => setMessage(e.target.value)} className="w-full border rounded px-3 py-2 h-32" placeholder="Tell us about your project" />
            </div>

            <div>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Send Message</button>
            </div>
        </form>
    );
}
