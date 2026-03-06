import React from 'react';
import { format } from 'date-fns';

interface QuotationPreviewProps {
    customer: {
        name: string;
        email: string;
        phone?: string;
        company?: string;
        address?: string;
    };
    items: any[];
    vat: number;
    terms: string[];
    quotationId: number | string;
    date?: Date;
}

export default function QuotationPreview({ customer, items, vat, terms, quotationId, date = new Date() }: QuotationPreviewProps) {
    const subTotal = items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.price)), 0);
    const vatAmount = subTotal * (vat / 100);
    const grandTotal = subTotal + vatAmount;

    // Styles matching the blade template
    const themeColor = '#003366';

    return (
        <div className="bg-white p-8 max-w-[210mm] mx-auto min-h-[297mm] shadow-sm text-black font-serif text-[12px] leading-[1.4]" id="quotation-preview">

            {/* Header Section */}
            <div className="flex justify-between mb-5">
                {/* Left Column (60%) */}
                <div style={{ width: '60%' }} className="pr-4">
                    <div className="text-2xl font-bold mb-1.5" style={{ color: themeColor }}>TiTec Automation Solutions</div>
                    <div className="mb-5">
                        190/3, Bulugahalanda,<br />
                        Yatiyana, Minuwangoda,<br />
                        Sri Lanka.<br />
                        Phone: 0770417564<br />
                        Email: lahiru@titecautomation.lk
                    </div>

                    <div className="bg-[#003366] text-white px-2.5 py-1.5 font-bold inline-block w-[100px] mb-1.5">Attention :</div>
                    <div className="mt-1.5">
                        <strong>{customer.name}</strong><br />
                        {customer.company && <>{customer.company}<br /></>}
                        {customer.email}<br />
                        {customer.phone}
                    </div>
                </div>

                {/* Right Column (40%) */}
                <div style={{ width: '40%' }} className="text-right">
                    <div className="text-2xl font-bold text-[#003366] mb-4">Quotation</div>
                    <table className="w-full mt-2.5">
                        <tbody>
                            <tr>
                                <td className="text-right pr-4 font-bold pb-1">Date</td>
                                <td className="text-right pb-1">{format(date, 'dd/MM/yyyy')}</td>
                            </tr>
                            <tr>
                                <td className="text-right pr-4 font-bold">Qt No.</td>
                                <td className="text-right">Q{String(quotationId).padStart(4, '0')}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Items Table */}
            <table className="w-full border-collapse mt-5 text-[11px]">
                <thead>
                    <tr className="bg-[#003366] text-white">
                        <th className="border border-[#003366] p-2 text-center font-bold">Item Description</th>
                        <th className="border border-[#003366] p-2 text-center font-bold w-[50px]">Qty</th>
                        <th className="border border-[#003366] p-2 text-center font-bold w-[50px]">Unit</th>
                        <th className="border border-[#003366] p-2 text-center font-bold w-[80px]">Unit Price</th>
                        <th className="border border-[#003366] p-2 text-center font-bold w-[90px]">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => {
                        const qty = Number(item.quantity);
                        const price = Number(item.price);
                        const lineTotal = qty * price;

                        return (
                            <tr key={index}>
                                <td className="border border-black p-1.5">{item.name}</td>
                                <td className="border border-black p-1.5 text-center">{qty.toFixed(2)}</td>
                                <td className="border border-black p-1.5 text-center">{item.unit || 'Nos'}</td>
                                <td className="border border-black p-1.5 text-right">{price.toFixed(2)}</td>
                                <td className="border border-black p-1.5 text-right">{lineTotal.toFixed(2)}</td>
                            </tr>
                        );
                    })}

                    {/* Sub Total */}
                    <tr>
                        <td colSpan={3} className="border-none"></td>
                        <td className="border border-black p-1.5 font-bold bg-[#f0f0f0]">Sub Total</td>
                        <td className="border border-black p-1.5 font-bold text-right">{subTotal.toFixed(2)}</td>
                    </tr>

                    {/* VAT */}
                    {vat > 0 && (
                        <tr>
                            <td colSpan={3} className="border-none"></td>
                            <td className="border border-black p-1.5 font-bold bg-[#f0f0f0]">VAT({vat}%)</td>
                            <td className="border border-black p-1.5 font-bold text-right">{vatAmount.toFixed(2)}</td>
                        </tr>
                    )}

                    {/* Grand Total */}
                    <tr>
                        <td colSpan={3} className="border-none"></td>
                        <td className="border border-black p-1.5 font-bold bg-[#d9d9d9]">Total</td>
                        <td className="border border-black p-1.5 font-bold text-right">{grandTotal.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>

            {/* Footer Section */}
            <div className="mt-8">
                <div className="font-bold underline mb-2.5 text-[12px]">Terms and Conditions</div>
                <ul className="list-none p-0 m-0">
                    {terms.length > 0 ? (
                        terms.map((term, index) => (
                            <li key={index} className="mb-1.5">{term}</li>
                        ))
                    ) : (
                        <>
                            {/* Fallback default terms if none provided, though prop usually provides them */}
                            <li className="mb-1.5"><strong>Advance Payment</strong> – 70% of the total project value is required as an advance payment to initiate work.</li>
                            <li className="mb-1.5"><strong>Delivery Time</strong> – Standard delivery time is 30 days after receiving the Purchase Order (PO). However, this may vary depending on the project scope.</li>
                            <li className="mb-1.5"><strong>Payment Terms</strong> – The remaining payment is to be made within 30 days from the date of delivery of the completed work.</li>
                            <li className="mb-1.5"><strong>Warranty</strong> – A 1-year warranty is provided for manufacturing defects. This does not cover damages due to misuse, improper handling, or external factors.</li>
                        </>
                    )}
                </ul>

                <div className="font-bold underline mb-2.5 mt-4 text-[12px]">Payment details</div>
                <div className="w-1/2 mt-2.5">
                    <table className="w-full">
                        <tbody>
                            <tr>
                                <td className="py-0.5 font-bold">Name</td>
                                <td className="py-0.5">M.K.L.M.Premarathne</td>
                            </tr>
                            <tr>
                                <td className="py-0.5 font-bold">ACC No</td>
                                <td className="py-0.5">006550013781</td>
                            </tr>
                            <tr>
                                <td className="py-0.5 font-bold">Bank</td>
                                <td className="py-0.5">Sampath Bank</td>
                            </tr>
                            <tr>
                                <td className="py-0.5 font-bold">Branch</td>
                                <td className="py-0.5">Minuwangoda</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-8 italic">
                Thank you for your inquiry. We are looking forward to Your business.
            </div>
        </div>
    );
}
