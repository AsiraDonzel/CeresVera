import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, User, Menu, X, ArrowRight, Activity, Map, Video, CheckCircle, Shield, AlertTriangle, Sparkles, Cloud } from 'lucide-react';
import OnboardingOverlay from './OnboardingOverlay';

export default function Layout({ children }) {
    const location = useLocation();
    const userRole = localStorage.getItem('user_role') || 'farmer';
    const userName = localStorage.getItem('user_name') || 'User';
    const [profilePic, setProfilePic] = useState(localStorage.getItem('profile_picture'));
    const [showOnboarding, setShowOnboarding] = useState(false);

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

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Hide header/footer on Auth page for a true native app feel
    if (location.pathname === '/auth') {
        return <main className="min-h-screen bg-earth-100">{children}</main>;
    }

    const navLinks = [
        { name: 'Crops', path: '/crops' },
        { name: 'Diseases', path: '/diseases' },
        { name: 'Pests', path: '/pests' },
    ];

    const farmerLinks = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Scan Crop', path: '/scan' },
        { name: 'Weather', path: '/hotspots', icon: <Cloud className="w-4 h-4" /> },
        { name: 'CeraAI', path: '/chat', icon: <Sparkles className="w-4 h-4" />, premium: true },
        { name: 'Expert Marketplace', path: '/consultants' },
        { name: 'Settings', path: '/settings' },
    ];

    const expertLinks = [
        { name: 'Expert Portal', path: '/expert-dashboard' },
        { name: 'Weather', path: '/hotspots', icon: <Cloud className="w-4 h-4" /> },
        { name: 'My Schedule', path: '/schedule' },
        { name: 'Earnings & Payouts', path: '/payouts' },
        { name: 'Settings', path: '/settings' },
    ];

    return (
        <div className="min-h-screen flex flex-col font-sans bg-earth-100 text-gray-800">
            <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-sage-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <Link to="/" className="flex items-center space-x-2 text-sage-900 group">
                            <Leaf className="w-8 h-8 text-sage-700 group-hover:-rotate-12 transition-transform" />
                            <span className="font-bold text-2xl tracking-tight">Ceres<span className="text-sage-500 font-medium">Vera</span></span>
                        </Link>

                        <nav className="hidden md:flex space-x-6 lg:space-x-8 items-center">
                            {navLinks.map(link => (
                                <Link key={link.path} to={link.path} className="text-gray-600 hover:text-sage-700 font-medium transition-colors">{link.name}</Link>
                            ))}

                            {localStorage.getItem('access_token') && (
                                <>
                                    <div className="w-px h-6 bg-gray-200" />
                                    {(userRole === 'farmer' ? farmerLinks : expertLinks).filter(l => !['Settings', 'Expert Portal', 'Dashboard'].includes(l.name)).map(link => (
                                        <Link key={link.path} to={link.path} className={`flex items-center gap-1.5 transition-colors ${link.premium ? 'text-sage-600 hover:text-sage-800 font-bold' : 'text-gray-600 hover:text-sage-700 font-medium'}`}>
                                            {link.icon} {link.name}
                                        </Link>
                                    ))}
                                    <div className="w-px h-6 bg-gray-200" />
                                    <Link to="/settings" className="text-gray-600 hover:text-sage-700 font-medium transition-colors">Settings</Link>
                                </>
                            )}
                        </nav>

                        <div className="flex items-center space-x-4">
                            {localStorage.getItem('access_token') ? (
                                <div className="flex items-center gap-3">
                                    <Link to={userRole === 'farmer' ? "/scan" : "/expert-dashboard"} className="hidden sm:inline-flex bg-sage-700 hover:bg-sage-900 text-white px-5 py-2 rounded-full font-medium transition-all shadow-md shadow-sage-700/20 active:scale-95">
                                        {userRole === 'farmer' ? "Scan Crop" : "Dashboard"}
                                    </Link>

                                    <Link to="/settings" className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white shadow-sm overflow-hidden flex-shrink-0 block transition-transform hover:scale-105 group relative flex items-center justify-center">
                                        {profilePic ? (
                                            <img src={profilePic} alt="User Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-sage-700 font-bold group-hover:text-sage-900 transition-colors capitalize">
                                                {userName.charAt(0)}
                                            </span>
                                        )}
                                        {userRole === 'agronomist' && !profilePic && <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white z-20"></span>}
                                    </Link>
                                    
                                    <button 
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                        className="md:hidden p-2 text-gray-600 hover:text-sage-700 transition-colors"
                                    >
                                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link to="/auth" className="flex items-center gap-2 text-sage-900 font-bold hover:text-sage-700 transition-colors bg-sage-50 hover:bg-sage-100 px-5 py-2 rounded-full border border-sage-200">
                                        <User className="w-4 h-4" /> Sign In
                                    </Link>
                                    <button 
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                        className="md:hidden p-2 text-gray-600 hover:text-sage-700 transition-colors"
                                    >
                                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                <div className={`fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMenuOpen(false)} />
                <div className={`fixed top-0 right-0 w-72 h-full bg-white z-50 shadow-2xl transition-transform duration-300 transform md:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="p-6 h-full flex flex-col">
                        <div className="flex justify-between items-center mb-8">
                            <Link to="/" className="flex items-center space-x-2 text-sage-900" onClick={() => setIsMenuOpen(false)}>
                                <Leaf className="w-6 h-6 text-sage-700" />
                                <span className="font-bold text-xl tracking-tight">Ceres<span className="text-sage-500">Vera</span></span>
                            </Link>
                            <button onClick={() => setIsMenuOpen(false)} className="p-2 text-gray-400">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <nav className="flex-1 space-y-4">
                            {navLinks.map(link => (
                                <Link key={link.path} to={link.path} className="block text-lg font-bold text-gray-900 hover:text-sage-600 py-2 border-b border-gray-50" onClick={() => setIsMenuOpen(false)}>
                                    {link.name}
                                </Link>
                            ))}
                            {localStorage.getItem('access_token') && (
                                <div className="pt-4 space-y-4">
                                    <div className="text-[10px] uppercase font-black tracking-widest text-gray-400">Personal Menu</div>
                                    {(userRole === 'farmer' ? farmerLinks : expertLinks).map(link => (
                                        <Link key={link.path} to={link.path} className="flex items-center gap-3 text-lg font-bold text-gray-900 hover:text-sage-600 py-2" onClick={() => setIsMenuOpen(false)}>
                                            <span className="p-2 bg-gray-50 rounded-xl">{link.icon || <Activity className="w-4 h-4" />}</span>
                                            {link.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </nav>
                        
                        {!localStorage.getItem('access_token') && (
                            <Link to="/auth" className="w-full bg-sage-700 text-white py-4 rounded-2xl font-black text-center shadow-lg shadow-sage-700/20 flex items-center justify-center gap-2" onClick={() => setIsMenuOpen(false)}>
                                <User className="w-5 h-5" /> Sign In
                            </Link>
                        )}
                        
                        <div className="pt-8 border-t border-gray-100 flex items-center gap-3">
                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Truth of the Harvest</div>
                        </div>
                    </div>
                </div>
            </header>

            {showOnboarding && <OnboardingOverlay onClose={() => setShowOnboarding(false)} />}
            
            <main className="flex-grow w-full">
                {children}
            </main>

            <footer className="bg-[#1C1F1D] text-earth-100 pt-16 pb-8 border-t border-earth-700 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b border-gray-800 pb-12">
                        <div className="space-y-4 md:col-span-2">
                            <div className="flex items-center space-x-2">
                                <Leaf className="w-6 h-6 text-earth-300" />
                                <span className="font-bold text-xl tracking-tight text-white">Ceres<span className="text-sage-500 font-medium">Vera</span></span>
                            </div>
                            <p className="text-earth-300 text-sm max-w-sm leading-relaxed">
                                The Truth of the Harvest. Empowering global agriculture with intelligent disease detection and expert agronomy guidance to ensure sustainable futures.
                            </p>
                            <div className="flex space-x-4 pt-4">
                                {/* Social Mocks */}
                                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-sage-700 hover:text-white transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-sage-700 hover:text-white transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-sage-700 hover:text-white transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-sage-700 hover:text-white transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
                                </a>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4">Organization</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                                <li><Link to="/blog" className="hover:text-white transition-colors">Blog & Research</Link></li>
                                <li><Link to="/donate" className="hover:text-white transition-colors">Donate Now</Link></li>
                                <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4">For Farmers</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link to="/scan" className="hover:text-white transition-colors">AI Crop Scanner</Link></li>
                                <li><Link to="/crops" className="hover:text-white transition-colors">Crop Database</Link></li>
                                <li><Link to="/pests" className="hover:text-white transition-colors">Pest Index</Link></li>
                                <li><Link to="/consultants" className="hover:text-white transition-colors">Find an Expert</Link></li>
                                <li><Link to="/hotspots" className="hover:text-white transition-colors">Weather & Climate</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                        <p>© {new Date().getFullYear()} CeresVera. All rights reserved.</p>
                        <div className="flex space-x-4 mt-4 md:mt-0">
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-white transition-colors">Cookie Settings</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
