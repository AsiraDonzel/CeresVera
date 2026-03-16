import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Menu, X, LayoutDashboard, Database, Users, Cloud,
    Sparkles, Settings, Search, Bell, HelpCircle, LogOut,
    ChevronRight, ChevronDown, Monitor, Star, Droplets,
    Wind, Thermometer, MapPin, ExternalLink, Mail, Phone,
    CheckCircle2, Camera, Leaf, Activity, Briefcase, Calendar,
    DollarSign, MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import OnboardingWizard from './OnboardingWizard';
import ThemeToggle from "./ThemeToggle";

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
        '/farmer-requests', '/messaging'
    ];
    const isDashboardPage = dashboardRoutes.some(route => location.pathname === route);

    const isLoggedIn = !!localStorage.getItem('access_token');
    const navLinks = [
        { name: 'Crops', path: '/crops' },
        { name: 'Diseases', path: '/diseases' },
        { name: 'Pests', path: '/pests' },
        ...(!isLoggedIn ? [
            { name: 'About Us', path: '/about' },
            { name: 'Donate', path: '/donate' },
            { name: 'Contact Us', path: '/contact' }
        ] : []),
    ];

    const farmerSidebarItems = [
        { name: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/dashboard' },
        { name: 'Scan Crop', icon: <Activity className="w-5 h-5" />, path: '/scan' },
        { name: 'Farm Weather', icon: <Cloud className="w-5 h-5" />, path: '/hotspots' },
        { name: 'Cera AI', icon: <Sparkles className="w-5 h-5" />, path: '/chat' },
        { name: 'Consultants', icon: <Users className="w-5 h-5" />, path: '/consultants' },
        { name: 'Live Chat', icon: <MessageSquare className="w-5 h-5" />, path: '/messaging' },
        { name: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/settings' },
    ];

    const expertSidebarItems = [
        { name: 'Expert Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/expert-dashboard' },
        { name: 'Farmer Requests', icon: <Briefcase className="w-5 h-5" />, path: '/farmer-requests' },
        { name: 'My Schedule', icon: <Calendar className="w-5 h-5" />, path: '/schedule' },
        { name: 'Wallet & Payouts', icon: <DollarSign className="w-5 h-5" />, path: '/payouts' },
        { name: 'Expert Circles', icon: <MessageSquare className="w-5 h-5" />, path: '/expert-circles' },
        { name: 'Live Chat', icon: <MessageSquare className="w-5 h-5" />, path: '/messaging' },
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
        return <main className="min-h-screen bg-earth-100 dark:bg-[#09090b]">{children}</main>;
    }

    if (isDashboardPage) {
        return (
            <div className={`flex min-h-screen bg-app-bg dark:bg-[#09090b] font-sans selection:bg-${themeColor}-100 selection:text-${themeColor}-900`}>
                <aside className={`w-64 bg-app-card dark:bg-[#121214] border-r border-app-border dark:border-[#27272a] flex flex-col hidden lg:flex shrink-0 sticky top-0 h-screen`}>
                    <div className="p-8">
                        <Link to="/" className="flex items-center space-x-2 text-app-text group">
                            <Leaf className="w-8 h-8 text-sage-700 group-hover:-rotate-12 transition-transform" />
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
                    <header className="h-20 bg-app-bg/80 backdrop-blur-md border-b border-app-border flex items-center justify-between px-8 shrink-0 sticky top-0 z-30">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setIsMenuOpen(true)} className="p-2 text-app-text-muted lg:hidden">
                                <Menu className="w-6 h-6" />
                            </button>
                            <h1 className="text-xl font-black text-app-text tracking-tight">
                                {sidebarItems.find(item => item.path === location.pathname)?.name || 'CeresVera'}
                            </h1>
                        </div>

                        <div className="flex items-center gap-4">
                            <ThemeToggle />
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
                                            className="absolute right-0 mt-3 w-80 bg-app-card border border-app-border rounded-2xl shadow-2xl z-[60] overflow-hidden"
                                        >
                                            <div className="p-4 border-b border-app-border flex justify-between items-center bg-app-subtle">
                                                <span className="font-black text-xs uppercase tracking-widest text-app-text">Recent Alerts</span>
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

                    <main className={`flex-1 overflow-y-auto bg-app-subtle flex flex-col`}>
                        <div className="p-8 flex-grow">
                            {children}
                        </div>

                        <footer className={`px-8 py-6 border-t border-app-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-app-text-muted uppercase tracking-widest`}>
                            <div className="flex items-center gap-2">
                                <Leaf className={`w-4 h-4 text-${themeColor}-600`} />
                                <span>CeresVera Platform</span>
                            </div>
                            <div className="flex items-center gap-6">
                                <a href="/contact" className={`hover:text-${themeColor}-600 transition-colors cursor-pointer`}>Direct Support</a>
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
                                className="fixed top-0 left-0 bottom-0 w-72 bg-app-bg z-50 p-6 flex flex-col lg:hidden shadow-2xl border-r border-app-border"
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
        <div className={`min-h-screen flex flex-col font-sans bg-app-bg dark:bg-[#09090b] text-app-text dark:text-gray-50 selection:bg-${themeColor}-100 selection:text-${themeColor}-900`}>
            <header className={`bg-app-bg/80 dark:bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-app-border dark:border-[#27272a]`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <Link to="/" className="flex items-center space-x-2 text-sage-900 group shrink-0">
                            <Leaf className="w-6 h-6 sm:w-8 sm:h-8 text-sage-700 group-hover:-rotate-12 transition-transform" />
                            <span className="font-bold text-lg sm:text-2xl tracking-tight">Ceres<span className="text-sage-500 font-medium">Vera</span></span>
                        </Link>

                        <nav className="hidden lg:flex space-x-6 items-center">
                            {navLinks.map(link => (
                                <Link key={link.path} to={link.path} className="text-app-text-muted hover:text-sage-700 font-bold transition-colors">{link.name}</Link>
                            ))}
                            {localStorage.getItem('access_token') && (
                                <>
                                    <div className="w-px h-6 bg-gray-200 mx-2" />
                                    <div className="flex items-center gap-4">
                                        <Link to={userRole === 'farmer' ? '/dashboard' : '/expert-dashboard'} className="text-gray-600 hover:text-forest-700 font-bold">Dashboard</Link>
                                    </div>
                                </>
                            )}
                        </nav>

                        <div className="flex items-center gap-2 sm:gap-6">
                            <ThemeToggle />
                            {localStorage.getItem('access_token') ? (
                                <div className="flex items-center gap-3">
                                    <Link to="/settings" className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden flex-shrink-0 hover:scale-105 transition-transform bg-sage-50 flex items-center justify-center">
                                        {profilePic ? (
                                            <img src={profilePic} alt="User" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-sage-700 font-bold capitalize">{userName.charAt(0)}</span>
                                        )}
                                    </Link>
                                    <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-2 text-gray-600">
                                        <Menu className="w-6 h-6" />
                                    </button>
                                </div>
                            ) : (
                                 <Link to="/auth" className="bg-sage-700 hover:bg-sage-900 text-white px-4 sm:px-6 py-2 rounded-full font-bold transition-all shadow-md text-sm sm:text-base">Sign In</Link>
                            )}
                        </div>
                    </div>
                </div>

            </header>
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[60] lg:hidden"
                        />
                        <motion.div
                            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-72 bg-app-bg z-[70] p-6 lg:hidden shadow-2xl border-l border-app-border"
                        >
                            <div className="flex justify-between items-center mb-8 text-app-text">
                                <span className="font-bold text-xl tracking-tight">Ceres<span className="text-forest-500 font-medium">Vera</span></span>
                                <button onClick={() => setIsMenuOpen(false)} className="p-2 -mr-2 text-app-text-muted hover:text-app-text transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <nav className="space-y-2">
                                {navLinks.map(link => (
                                    <Link 
                                        key={link.path} 
                                        to={link.path} 
                                        onClick={() => setIsMenuOpen(false)} 
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${location.pathname === link.path ? 'bg-app-accent-subtle text-forest-700' : 'text-app-text-muted hover:bg-app-subtle hover:text-app-text'}`}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                                <div className="pt-4 mt-4 border-t border-app-border">
                                    <Link 
                                        to="/settings" 
                                        onClick={() => setIsMenuOpen(false)} 
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${location.pathname === '/settings' ? 'bg-app-accent-subtle text-forest-700' : 'text-app-text-muted hover:bg-app-subtle hover:text-app-text'}`}
                                    >
                                        <Settings className="w-5 h-5" /> Profile & Settings
                                    </Link>
                                    <Link 
                                        to={userRole === 'farmer' ? '/dashboard' : '/expert-dashboard'}
                                        onClick={() => setIsMenuOpen(false)} 
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-app-text-muted hover:bg-app-subtle hover:text-app-text transition-all"
                                    >
                                        <LayoutDashboard className="w-5 h-5" /> Dashboard
                                    </Link>
                                </div>
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

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
                                <li><Link to="/pests" className="hover:text-white transition-colors">Pests</Link></li>
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
