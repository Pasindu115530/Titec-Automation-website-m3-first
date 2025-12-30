import './App.css'
import { Routes, Route } from 'react-router-dom';
import Homepage from './pages/homepage';
import Store from './pages/store';
import About from './pages/about';
import Contact from './pages/contact';
import Faq from './pages/faq';
import Header from './components/header';
import AdminLayout from './pages/admin/AdminLayout';
import AdminLogin from './pages/admin/Login';
import AdminOrder from './pages/admin/adminOrder';
import AdminProductAdd from './pages/admin/adminProductAddPage';
import AdminProjectAdd from './pages/admin/adminProjectAddPage';
import AdminUserManagement from './pages/admin/adminUserManagement';

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

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOrder />} /> {/* Default to orders */}
            <Route path="orders" element={<AdminOrder />} />
            <Route path="add-product" element={<AdminProductAdd />} />
            <Route path="add-project" element={<AdminProjectAdd />} />
            <Route path="users" element={<AdminUserManagement />} />
          </Route>
        </Routes>
      </div>
    </div>



  )
}

export default App
