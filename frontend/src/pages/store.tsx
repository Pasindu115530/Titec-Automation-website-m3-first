import Footer from "../components/footer";

const PRODUCTS = [
    { id: 'p1', name: 'Industrial Sensor', price: '$149', desc: 'Robust sensor for harsh environments.' },
    { id: 'p2', name: 'PLC Starter Kit', price: '$549', desc: 'Includes PLC, power supply and I/O modules.' },
    { id: 'p3', name: 'HMI Panel 7"', price: '$299', desc: '7-inch touch HMI with pre-built templates.' },
]

export default function Store() {
    return (
        <>
            <main className="max-w-6xl mx-auto px-6 py-12">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold">Store</h1>
                    <p className="text-gray-600">Browse our commonly sold items. For volume orders request a quote.</p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {PRODUCTS.map(p => (
                        <div key={p.id} className="border rounded-lg p-4 bg-white">
                            <div className="h-40 bg-gray-100 rounded mb-4 flex items-center justify-center">Image</div>
                            <div className="font-semibold text-lg">{p.name}</div>
                            <div className="text-gray-500 text-sm mb-3">{p.desc}</div>
                            <div className="flex items-center justify-between">
                                <div className="text-xl font-bold">{p.price}</div>
                                <button className="px-3 py-1 bg-blue-600 text-white rounded">Add to cart</button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </>
    )
}