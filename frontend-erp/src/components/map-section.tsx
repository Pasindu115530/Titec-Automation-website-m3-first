"use client";

import React from 'react';

export default function MapSection() {
    return (
        <section className='w-full h-[60vh] rounded-3xl overflow-hidden shadow-lg'>
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.5062684040163!2d79.92968837183517!3d7.182924015155788!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2e5c3c3469e2f%3A0x7ca4118b7829db34!2sTiTec%20Automation%20Solutions!5e0!3m2!1sen!2slk!4v1768837246703!5m2!1sen!2slk"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className='w-full h-full'
            ></iframe>
        </section>
    );
}
