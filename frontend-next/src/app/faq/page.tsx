"use client";

import { useState, type JSX } from 'react'
import Footer from "../../components/footer";
import { FAQs } from "../../assets/FAQ";
import type { FAQ } from "../../assets/FAQ";
import SectionHeader from '../../components/section-header';


export default function Faq(): JSX.Element {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What industrial automation services do you offer in Sri Lanka?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "TiTec Automation Solutions provides comprehensive industrial automation services across Sri Lanka, specializing in turnkey solutions for manufacturing facilities. Our core services include PLC Programming & Troubleshooting, HMI & SCADA Development, Robotics Integration (Kawasaki, KUKA, Borunte), Machine Upgrades (Retrofitting), and Custom Control Panel Building."
                }
            },
            {
                "@type": "Question",
                "name": "Which industries in Sri Lanka do you serve?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We deliver automation solutions to a wide range of sectors including food & beverage manufacturing, packaging, chemical processing, construction materials, and distilleries. Our portfolio includes successful collaborations with major brands such as CBL, JAT, and ACME Distilleries."
                }
            },
            {
                "@type": "Question",
                "name": "Can you help improve our factory’s production efficiency?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. We specialize in production process optimization to help you achieve higher output with lower operational costs. By implementing advanced PLC controls, robotics, and automated conveyor systems, we help factories significantly reduce manual errors, minimize machine downtime, and ensure consistent product quality."
                }
            },
            {
                "@type": "Question",
                "name": "Do you specialize in Siemens and Sinovo PLC programming?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, we are experts in Siemens PLC programming and are also a leading supplier and support partner for Sinovo PLCs (including SP600 and SP60 series). We can handle most major PLC platforms used in Sri Lankan industries, ensuring seamless integration and communication."
                }
            },
            {
                "@type": "Question",
                "name": "What types of industrial robotics and automation integration do you handle?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We integrate high-performance industrial robots to automate repetitive and high-speed tasks. We specialize in programming Kawasaki, KUKA, and Borunte robot arms for applications such as Pick-and-Place, Palletizing, High-Speed Handling (Delta robots), and Automated Assembly."
                }
            },
            {
                "@type": "Question",
                "name": "Can you retrofit or upgrade my existing factory machinery?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Absolutely. Machine retrofitting is one of our core specialties. We modernize older equipment—such as multihead weighers, packing machines, and counting systems—by replacing outdated controls with modern PLCs, HMIs, and servo systems. This improves speed, accuracy, and reliability without the cost of buying new machinery."
                }
            },
            {
                "@type": "Question",
                "name": "Do you supply industrial automation hardware and components?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, TiTec is a trusted supplier of industrial automation components in Sri Lanka. Our marketplace features high-quality parts including Siemens and Sinovo PLCs, HMIs, VFDs, Servo motors, Stepper motors, Switchgear, and Sensors. All products come with technical support."
                }
            },
            {
                "@type": "Question",
                "name": "Do you offer SCADA systems for real-time factory monitoring?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, we design and deploy SCADA (Supervisory Control and Data Acquisition) systems that give you total visibility over your plant floor. Our solutions provide real-time data logging, centralized control, and alarm management to help track KPIs and detect faults early."
                }
            },
            {
                "@type": "Question",
                "name": "Do you offer emergency repair and troubleshooting for automation systems?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, we provide fast-response on-site troubleshooting and repair throughout Sri Lanka. If your production line stops due to a fault in a PLC, VFD, HMI, or control panel, our engineers can diagnose the issue and minimize downtime to get your manufacturing process back up and running quickly."
                }
            },
            {
                "@type": "Question",
                "name": "Do you provide custom automation solutions for unique requirements?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. We offer custom-engineered automation solutions tailored to your specific business goals. From designing a unique robotic sequence to building a custom control panel for a specialized machine, we align our technology with your exact workflow requirements."
                }
            }
        ]
    }

    const [openIndex, setOpenIndex] = useState<number | null>(0)

    return (
        <>
            <main className="max-w-4xl mx-auto px-6 py-12">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
                <SectionHeader title="Frequently Asked Questions" />

                <div className="space-y-4">
                    {FAQs.map((FAQ: FAQ, i) => (
                        <div key={i} className="border rounded-lg overflow-hidden">
                            <button
                                className="w-full text-left px-4 py-3 flex justify-between items-center bg-white"
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                            >
                                <span className="font-medium">{FAQ.question}</span>
                                <span className="text-gray-500">{openIndex === i ? '−' : '+'}</span>
                            </button>

                            {openIndex === i && (
                                <div className="px-4 py-3 bg-gray-50 text-gray-700">{FAQ.answer}</div>
                            )}
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </>
    )
}
