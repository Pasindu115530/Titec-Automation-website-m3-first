import React, { type JSX } from 'react'
import Footer from "../../components/footer";
import ContactForm from '../../components/contact-form';
import MapSection from '../../components/map-section';
import SectionHeader from '../../components/section-header';
import { contacts } from '../../assets/clients/Contacts';

import { FaFacebook, FaWhatsapp, FaEnvelope, FaPhone } from 'react-icons/fa';

export default function Contact(): JSX.Element {
    return (
        <>
            <main className="max-w-3xl h-100vh mx-auto px-3 py-12">
                <SectionHeader
                    title="Us"
                    highlightedText='Contact'
                    highlightPosition='prefix'
                    subtitle="Have a question or need a quote? Send us a message and we will respond shortly."
                />

                <div className="mt-5">
                    <ContactForm />
                </div>

            </main>

            <section className="mt-10 mb-20 bg-black/10">
                <div className='p-5'>
                <SectionHeader
                    title="Us On"
                    highlightedText='View'
                    highlightPosition='prefix'
                    subtitle=""
                />
                </div>
                <div className="flex flex-wrap justify-center gap-20 pb-5">
                    <a href={contacts[0].facebook} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group transition-transform hover:-translate-y-1">
                        <div className="p-4 bg-gray-50 rounded-full shadow-sm group-hover:shadow-md group-hover:bg-blue-50 transition-all">
                            <FaFacebook className="w-8 h-8 text-blue-700" />
                        </div>
                        <span className="text-sm font-medium text-gray-600 group-hover:text-blue-700">Facebook</span>
                    </a>

                    <a href={contacts[0].whatsapp} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group transition-transform hover:-translate-y-1">
                        <div className="p-4 bg-gray-50 rounded-full shadow-sm group-hover:shadow-md group-hover:bg-green-50 transition-all">
                            <FaWhatsapp className="w-8 h-8 text-green-500" />
                        </div>
                        <span className="text-sm font-medium text-gray-600 group-hover:text-green-500">WhatsApp</span>
                    </a>

                    <a href={contacts[0].email} className="flex flex-col items-center gap-2 group transition-transform hover:-translate-y-1">
                        <div className="p-4 bg-gray-50 rounded-full shadow-sm group-hover:shadow-md group-hover:bg-blue-50 transition-all">
                            <FaEnvelope className="w-8 h-8 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600">Email</span>
                    </a>

                    <a href={contacts[0].tel} className="flex flex-col items-center gap-2 group transition-transform hover:-translate-y-1">
                        <div className="p-4 bg-gray-50 rounded-full shadow-sm group-hover:shadow-md group-hover:bg-green-50 transition-all">
                            <FaPhone className="w-8 h-8 text-green-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-600 group-hover:text-green-600">Call Us</span>
                    </a>
                </div>
            </section>

            <div className='flex flex-col gap-5'>
                <SectionHeader
                    title="Our"
                    highlightedText='Office'
                    subtitle=""
                />
                <MapSection />
            </div>

            <Footer />
        </>
    )
}
