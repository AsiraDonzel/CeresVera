import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Leaf, User, Menu, X, ArrowRight, Activity, Map, Video,
    CheckCircle, Shield, AlertTriangle, Sparkles, Cloud,
    LayoutDashboard, Briefcase, DollarSign, Users, Settings,
    HelpCircle, Bell, Search, LogOut, ChevronDown, Monitor,
    Star, ArrowUpRight, MessageSquare, ShieldAlert, Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import OnboardingWizard from './OnboardingWizard';

export default function Layout({ children }) {
    const location = useLocation();
    const userRole = localStorage.getItem('user_role') || 'farmer';
    const userName = localStorage.getItem('user_name') || 'User';
    const [profilePic, setProfilePic] = useState(localStorage.getItem('profile_picture'));
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    const [notifications, setNotifications] = useState([
        { id: 1, title: 'New Request', desc: 'Kemi Adebayo booked a consult.', time: '2m ago' },
        { id: 2, title: 'Payout Alert', desc: '₦45,200 settled to bank.', time: '1h ago' },
    ]);

    useEffect(() => {
        if (localStorage.getItem('show_onboarding') === 'true') {
            setShowOnboarding(true);
        }
    }, [location]);

    useEffect(() => {
        const handleProfileUpdate = () => {
            setProfilePic(localStorage.getItem('profile_picture'));
        };
        window.addEventListener('profilePictureUpdated', handleProfileUpdate);
        return () => window.removeEventListener('profilePictureUpdated', handleProfileUpdate);
    }, []);

    const dashboardRoutes = [
        '/dashboard', '/expert-dashboard', '/scan', '/hotspots',
        '/chat', '/consultants', '/settings', '/schedule',
        '/payouts', '/expert-circles', '/predictive-analytics', '/profile',
        '/farmer-requests' // Added to dashboard routes
    ];
    const isDashboardPage = dashboardRoutes.some(route => location.pathname === route);

    const navLinks = [
        { name: 'Crops', path: '/crops' },
        { name: 'Diseases', path: '/diseases' },
        { name: 'Pests', path: '/pests' },
    ];

    const farmerSidebarItems = [
        { name: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/dashboard' },
        { name: 'Scan Crop', icon: <Activity className="w-5 h-5" />, path: '/scan' },
        { name: 'Farm Weather', icon: <Cloud className="w-5 h-5" />, path: '/hotspots' },
        { name: 'Cera AI', icon: <Sparkles className="w-5 h-5" />, path: '/chat' },
        { name: 'Consultants', icon: <Users className="w-5 h-5" />, path: '/consultants' },
        { name: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/settings' },
    ];

    const expertSidebarItems = [
        { name: 'Expert Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/expert-dashboard' },
        { name: 'Farmer Requests', icon: <Briefcase className="w-5 h-5" />, path: '/farmer-requests' },
        { name: 'My Schedule', icon: <Calendar className="w-5 h-5" />, path: '/schedule' },
        { name: 'Wallet & Payouts', icon: <DollarSign className="w-5 h-5" />, path: '/payouts' },
        { name: 'Expert Circles', icon: <MessageSquare className="w-5 h-5" />, path: '/expert-circles' },
        { name: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/settings' },
    ];

    const sidebarItems = userRole === 'farmer' ? farmerSidebarItems : expertSidebarItems;

    // Theme Colors aligned to Forest Green (#1B4332) and Harvest Gold (#D4A373)
    const themeColor = userRole === 'farmer' ? 'forest' : 'harvest';
    const themeBg = userRole === 'farmer' ? 'bg-forest-500' : 'bg-harvest-500';
    const themeShadow = userRole === 'farmer' ? 'shadow-forest-500/20' : 'shadow-harvest-500/20';
    const themeHoverText = userRole === 'farmer' ? 'hover:text-forest-700' : 'hover:text-harvest-700';
    const themeHoverBg = userRole === 'farmer' ? 'hover:bg-forest-50' : 'hover:bg-harvest-50';

    if (location.pathname === '/auth') {
        return <main className="min-h-screen bg-earth-100">{children}</main>;
    }

    if (isDashboardPage) {
        return (
            <div className={`flex min-h-screen bg-${themeColor}-50 font-sans selection:bg-${themeColor}-100 selection:text-${themeColor}-900`}>
                <aside className={`w-64 bg-white border-r border-${themeColor}-100 flex flex-col hidden lg:flex shrink-0 sticky top-0 h-screen`}>
                    <div className="p-8">
                        <Link to="/" className="flex items-center space-x-2 text-forest-900 group">
                            <Leaf className="w-8 h-8 text-forest-700 group-hover:-rotate-12 transition-transform" />
                            <span className="font-bold text-2xl tracking-tight">Ceres<span className="text-forest-500 font-medium">Vera</span></span>
                        </Link>
                    </div>

                    <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
                        {sidebarItems.map(item => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${location.pathname === item.path ? `${themeBg} text-white shadow-lg ${themeShadow}` : `text-gray-400 ${themeHoverText} ${themeHoverBg}`}`}
                            >
                                {item.icon}
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="p-4 mt-auto border-t border-gray-50">
                        <Link to="/faq" className={`w-full flex items-center gap-3 px-4 py-3 text-gray-400 ${themeHoverText} ${themeHoverBg} rounded-xl font-bold transition-colors`}>
                            <HelpCircle className="w-5 h-5" /> Help & Support
                        </Link>
                    </div>
                </aside>

                <div className="flex-1 flex flex-col min-w-0">
                    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-50 flex items-center justify-between px-8 shrink-0 sticky top-0 z-30">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setIsMenuOpen(true)} className="p-2 text-gray-600 lg:hidden">
                                <Menu className="w-6 h-6" />
                            </button>
                            <h1 className="text-xl font-black text-gray-900 tracking-tight">
                                {sidebarItems.find(item => item.path === location.pathname)?.name || 'CeresVera'}
                            </h1>
                        </div>

                        {/* Search Bar Removed for Experts per refinement */}


                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <button 
                                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                    className={`p-2.5 text-gray-400 hover:text-${themeColor}-700 ${themeHoverBg} rounded-xl transition-all relative`}
                                >
                                    <Bell className="w-5 h-5" />
                                    {notifications.length > 0 && (
                                        <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-rose-500 border-2 border-white rounded-full"></span>
                                    )}
                                </button>
                                
                                <AnimatePresence>
                                    {isNotificationsOpen && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-3 w-80 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[60] overflow-hidden"
                                        >
                                            <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                                                <span className="font-black text-xs uppercase tracking-widest text-gray-900">Recent Alerts</span>
                                                <button 
                                                    onClick={() => setNotifications([])} 
                                                    className="text-[10px] font-bold text-forest-600 uppercase hover:text-forest-800 transition-colors"
                                                >
                                                    Clear
                                                </button>
                                            </div>
                                            <div className="divide-y divide-gray-50 max-h-96 overflow-y-auto">
                                                {notifications.length > 0 ? (
                                                    notifications.map((note) => (
                                                        <div key={note.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                                                            <h4 className="text-sm font-bold text-gray-900">{note.title}</h4>
                                                            <p className="text-xs text-gray-500 mt-1 font-medium">{note.desc}</p>
                                                            <span className="text-[10px] text-gray-400 font-bold mt-2 inline-block lowercase tracking-tight">{note.time}</span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="p-8 text-center bg-white">
                                                        <div className="w-12 h-12 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-3">
                                                            <Bell className="w-5 h-5" />
                                                        </div>
                                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No new alerts</p>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            <Link to="/settings" className={`w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:scale-105 transition-transform`}>
                                {profilePic ? (
                                    <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-800 font-bold">
                                        {userName.charAt(0)}
                                    </div>
                                )}
                            </Link>
                        </div>
                    </header>

                    <main className={`flex-1 overflow-y-auto bg-${themeColor}-50/50 flex flex-col`}>
                        <div className="p-8 flex-grow">
                            {children}
                        </div>

                        <footer className={`px-8 py-6 border-t border-${themeColor}-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest`}>
                            <div className="flex items-center gap-2">
                                <Leaf className={`w-4 h-4 text-${themeColor}-600`} />
                                <span>CeresVera Platform v2.0</span>
                            </div>
                            <div className="flex items-center gap-6">
                                <Link to="/about" className={themeHoverText}>Our Mission</Link>
                                <Link to="/contact" className={themeHoverText}>Direct Support</Link>
                                <span>© 2026 CeresVera Stewardship</span>
                            </div>
                        </footer>
                    </main>
                </div>

                <AnimatePresence>
                    {isMenuOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                onClick={() => setIsMenuOpen(false)}
                                className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 lg:hidden"
                            />
                            <motion.aside
                                initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="fixed top-0 left-0 bottom-0 w-72 bg-white z-50 p-6 flex flex-col lg:hidden shadow-2xl"
                            >
                                <div className="flex justify-between items-center mb-8">
                                    <Link to="/" className={`flex items-center space-x-2 text-${themeColor}-900`}>
                                        <Leaf className={`w-7 h-7 text-${themeColor}-700`} />
                                        <span className="font-bold text-xl tracking-tight">Ceres<span className={`text-${themeColor}-500`}>Vera</span></span>
                                    </Link>
                                    <button onClick={() => setIsMenuOpen(false)} className="p-2 text-gray-400">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                                <nav className="flex-1 space-y-2">
                                    {sidebarItems.map(item => (
                                        <Link
                                            key={item.name}
                                            to={item.path}
                                            onClick={() => setIsMenuOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${location.pathname === item.path ? `${themeBg} text-white shadow-lg` : `text-gray-400 ${themeHoverText}`}`}
                                        >
                                            {item.icon}
                                            {item.name}
                                        </Link>
                                    ))}
                                </nav>
                            </motion.aside>
                        </>
                    )}
                </AnimatePresence>

                {showOnboarding && <OnboardingWizard onClose={() => setShowOnboarding(false)} />}
            </div>
        );
    }

    return (
        <div className={`min-h-screen flex flex-col font-sans bg-${themeColor}-50 text-gray-800 selection:bg-${themeColor}-100 selection:text-${themeColor}-900`}>
            <header className={`bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-${themeColor}-100`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <Link to="/" className="flex items-center space-x-2 text-sage-900 group">
                            <Leaf className="w-8 h-8 text-sage-700 group-hover:-rotate-12 transition-transform" />
                            <span className="font-bold text-2xl tracking-tight">Ceres<span className="text-sage-500 font-medium">Vera</span></span>
                        </Link>

                        <nav className="hidden md:flex space-x-6 items-center">
                            {navLinks.map(link => (
                                <Link key={link.path} to={link.path} className="text-gray-600 hover:text-forest-700 font-bold transition-colors">{link.name}</Link>
                            ))}
                            <div className="w-px h-6 bg-gray-200 mx-2" />
                            <div className="flex items-center gap-4">
                                <Link to={userRole === 'farmer' ? '/dashboard' : '/expert-dashboard'} className="text-gray-600 hover:text-forest-700 font-bold">Dashboard</Link>
                            </div>
                        </nav>

                        <div className="flex items-center space-x-4">
                            {localStorage.getItem('access_token') ? (
                                <div className="flex items-center gap-3">
                                    <Link to="/settings" className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden flex-shrink-0 hover:scale-105 transition-transform bg-sage-50 flex items-center justify-center">
                                        {profilePic ? (
                                            <img src={profilePic} alt="User" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-sage-700 font-bold capitalize">{userName.charAt(0)}</span>
                                        )}
                                    </Link>
                                    <button onClick={() => setIsMenuOpen(true)} className="md:hidden p-2 text-gray-600">
                                        <Menu className="w-6 h-6" />
                                    </button>
                                </div>
                            ) : (
                                <Link to="/auth" className="bg-sage-700 hover:bg-sage-900 text-white px-6 py-2 rounded-full font-bold transition-all shadow-md">Sign In</Link>
                            )}
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {isMenuOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                onClick={() => setIsMenuOpen(false)}
                                className="fixed inset-0 bg-gray-900/40 z-40 md:hidden"
                            />
                            <motion.div
                                initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                                className="fixed top-0 right-0 bottom-0 w-72 bg-white z-50 p-6 md:hidden shadow-2xl"
                            >
                                <div className="flex justify-between items-center mb-8">
                                    <span className="font-bold text-xl">Menu</span>
                                    <button onClick={() => setIsMenuOpen(false)}><X className="w-6 h-6 text-gray-400" /></button>
                                </div>
                                <nav className="space-y-4">
                                    {navLinks.map(link => (
                                        <Link key={link.path} to={link.path} onClick={() => setIsMenuOpen(false)} className="block text-lg font-bold text-gray-900">{link.name}</Link>
                                    ))}
                                    <Link to="/settings" onClick={() => setIsMenuOpen(false)} className="block text-lg font-bold text-gray-900 border-t border-gray-100 pt-4">Profile & Settings</Link>
                                </nav>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </header>

            {showOnboarding && <OnboardingWizard onClose={() => setShowOnboarding(false)} />}

            <main className="flex-grow">
                {children}
            </main>

            <footer className="bg-gray-900 text-earth-100 pt-16 pb-8 border-t border-earth-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b border-gray-800 pb-12">
                        <div className="space-y-4 md:col-span-2">
                            <div className="flex items-center space-x-2">
                                <Leaf className="w-6 h-6 text-earth-300" />
                                <span className="font-bold text-xl tracking-tight text-white">Ceres<span className="text-sage-500 font-medium">Vera</span></span>
                            </div>
                            <p className="text-earth-300 text-sm max-w-sm leading-relaxed">
                                The Truth of the Harvest. Empowering global agriculture with intelligent disease detection and expert agronomy guidance.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link to="/crops" className="hover:text-white transition-colors">Crops</Link></li>
                                <li><Link to="/diseases" className="hover:text-white transition-colors">Diseases</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4">Support</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                                <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                                <li><Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="text-center text-xs text-gray-500">
                        <p>© {new Date().getFullYear()} CeresVera. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
