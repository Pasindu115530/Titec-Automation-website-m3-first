import React from 'react';

export interface FAQ {
    question: string;
    answer: React.ReactNode;
}

export const FAQs: FAQ[] = [
    {
        question: "What industrial automation services do you offer in Sri Lanka?",
        answer: (
            <>
                TiTec Automation Solutions provides comprehensive <b>industrial automation services across Sri Lanka</b>, specializing in turnkey solutions for manufacturing facilities. Our core services include:
                <ul className="list-disc ml-5 mt-2 space-y-1">
                    <li><strong className="font-semibold">PLC Programming & Troubleshooting:</strong> Expert logic design for complex machinery.</li>
                    <li><strong className="font-semibold">HMI & SCADA Development:</strong> User-friendly interfaces and real-time monitoring systems.</li>
                    <li><strong className="font-semibold">Robotics Integration:</strong> Programming and installation of industrial robot arms.</li>
                    <li><strong className="font-semibold">Machine Upgrades:</strong> Retrofitting older machinery with modern VFDs, servos, and sensors.</li>
                    <li><strong className="font-semibold">Control Panel Building:</strong> Custom design and assembly of industrial switchgear and control panels.</li>
                </ul>
            </>
        )
    },
    {
        question: "What are the benefits of using industrial automation in Sri Lanka?",
        answer: (
            <>
                We deliver automation solutions to a wide range of sectors, helping businesses strictly adhere to global standards. 
                We have extensive experience in <b>food & beverage manufacturing, packaging, chemical processing, construction materials, and distilleries</b>. 
                Our portfolio includes successful collaborations with major brands such as <b>CBL, JAT, and ACME Distilleries</b>, ensuring their production lines operate at peak efficiency.
            </>
        )
    },
    {
        question: "Can you help improve our factory’s production efficiency?",
        answer: (
            <>
                Yes. We specialize in <b>production process optimization</b> to help you achieve higher output with lower operational 
                costs. By implementing <b>advanced PLC controls, robotics, and automated conveyor systems</b>,
                we help factories significantly reduce manual errors, minimize machine downtime, and ensure 
                consistent product quality.
            </>
        )
    },
    {
        question: "Do you specialize in Siemens and Sinovo PLC programming?",
        answer: (
            <>
                Yes, we are experts in <b>Siemens and Sinovo PLC programming</b> and are also a leading supplier and support partner for 
                <b> Sinovo PLCs</b>. Whether you need a new program written from scratch or require troubleshooting for an existing system, 
                our engineers can handle most major PLC platforms used in Sri Lankan industries, ensuring seamless integration and 
                communication between devices.
            </>
        )
    },
    {
        question: "What types of industrial robotics and automation integration do you handle?",
        answer: (
            <>
                We integrate high-performance industrial robots to automate repetitive and high-speed tasks. We specialize in programming 
                <b> Kawasaki, KUKA, and Borunte robot arms</b> for applications such as:
                <ul className="list-disc ml-5 mt-2 space-y-1">
                    <li><strong className="font-semibold">Pick-and-Place & Palletizing:</strong> Streamlining packaging lines.</li>
                    <li><strong className="font-semibold">High-Speed Handling:</strong> Using parallel (Delta) robots for rapid sorting.</li>
                    <li><strong className="font-semibold">Automated Assembly:</strong> Enhancing precision in manufacturing.</li>
                </ul>
            </>
        )
    },
    {
        question: "Can you retrofit or upgrade my existing factory machinery?",
        answer: (
            <>
                Absolutely. <b>Machine retrofitting</b> is one of our core specialties. We can modernize your older equipment—such as 
                <b> multihead weighers, packing machines, and counting systems</b>—by replacing outdated controls with modern PLCs, HMIs, 
                and servo systems. This is a cost-effective alternative to buying new machinery, giving you improved speed, 
                accuracy, and reliability.
            </>
        )
    },
    {
        question: "Do you supply industrial automation hardware and components?",
        answer: (
            <>
                Yes, TiTec is a trusted supplier of <b>industrial automation components in Sri Lanka</b>. Our marketplace features 
                high-quality parts including:
                <ul className="list-disc ml-5 mt-2 space-y-1">
                    <li><strong className="font-semibold">Controllers:</strong> Siemens and Sinovo PLCs, HMIs.</li>
                    <li><strong className="font-semibold">Drives & Motion:</strong> VFDs (Variable Frequency Drives), Servo motors, and Stepper motors.</li>
                    <li><strong className="font-semibold">Switchgear & Sensors:</strong> Contactors, relays, power supplies, and industrial sensors.</li>
                </ul>
                <p className="mt-2">All products come with full technical support and datasheets to ensure they fit your specific application.</p>
            </>
        )
    },
    {
        question: "Do you offer SCADA systems for real-time factory monitoring?",
        answer: (
            <>
                Yes, we design and deploy <b>SCADA (Supervisory Control and Data Acquisition) systems</b> that give you total visibility 
                over your plant floor. Our solutions provide <b>real-time data logging, centralized control, and alarm management</b>, 
                allowing facility managers to track KPIs, detect faults early, and make data-driven decisions to maintain 
                operational flow.
            </>
        )
    },
    {
        question: "Do you offer emergency repair and troubleshooting for automation systems?",
        answer: (
            <>
                Yes, we provide <b> fast-response on-site troubleshooting and repair throughout Sri Lanka</b>. If your production line stops 
                due to a fault in a PLC, VFD, HMI, or control panel, our engineers can diagnose the issue and implement a fix quickly. 
                We aim to minimize downtime and get your manufacturing process back up and running as soon as possible.
            </>
        )
    },
    {
        question: "Do you provide custom automation solutions for unique requirements?",
        answer: (
            <>
                Yes. We understand that every production line is unique. We offer <b>custom-engineered automation solutions</b> tailored to 
                your specific business goals. From designing a unique robotic sequence to building a custom control panel for a 
                specialized machine, we align our technology with your exact workflow requirements.
            </>
        )
    },
];