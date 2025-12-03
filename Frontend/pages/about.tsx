import React, { type JSX } from 'react'

export default function About(): JSX.Element {
    return (
        <main className="max-w-5xl mx-auto px-6 py-12">
            <section className="text-center mb-10">
                <h1 className="text-4xl font-bold mb-4">About Titec Automation</h1>
                <p className="text-gray-600">
                    We design and deliver industrial automation solutions that help manufacturers
                    improve reliability, efficiency, and safety. Our team blends hardware,
                    controls and software expertise to deliver turnkey systems.
                </p>
            </section>

            <section className="grid gap-8 md:grid-cols-3">
                <div className="p-6 bg-white rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
                    <p className="text-gray-600 text-sm">Deliver practical automation that drives measurable ROI for customers.</p>
                </div>

                <div className="p-6 bg-white rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
                    <p className="text-gray-600 text-sm">Be the trusted partner for digital transformation in industrial operations.</p>
                </div>

                <div className="p-6 bg-white rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold mb-2">Values</h3>
                    <ul className="text-gray-600 text-sm list-disc list-inside">
                        <li>Safety first</li>
                        <li>Customer success</li>
                        <li>Continuous improvement</li>
                    </ul>
                </div>
            </section>

            <section className="mt-12">
                <h2 className="text-2xl font-bold mb-4">Meet the Team</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="p-4 bg-white rounded-lg shadow-sm">
                        <div className="h-24 w-24 bg-gray-200 rounded-full mb-3" />
                        <div className="font-semibold">Pasindu</div>
                        <div className="text-sm text-gray-500">Founder &amp; CTO</div>
                    </div>

                    <div className="p-4 bg-white rounded-lg shadow-sm">
                        <div className="h-24 w-24 bg-gray-200 rounded-full mb-3" />
                        <div className="font-semibold">Engineering</div>
                        <div className="text-sm text-gray-500">Controls & Software</div>
                    </div>

                    <div className="p-4 bg-white rounded-lg shadow-sm">
                        <div className="h-24 w-24 bg-gray-200 rounded-full mb-3" />
                        <div className="font-semibold">Support</div>
                        <div className="text-sm text-gray-500">Service &amp; Maintenance</div>
                    </div>
                </div>
            </section>
        </main>
    )
}