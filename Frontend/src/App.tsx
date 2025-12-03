import './App.css'
import { Routes, Route } from 'react-router-dom';
import Homepage from '../pages/homepage';
import Store from '../pages/store';
import About from '../pages/about';
import Contact from '../pages/contact';
import Faq from '../pages/faq';
import Header from '../components/header';

function App() {

  return (
    <>
      <section className="p-6 bg-gray-50">
        <nav className="mb-6">
          <ul className="flex gap-4 text-gray-700 font-medium">
            <li className="hover:text-blue-500 cursor-pointer">HOME</li>
            <li className="hover:text-blue-500 cursor-pointer">STORE</li>
            <li className="hover:text-blue-500 cursor-pointer">ABOUT</li>
            <li className="hover:text-blue-500 cursor-pointer">CONTACT</li>
            <li className="hover:text-blue-500 cursor-pointer">FAQ</li>
          </ul>
        </nav>

        <header className="text-center">
          <h3 className="text-lg text-gray-500">Welcome!</h3>
          <h1 className="text-4xl font-bold text-gray-800">Increase Your Production</h1>
          <h1 className="text-4xl font-bold text-red-500">10X</h1>
          <h1 className="text-4xl font-bold text-gray-800">Fast.</h1>
          <p className="mt-4 text-gray-600">Your one-stop shop for all automation needs.</p>
          <div className="mt-6 flex justify-center gap-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Get Quota</button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">Visit Store</button>
          </div>
        </header>
      </section>

      <section className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">WHAT WE DO</h1>
        <p className="mt-4 text-gray-600">
          We design and deploy industrial and factory automation solutions that streamline production,
          reduce downtime, and improve quality. Services include PLC/SCADA and HMI development, robotic
          integration, control panel design, sensors & instrumentation, and preventive maintenance.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="p-4 bg-gray-100 rounded shadow">Packaging Automation</div>
          <div className="p-4 bg-gray-100 rounded shadow">Sorting Automation</div>
          <div className="p-4 bg-gray-100 rounded shadow">Authorized PLC sellers</div>
        </div>
      </section>

      <section className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">OUR PROJECTS</h1>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Placeholder for project images */}
          <div className="h-32 bg-gray-200 rounded shadow"></div>
          <div className="h-32 bg-gray-200 rounded shadow"></div>
          <div className="h-32 bg-gray-200 rounded shadow"></div>
        </div>
      </section>
    </>
  )
}

export default App
