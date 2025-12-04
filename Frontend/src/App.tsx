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
    <div className="w-full min-h-screen flex flex-col">
      <Header />
      <div className="w-full flex-grow bg-white text-black">
        <Routes>
          <Route path="/*" element={<Homepage />} />
          <Route path="/store" element={<Store />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<Faq />} />
        </Routes>
      </div>
    </div>



  )
}

export default App
