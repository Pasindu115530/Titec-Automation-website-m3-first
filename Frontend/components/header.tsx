import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const location = useLocation()

  return (
    <header
      className={`site-header ${location.pathname === '/' ? 'absolute top-0 left-0 w-full z-50 bg-transparent' : 'shadow-sm'}`}
      style={{ fontFamily: 'Poppins, sans-serif' }}
    >
      <div className="max-w-full mx-auto px-16 py-6 flex items-center gap-15">
        <img src="../src/assets/titec-logo.svg" className="logo-img" alt="TiTEC-Automation-Solutions-logo" width="64" height="64" style={{ transform: 'scale(2.8)' }} />
        <div className="flex items-center gap-3">

          <div>
            <Link to="/" className="text-lg font-semibold site-title">TiTec Automation</Link>
            <div className="text-xs muted">Industrial Automation</div>
          </div>
        </div>

        {/* Navigation - desktop */}
        <nav className="hidden md:flex ml-14 flex-1">
          <ul className="flex gap-10 items-center text-gray-600 font-medium">
            <li><Link className="nav-link" style={location.pathname === '/' ? { color: '#0C2340' } : {}} to="/">Home</Link></li>
            <li><Link className="nav-link" style={location.pathname === '/store' ? { color: '#0C2340' } : {}} to="/store">Store</Link></li>
            <li><Link className="nav-link" style={location.pathname === '/about' ? { color: '#0C2340' } : {}} to="/about">About</Link></li>
            <li><Link className="nav-link" style={location.pathname === '/contact' ? { color: '#0C2340' } : {}} to="/contact">Contact</Link></li>
            <li><Link className="nav-link" style={location.pathname === '/faq' ? { color: '#0C2340' } : {}} to="/faq">FAQ</Link></li>
          </ul>
        </nav>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-4">
          <div className="hidden md:flex items-center bg-gray-100 rounded-md px-3 py-1.5 gap-1">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19a8 8 0 100-16 8 8 0 000 16z"></path></svg>
            <input className="bg-transparent outline-none text-sm text-gray-700" placeholder="Search products or services" />
          </div>

          <Link to="/store" className="hidden md:inline-block px-4 py-2 rounded-md btn-primary">Visit Store</Link>

          {/* Mobile hamburger (visual only) */}
          <button aria-label="menu" className="md:hidden p-2 rounded-md bg-gray-100">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
        </div>
      </div>
    </header>
  )
}