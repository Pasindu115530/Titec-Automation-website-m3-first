"use client";

import React, { useState, type JSX } from 'react'
import Footer from "../../components/footer";
import { Map, APIProvider, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";

export default function Contact(): JSX.Element {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')

    const defaultCenter = {
        lat: 7.183163519396652,
        lng: 79.93233839777095
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        // Placeholder behaviour: in a real app send to backend or email provider
        // For now we just log and show a user message
        console.log({ name, email, message })
        alert('Thanks! Your message has been received (demo only).')
        setName('')
        setEmail('')
        setMessage('')
    }

    return (
        <>
            <main className="max-w-3xl mx-auto px-6 py-12">
                <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
                <p className="text-gray-600 mb-6">Have a question or need a quote? Send us a message and we will respond shortly.</p>

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
            </main>


            <section className='w-full h-[75vh]'>
                <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
                    <Map
                        defaultCenter={defaultCenter}
                        defaultZoom={13}
                        mapId={process.env.NEXT_PUBLIC_MAP_ID}
                    >
                        <AdvancedMarker
                            key={'TiTec_Location'}
                            position={defaultCenter}
                            title={"Titec Automation"}>
                            <Pin background={'red'} glyphColor={'#000'} borderColor={'#000'} />
                        </AdvancedMarker>
                    </Map>
                </APIProvider>
            </section>
            <section className="mt-10">
                <h2 className="text-xl font-semibold mb-2">Other ways to contact</h2>
                <ul className="text-gray-600">
                    <li>Email: <a href="mailto:info@titec-automation.example" className="text-blue-600">info@titec-automation.example</a></li>
                    <li>Phone: <a href="tel:+1234567890" className="text-blue-600">+1 234 567 890</a></li>
                </ul>
            </section>
            <Footer />
        </>
    )
}
