import React, { type JSX } from 'react'
import Footer from "@/components/footer";
import ContactForm from '@/components/contact-form';
import SocialLinksGrid from '@/components/social-links-grid';
import MapSection from '@/components/map-section';
import SectionHeader from '@/components/section-header';

export default function Contact(): JSX.Element {
    return (
        <>
            <main className="max-w-7xl min-h-screen mx-auto px-4 sm:px-6 lg:px-8 py-12">



                <div className="mt-5">
                    <ContactForm />
                </div>
            </main>


            <SocialLinksGrid />

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
