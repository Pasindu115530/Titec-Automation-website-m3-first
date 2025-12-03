import { useState, type JSX } from 'react'

const FAQS: { q: string; a: string }[] = [
    { q: 'What services do you provide?', a: 'We provide automation design, integration, PLC/HMI programming, and maintenance services.' },
    { q: 'Do you offer on-site support?', a: 'Yes — we offer commissioning and on-site maintenance agreements. Contact us for details.' },
    { q: 'Can you build custom control cabinets?', a: 'Yes, our engineering team designs and ships custom control panels to spec.' },
]

export default function Faq(): JSX.Element {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    return (
        <main className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>

            <div className="space-y-4">
                {FAQS.map((f, i) => (
                    <div key={i} className="border rounded-lg overflow-hidden">
                        <button
                            className="w-full text-left px-4 py-3 flex justify-between items-center bg-white"
                            onClick={() => setOpenIndex(openIndex === i ? null : i)}
                        >
                            <span className="font-medium">{f.q}</span>
                            <span className="text-gray-500">{openIndex === i ? '−' : '+'}</span>
                        </button>

                        {openIndex === i && (
                            <div className="px-4 py-3 bg-gray-50 text-gray-700">{f.a}</div>
                        )}
                    </div>
                ))}
            </div>
        </main>
    )
}