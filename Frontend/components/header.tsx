import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="site-header shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-6">
        <img src="/logo.jpg" className="logo-img" alt="logo" />
        <div className="flex items-center gap-3">
          
          <div>
            <Link to="/" className="text-lg font-semibold site-title">Titec Automation</Link>
            <div className="text-xs muted">Industrial Automation</div>
          </div>
        </div>

        {/* Navigation - desktop */}
        <nav className="hidden md:flex ml-6 flex-1">
          <ul className="flex gap-6 items-center text-gray-600 font-medium">
            <li><Link className="nav-link" to="/">Home</Link></li>
            <li><Link className="nav-link" to="/store">Store</Link></li>
            <li><Link className="nav-link" to="/about">About</Link></li>
            <li><Link className="nav-link" to="/contact">Contact</Link></li>
            <li><Link className="nav-link" to="/faq">FAQ</Link></li>
          </ul>
        </nav>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-4">
          <div className="hidden md:flex items-center bg-gray-100 rounded-md px-3 py-1.5 gap-2">
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