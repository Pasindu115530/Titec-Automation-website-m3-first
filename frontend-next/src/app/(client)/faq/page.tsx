import type { JSX } from 'react'
import Footer from "@/components/footer";
import SectionHeader from '@/components/section-header';
import FaqAccordion from '@/components/faq-accordion';
import { FaCog, FaMicrochip, FaNetworkWired, FaServer } from 'react-icons/fa';

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

    return (
        <div className="min-h-screen font-sans text-slate-800 bg-slate-50 flex flex-col">
            <div className="relative flex-1 overflow-hidden">
                {/* Creative Background Elements */}
                <div className="absolute inset-0 z-0 opacity-40 pointer-events-none bg-radial-dot-slate"></div>

                {/* Blobs - concentrated at bottom */}
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-3xl pointer-events-none animate-float"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-100/60 rounded-full blur-3xl pointer-events-none animate-float-delay"></div>

                {/* Automation Icons Background - All at bottom */}
                <FaCog className="absolute bottom-[-50px] -left-16 text-blue-200/30 w-64 h-64 animate-[spin_20s_linear_infinite] pointer-events-none z-0" />
                <FaMicrochip className="absolute bottom-60 right-10 text-indigo-200/30 w-48 h-48 -rotate-12 pointer-events-none z-0 opacity-50" />
                <FaServer className="absolute bottom-20 left-20 text-slate-200/40 w-40 h-40 pointer-events-none z-0 opacity-50 hidden lg:block" />
                <FaNetworkWired className="absolute bottom-10 -right-12 text-blue-100/40 w-56 h-56 rotate-45 pointer-events-none z-0 opacity-50" />



                <main className="max-w-3xl mx-auto px-6 pt-32 pb-12 relative z-10">
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                    />
                    <SectionHeader
                        title="Frequently Asked"
                        highlightedText='Questions'
                        subtitle=""
                    />

                    <FaqAccordion />
                </main>
            </div>
            <Footer />
        </div>
    )
}
