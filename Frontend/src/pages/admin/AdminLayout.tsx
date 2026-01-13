import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';

// Simple mock auth - in a real app this would be a Context
const checkAuth = () => {
    return localStorage.getItem('adminToken') === 'demo-token';
};

const AdminLayout = () => {
    const navigate = useNavigate();
    const isAuth = checkAuth();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        if (!isAuth) {
            navigate('/admin/login');
        }
    }, [navigate, location, isAuth]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    if (!isAuth) return null;

    const navItems = [
        { label: 'Orders', path: '/admin/orders', icon: <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /> },
        { label: 'Add Product', path: '/admin/add-product', icon: <path d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /> },
        { label: 'Add Project', path: '/admin/add-project', icon: <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /> },
        { label: 'Users', path: '/admin/users', icon: <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /> },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
            {/* Sidebar */}
            <aside
                className={`${isSidebarOpen ? 'w-64' : 'w-20'} duration-300 bg-slate-900 text-white flex flex-col fixed h-full z-20 shadow-xl`}
            >
                <div className="h-16 flex items-center justify-between px-4 border-b border-slate-700/50">
                    {isSidebarOpen && <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">TITEC Admin</span>}
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-800 rounded-lg" aria-label="Toggle sidebar">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                </div>

                <nav className="flex-1 py-6 space-y-2 px-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${location.pathname === item.path
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                                : 'text-gray-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <svg className={`w-6 h-6 ${isSidebarOpen ? 'mr-3' : 'mx-auto'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
                                {item.icon}
                            </svg>
                            <span className={`whitespace-nowrap ${!isSidebarOpen && 'hidden'} transition-opacity`}>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-700/50">
                    <button
                        onClick={handleLogout}
                        className={`flex items-center w-full px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors ${!isSidebarOpen && 'justify-center'}`}
                        aria-label="Logout"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        {isSidebarOpen && <span className="ml-3">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 ${isSidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300 min-h-screen flex flex-col`}>
                <header className="h-16 bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-200 px-8 flex items-center justify-between shadow-sm">
                    <h1 className="text-xl font-semibold text-gray-800 capitalize">
                        {location.pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
                    </h1>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border border-indigo-200">
                            A
                        </div>
                    </div>
                </header>

                <div className="p-8 animate-fade-in-up">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
