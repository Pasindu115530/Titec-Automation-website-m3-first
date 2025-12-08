import React, { type JSX } from 'react'
import Footer from "../../components/footer";
import ContactForm from '../../components/contact-form';
import MapSection from '../../components/map-section';

export default function Contact(): JSX.Element {
    return (
        <>
            <main className="max-w-3xl mx-auto px-6 py-12">
                <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
                <p className="text-gray-600 mb-6">Have a question or need a quote? Send us a message and we will respond shortly.</p>

                <ContactForm />
            </main>

            <MapSection />

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
