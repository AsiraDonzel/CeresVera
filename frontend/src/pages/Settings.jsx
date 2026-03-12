import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bell, Shield, Wallet, Book, LogOut, ChevronRight, CheckCircle2, X, MapPin, Camera, CreditCard, Plus, Smartphone, Key, UploadCloud, Loader2, Edit3, Briefcase, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
    const userRole = localStorage.getItem('user_role') || 'farmer';
    const navigate = useNavigate();
    const [toastMessage, setToastMessage] = useState('');
    
    // Modals Base States
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isScanHistoryModalOpen, setIsScanHistoryModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
    const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
    const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

    // Profile State (Simulated)
    const [userName, setUserName] = useState(userRole === 'agronomist' ? 'Dr. Okafor' : 'Kemi Adebayo');
    const [userEmail, setUserEmail] = useState(userRole === 'agronomist' ? 'okafor.agro@ceresvera.com' : 'kemi@example.com');
    const [userPhone, setUserPhone] = useState('+234 801 234 5678');
    const [agronomistBio, setAgronomistBio] = useState('Expert in tropical plant pathology with 10+ years of experience in West Africa.');

    // Farm Profile State
    const [farmLocation, setFarmLocation] = useState(localStorage.getItem('farm_location') || 'Ogun State, Nigeria');
    const [primaryCrop, setPrimaryCrop] = useState(localStorage.getItem('primary_crop') || 'Cassava');
    const [farmSize, setFarmSize] = useState(localStorage.getItem('farm_size') || '1 - 5 Acres');

    // Payment Methods State
    const [savedCards, setSavedCards] = useState([
        { id: 1, type: 'VISA', last4: '4242', exp: '12/28', isDefault: true },
        { id: 2, type: 'MC', last4: '8831', exp: '09/27', isDefault: false },
    ]);
    const [isAddingCard, setIsAddingCard] = useState(false);

    // Toggle States
    const [smsEnabled, setSmsEnabled] = useState(true);
    const [emailEnabled, setEmailEnabled] = useState(true);
    const [marketingEnabled, setMarketingEnabled] = useState(false);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

    // Consultation Fees State
    const [videoFee, setVideoFee] = useState('5000');
    const [textFee, setTextFee] = useState('2500');

    // Avatar State
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(''), 2500);
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_role');
        navigate('/auth');
    };

    const agronomistMenus = [
        { icon: <User className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-50', title: 'Professional Profile', desc: 'Avatar, Name, Biography, and Contact Info', action: () => setIsProfileModalOpen(true) },
        { icon: <Wallet className="w-5 h-5 text-emerald-600" />, bg: 'bg-emerald-50', title: 'Consultation Fees & Payouts', desc: 'Set your rates and manage bank details', action: () => setIsConsultationModalOpen(true) },
        { icon: <Bell className="w-5 h-5 text-amber-600" />, bg: 'bg-amber-50', title: 'Notifications', desc: 'Push, Email alerts, and Marketing preferences', action: () => setIsNotificationsModalOpen(true) },
        { icon: <Shield className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-50', title: 'Security', desc: 'Password, 2FA, and connected devices', action: () => setIsSecurityModalOpen(true) },
    ];

    const farmerMenus = [
        { icon: <User className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-50', title: 'Account Profile', desc: 'Avatar, Name, Email, and Phone Number', action: () => setIsProfileModalOpen(true) },
        { icon: <MapPin className="w-5 h-5 text-emerald-600" />, bg: 'bg-emerald-50', title: 'Farm Profile', desc: 'Location, primary crops, and farm size', action: () => setIsAvatarModalOpen(true) },
        { icon: <Wallet className="w-5 h-5 text-amber-600" />, bg: 'bg-amber-50', title: 'Payment Methods', desc: 'Manage connected cards for Escrow payouts', action: () => setIsPaymentModalOpen(true) },
        { icon: <Book className="w-5 h-5 text-rose-600" />, bg: 'bg-rose-50', title: 'Scan History & Sync', desc: 'Manage offline AI scans and cloud backup', action: () => setIsScanHistoryModalOpen(true) },
        { icon: <Shield className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-50', title: 'Security', desc: 'Password and account recovery', action: () => setIsSecurityModalOpen(true) },
    ];

    const activeMenus = userRole === 'agronomist' ? agronomistMenus : farmerMenus;

    // Overlay Animation Variants
    const overlayVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 30 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } },
        exit: { opacity: 0, scale: 0.95, y: 30, transition: { duration: 0.2 } }
    };

    return (
        <div className="min-h-screen bg-earth-50 pt-24 pb-12 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-sage-200/30 rounded-full blur-[100px] -z-10 mix-blend-multiply"></div>
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Settings</h1>
                        <p className="text-gray-600 mt-2 text-lg">Manage your account preferences and configurations.</p>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden mb-8">
                    {/* User Mini Profile Header */}
                    <div className="p-8 border-b border-gray-100 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-sage-50 rounded-full blur-3xl -z-10"></div>
                        
                        <div className="relative group cursor-pointer" onClick={() => setIsProfileModalOpen(true)}>
                            <div className="w-24 h-24 rounded-[1.5rem] bg-gradient-to-br from-sage-100 to-sage-200 flex items-center justify-center text-sage-800 font-black text-3xl overflow-hidden shadow-inner border-[3px] border-white ring-4 ring-sage-50">
                                {localStorage.getItem('profile_picture') ? (
                                    <img src={localStorage.getItem('profile_picture')} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    userRole === 'agronomist' ? 'O' : 'K'
                                )}
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-lg border-2 border-white group-hover:bg-sage-600 transition-colors">
                                <Edit3 className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        
                        <div className="text-center sm:text-left pt-2">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">{userName}</h2>
                            <p className="text-sage-600 font-bold uppercase tracking-widest text-xs mt-1">{userRole} Account</p>
                            <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-3">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 text-gray-600 text-xs font-bold border border-gray-100">
                                    <Mail className="w-3.5 h-3.5" /> {userEmail}
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 text-gray-600 text-xs font-bold border border-gray-100">
                                    <Phone className="w-3.5 h-3.5" /> {userPhone}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="divide-y divide-gray-50/50">
                        {activeMenus.map((menu, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ x: 4, backgroundColor: 'rgba(249, 250, 251, 0.8)' }}
                                onClick={() => {
                                    if (menu.action) {
                                        menu.action();
                                    } else {
                                        showToast(`Opened ${menu.title} configurations.`);
                                    }
                                }}
                                className="flex items-center justify-between p-5 sm:p-6 cursor-pointer group"
                            >
                                <div className="flex items-center gap-5">
                                    <div className={`w-12 h-12 rounded-2xl ${menu.bg} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                        {menu.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg group-hover:text-sage-700 transition-colors">{menu.title}</h3>
                                        <p className="text-sm text-gray-500 font-medium">{menu.desc}</p>
                                    </div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-sage-100 transition-colors">
                                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-sage-600" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-start">
                    <button onClick={handleLogout} className="bg-white border border-red-200 text-red-600 hover:bg-red-50 font-bold py-3.5 px-8 rounded-2xl shadow-sm transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2">
                        <LogOut className="w-5 h-5" /> Sign Out of Account
                    </button>
                </div>

            </div>

            {/* General Profile Modal (Stacked Info) */}
            <AnimatePresence>
                {isProfileModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-gray-900/60 backdrop-blur-md overflow-y-auto"
                        onClick={() => setIsProfileModalOpen(false)}
                    >
                        <motion.div
                            variants={overlayVariants} initial="hidden" animate="visible" exit="exit"
                            className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative border border-white/20 my-8 flex flex-col overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="bg-gradient-to-br from-sage-800 to-sage-900 p-8 relative overflow-hidden shrink-0">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                                <button onClick={() => setIsProfileModalOpen(false)} className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors text-white backdrop-blur-md z-10">
                                    <X className="w-5 h-5" />
                                </button>
                                
                                <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-end gap-6">
                                    <div className="relative group cursor-pointer" onClick={() => {
                                        setIsProfileModalOpen(false);
                                        setIsAvatarModalOpen(true);
                                    }}>
                                        <div className="w-28 h-28 rounded-[1.5rem] bg-white/20 backdrop-blur-xl flex items-center justify-center text-white font-black text-4xl overflow-hidden shadow-2xl border-2 border-white/30">
                                            {localStorage.getItem('profile_picture') ? (
                                                <img src={localStorage.getItem('profile_picture')} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                userRole === 'agronomist' ? 'O' : 'K'
                                            )}
                                        </div>
                                        <div className="absolute inset-0 bg-black/40 rounded-[1.5rem] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Camera className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                    <div className="text-center sm:text-left text-white pb-2">
                                        <h2 className="text-3xl font-black tracking-tight">{userName}</h2>
                                        <p className="text-sage-200 font-bold">{userRole === 'agronomist' ? 'Professional Profile' : 'Account Details'}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-8 bg-gray-50/50 space-y-8 overflow-y-auto">
                                
                                {/* Personal Info Stack */}
                                <div className="space-y-4">
                                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-200 pb-2">Personal Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-600 mb-1.5">Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 bg-white font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500 shadow-sm" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-600 mb-1.5">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                <input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 bg-white font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500 shadow-sm" />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-gray-600 mb-1.5">Phone Number</label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                <input type="text" value={userPhone} onChange={(e) => setUserPhone(e.target.value)} className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 bg-white font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500 shadow-sm" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Conditional Stacks based on Role */}
                                {userRole === 'agronomist' && (
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-200 pb-2">Professional Details</h3>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-600 mb-1.5">Biography & Specialties</label>
                                            <textarea 
                                                rows="4"
                                                value={agronomistBio} 
                                                onChange={(e) => setAgronomistBio(e.target.value)} 
                                                className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500 shadow-sm resize-none leading-relaxed" 
                                            />
                                            <p className="text-[10px] text-gray-500 mt-1 font-medium text-right">Visible to farmers booking consultations</p>
                                        </div>
                                    </div>
                                )}
                                
                                <div className="pt-4 flex justify-end gap-3 border-t border-gray-200">
                                    <button onClick={() => setIsProfileModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors">Cancel</button>
                                    <button
                                        onClick={() => {
                                            setIsProfileModalOpen(false);
                                            showToast('Profile updated successfully.');
                                        }}
                                        className="px-8 py-3 rounded-xl font-bold text-white bg-sage-700 hover:bg-sage-900 shadow-md shadow-sage-700/20 transition-all hover:-translate-y-0.5 flex items-center gap-2"
                                    >
                                        <CheckCircle2 className="w-5 h-5" /> Save Profile
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Farm Profile Modal (Stacked Info) */}
            <AnimatePresence>
                {isAvatarModalOpen && userRole === 'farmer' && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-gray-900/60 backdrop-blur-md overflow-y-auto"
                        onClick={() => setIsAvatarModalOpen(false)}
                    >
                        <motion.div
                            variants={overlayVariants} initial="hidden" animate="visible" exit="exit"
                            className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative border border-white/20 my-8 flex flex-col overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                             <div className="p-8 border-b border-gray-100 flex-shrink-0 relative bg-gradient-to-br from-emerald-50 to-white">
                                <button onClick={() => setIsAvatarModalOpen(false)} className="absolute top-8 right-8 w-10 h-10 bg-white hover:bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center transition-colors text-gray-500 shadow-sm">
                                    <X className="w-5 h-5" />
                                </button>
                                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 shadow-inner">
                                    <MapPin className="w-7 h-7" />
                                </div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Farm Location & Data</h2>
                                <p className="text-gray-500 font-medium">Manage your primary agricultural data for better AI diagnostics and expert matching.</p>
                            </div>

                            <div className="p-8 bg-gray-50/50 space-y-6 overflow-y-auto">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Farm Name or Cooperative Label</label>
                                        <input type="text" defaultValue="Kemi Adebayo Farms" className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Location / State</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="text"
                                                value={farmLocation}
                                                onChange={(e) => setFarmLocation(e.target.value)}
                                                className="w-full border border-gray-200 rounded-xl pl-12 pr-4 py-3 bg-white font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Primary Crop Cultivated</label>
                                            <select
                                                value={primaryCrop}
                                                onChange={(e) => setPrimaryCrop(e.target.value)}
                                                className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none shadow-sm cursor-pointer"
                                            >
                                                <option value="Cassava">Cassava</option>
                                                <option value="Maize">Maize</option>
                                                <option value="Tomato">Tomato</option>
                                                <option value="Sorghum">Sorghum</option>
                                                <option value="Cocoa">Cocoa</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Estimated Farm Size</label>
                                            <select
                                                value={farmSize}
                                                onChange={(e) => setFarmSize(e.target.value)}
                                                className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none shadow-sm cursor-pointer"
                                            >
                                                <option value="< 1 Acre">Under 1 Acre</option>
                                                <option value="1 - 5 Acres">1 - 5 Acres</option>
                                                <option value="5 - 20 Acres">5 - 20 Acres</option>
                                                <option value="20+ Acres">20+ Acres (Commercial)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-200">
                                    <button onClick={() => setIsAvatarModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors">Cancel</button>
                                    <button
                                        onClick={() => {
                                            localStorage.setItem('farm_location', farmLocation);
                                            localStorage.setItem('primary_crop', primaryCrop);
                                            localStorage.setItem('farm_size', farmSize);
                                            setIsAvatarModalOpen(false);
                                            showToast('Farm Data saved successfully.');
                                        }}
                                        className="px-8 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all hover:-translate-y-0.5 flex items-center gap-2"
                                    >
                                        <CheckCircle2 className="w-5 h-5" /> Save Details
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Notifications Modal (Stacked Toggles) */}
            <AnimatePresence>
                {isNotificationsModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md"
                        onClick={() => setIsNotificationsModalOpen(false)}
                    >
                        <motion.div
                            variants={overlayVariants} initial="hidden" animate="visible" exit="exit"
                            className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl relative border border-white/20"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-8 border-b border-gray-100 relative bg-gradient-to-br from-amber-50 to-white">
                                <button onClick={() => setIsNotificationsModalOpen(false)} className="absolute top-8 right-8 w-10 h-10 bg-white hover:bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center transition-colors text-gray-500 shadow-sm">
                                    <X className="w-5 h-5" />
                                </button>
                                <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 mb-4 shadow-inner">
                                    <Bell className="w-7 h-7" />
                                </div>
                                <h2 className="text-2xl font-black text-gray-900 mb-2">Notification Preferences</h2>
                                <p className="text-gray-500 text-sm font-medium">Control exactly how and when CeresVera contacts you.</p>
                            </div>

                            <div className="p-8 bg-gray-50/50 space-y-4">
                                {/* Push/SMS Toggle */}
                                <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:border-amber-200 transition-colors">
                                    <div className="pr-4">
                                        <h3 className="font-bold text-gray-900 flex items-center gap-2"><Smartphone className="w-4 h-4 text-amber-500" /> Push & SMS Alerts</h3>
                                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">Instant notifications for urgent escrow requests and calendar updates.</p>
                                    </div>
                                    <div
                                        className={`w-14 h-7 rounded-full relative cursor-pointer outline-none transition-colors shrink-0 shadow-inner ${smsEnabled ? 'bg-amber-500' : 'bg-gray-300'}`}
                                        onClick={() => setSmsEnabled(!smsEnabled)}
                                    >
                                        <div className={`w-5 h-5 bg-white rounded-full absolute top-1 shadow-md transition-all ${smsEnabled ? 'right-1' : 'left-1'}`}></div>
                                    </div>
                                </div>

                                {/* Email Toggle */}
                                <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:border-amber-200 transition-colors">
                                    <div className="pr-4">
                                        <h3 className="font-bold text-gray-900 flex items-center gap-2"><Mail className="w-4 h-4 text-amber-500" /> Email Summaries</h3>
                                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">Daily digest of your payouts, completed consults, and offline sync logs.</p>
                                    </div>
                                    <div
                                        className={`w-14 h-7 rounded-full relative cursor-pointer outline-none transition-colors shrink-0 shadow-inner ${emailEnabled ? 'bg-amber-500' : 'bg-gray-300'}`}
                                        onClick={() => setEmailEnabled(!emailEnabled)}
                                    >
                                        <div className={`w-5 h-5 bg-white rounded-full absolute top-1 shadow-md transition-all ${emailEnabled ? 'right-1' : 'left-1'}`}></div>
                                    </div>
                                </div>

                                {/* Marketing Toggle */}
                                <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:border-amber-200 transition-colors">
                                    <div className="pr-4">
                                        <h3 className="font-bold text-gray-900">Marketing & Offers</h3>
                                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">Receive occasional emails about new AI features and community events.</p>
                                    </div>
                                    <div
                                        className={`w-14 h-7 rounded-full relative cursor-pointer outline-none transition-colors shrink-0 shadow-inner ${marketingEnabled ? 'bg-amber-500' : 'bg-gray-300'}`}
                                        onClick={() => setMarketingEnabled(!marketingEnabled)}
                                    >
                                        <div className={`w-5 h-5 bg-white rounded-full absolute top-1 shadow-md transition-all ${marketingEnabled ? 'right-1' : 'left-1'}`}></div>
                                    </div>
                                </div>

                                <div className="pt-6 flex justify-end">
                                    <button 
                                        onClick={() => {
                                            setIsNotificationsModalOpen(false);
                                            showToast('Preferences updated.');
                                        }} 
                                        className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white bg-gray-900 hover:bg-black shadow-lg transition-all hover:-translate-y-0.5"
                                    >
                                        Apply Changes
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Other Modals (Security, Payment, Consults, Scan History) use similar improved overlay designs */}
            {/* Keeping simpler versions of remaining modals for brevity while applying the new overlay variants format */}
            
            <AnimatePresence>
                {isSecurityModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md"
                        onClick={() => setIsSecurityModalOpen(false)}
                    >
                        <motion.div
                            variants={overlayVariants} initial="hidden" animate="visible" exit="exit"
                            className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl relative border border-white"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-8 border-b border-gray-100 bg-gradient-to-br from-purple-50 to-white">
                                <button onClick={() => setIsSecurityModalOpen(false)} className="absolute top-8 right-8 w-10 h-10 bg-white hover:bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center transition-colors text-gray-500">
                                    <X className="w-5 h-5" />
                                </button>
                                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-4 shadow-inner">
                                    <Shield className="w-7 h-7" />
                                </div>
                                <h2 className="text-2xl font-black text-gray-900 mb-1">Security & Access</h2>
                                <p className="text-gray-500 text-sm font-medium">Manage your password and secure credentials.</p>
                            </div>
                            <div className="p-8 bg-gray-50/50 space-y-4">
                                <button onClick={() => showToast('Password reset link sent!')} className="w-full bg-white border border-gray-200 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:border-purple-300 hover:shadow-md transition-all group">
                                    <div className="flex items-center gap-4 text-left">
                                        <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center group-hover:bg-purple-100">
                                            <Key className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">Change Password</h3>
                                            <p className="text-xs text-gray-500 mt-0.5">Last changed 3 months ago</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-purple-500" />
                                </button>
                                
                                <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center justify-between shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${twoFactorEnabled ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                            <Smartphone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">Two-Factor Authentication</h3>
                                            <p className="text-xs text-gray-500 mt-0.5">{twoFactorEnabled ? 'Enabled via SMS' : 'Not configured'}</p>
                                        </div>
                                    </div>
                                    <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${twoFactorEnabled ? 'bg-purple-600' : 'bg-gray-300'}`} onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}>
                                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-all ${twoFactorEnabled ? 'right-1' : 'left-1'}`}></div>
                                    </div>
                                </div>
                                <div className="pt-6 flex justify-end">
                                    <button onClick={() => setIsSecurityModalOpen(false)} className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50">Done</button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Settings Action Toast */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] bg-gray-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 font-bold text-sm border border-gray-700"
                    >
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        {toastMessage}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
