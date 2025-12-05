import { useState, useEffect } from "react";
import Loader from "../components/loader";
import Footer from "../components/footer";

export default function Homepage() {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus("success");
    }, 2000); // 2 seconds

    return () => clearTimeout(timer);
  }, []);

  if (status === "loading") {
    return <Loader />;
  }

  return (
    <>
      {/* Main Content starts after 3 seconds */}
      <section
        className="relative min-h-[90vh] flex items-center font-sans bg-linear-to-b from-(--hero-gradient-start) to-(--hero-gradient-end)"
      >
        <div className="absolute inset-0 z-0 bg-[url('/src/assets/hero-bg.png')] bg-no-repeat bg-cover bg-center opacity-[10%] pointer-events-none" />
        <div className="relative z-10 max-w-7xl pt-40 mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-1 gap-18 items-center">
          <div className="text-center">
            <h3 className="text-lg font-bold text-(--primary-blue)">WELCOME!</h3>
            <h1 className="text-4xl md:text-6xl font-semibold text-(--primary-blue) leading-tight tracking-tight">
              Transform Your Workflow with <br /> Next-Level Precision Robotics <br /> <span className="text-(--secondary-blue)">Smarter. Faster. Reliable</span>
            </h1>
            <p className="mt-8 text-lg text-gray-700 max-w-5xl mx-auto">
              We are a <strong>Sri Lankan</strong> industrial automation company delivering <strong>advanced solutions</strong> that streamline production, minimize downtime, and significantly
              enhance product quality. <strong>With years of expertise and successful collaborations</strong> with leading global brands, we provide fast, reliable,
              and high-precision automation systems that help businesses <strong>operate smarter and more efficiently.</strong>
            </p>

            <div className="mt-12 flex flex-col sm:flex-row gap-5 justify-center">
              <a
                className="button-1"
                href="/contact"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4"></path>
                </svg>
                Get Quote
              </a>
              <a
                className="button-2"
                href="/store"
              >
                Visit Store
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Our Clients Section */}
      <section className="w-full bg-white py-12">
        <div className="w-full">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-800">Our Clients</h2>
            <p className="mt-2 text-gray-600">Trusted by industry leaders.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full">
            {[
              "CBL", "Jat+", "Elcado", "Everest",
              "WinsLanka", "LCT Lanka", "Sky Roofing", "Motherson",
              "ACME Lanka Distilleries", "Sierra Cables", "Lanka Weld Mesh", "Texlan"
            ].map((client, index) => (
              <div key={index} className="relative group w-full h-48 border border-gray-100 overflow-hidden">
                <img
                  src={`https://placehold.co/600x400/f3f4f6/4b5563?text=${encodeURIComponent(client)}`}
                  alt={client}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <a href="#" className="px-6 py-2 bg-white text-black font-medium rounded-full hover:bg-gray-100 transition">
                    View Project
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">What We Do</h2>
            <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
              Designing and deploying tailored automation systems — from concept to commissioning.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
              <div className="text-red-500 mb-3">Packaging Automation</div>
              <p className="text-gray-600">Automated packaging lines for speed and consistency.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
              <div className="text-red-500 mb-3">Sorting Automation</div>
              <p className="text-gray-600">High-throughput sorting systems optimized for accuracy.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
              <div className="text-red-500 mb-3">Authorized PLC Sellers</div>
              <p className="text-gray-600">Genuine PLC hardware and fast delivery.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Our Projects</h2>
            <p className="mt-2 text-gray-600">Selected deployments and case studies.</p>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-lg overflow-hidden bg-white shadow hover:scale-[1.01] transition">
              <div className="h-40 bg-gradient-to-br from-gray-200 to-gray-100 flex items-center justify-center text-gray-400">
                Project Image
              </div>
              <div className="p-4">
                <h3 className="font-semibold">Conveyor Line Modernization</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Reduced downtime by 35% after automation and controls upgrade.
                </p>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden bg-white shadow hover:scale-[1.01] transition">
              <div className="h-40 bg-gradient-to-br from-gray-200 to-gray-100 flex items-center justify-center text-gray-400">
                Project Image
              </div>
              <div className="p-4">
                <h3 className="font-semibold">Automated Sorting System</h3>
                <p className="text-sm text-gray-600 mt-2">
                  High-precision sorting for mixed SKU production.
                </p>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden bg-white shadow hover:scale-[1.01] transition">
              <div className="h-40 bg-gradient-to-br from-gray-200 to-gray-100 flex items-center justify-center text-gray-400">
                Project Image
              </div>
              <div className="p-4">
                <h3 className="font-semibold">Robotic Palletizing</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Increased throughput and ergonomic safety improvements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
}
