import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bell, Shield, Wallet, Book, LogOut, ChevronRight, CheckCircle2, X, MapPin, Camera, CreditCard, Plus, Smartphone, Key, UploadCloud, Loader2, Edit3, Briefcase, Mail, Phone, Cloud, History, Lock, Search, Linkedin, Sparkles, Activity, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ExpertPremiumPaymentOverlay from '../components/ExpertPremiumPaymentOverlay';
import { cropsData } from '../data/crops';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

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
    const [isFarmProfileModalOpen, setIsFarmProfileModalOpen] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [contactPasswordVerified, setContactPasswordVerified] = useState(false);
    const [contactPassword, setContactPassword] = useState('');
    const [contactPasswordError, setContactPasswordError] = useState('');
    const [contactVerifying, setContactVerifying] = useState(false);
    const [isPremium, setIsPremium] = useState(localStorage.getItem('is_premium') === 'true');
    const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);

    useEffect(() => {
        const handlePremiumUpdate = () => {
            setIsPremium(localStorage.getItem('is_premium') === 'true');
        };
        window.addEventListener('premiumStatusChanged', handlePremiumUpdate);
        return () => window.removeEventListener('premiumStatusChanged', handlePremiumUpdate);
    }, []);

    useEffect(() => {
        const anyModalOpen = isProfileModalOpen || isScanHistoryModalOpen || isPaymentModalOpen || isSecurityModalOpen || isConsultationModalOpen || isNotificationsModalOpen || isAvatarModalOpen || isFarmProfileModalOpen || isContactModalOpen || isUpgradeOpen;
        if (anyModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isProfileModalOpen, isScanHistoryModalOpen, isPaymentModalOpen, isSecurityModalOpen, isConsultationModalOpen, isNotificationsModalOpen, isAvatarModalOpen, isFarmProfileModalOpen, isContactModalOpen]);

    // Profile State (Synced from Auth)
    const [userName, setUserName] = useState(localStorage.getItem('user_name') || 'User');
    const [userEmail, setUserEmail] = useState(localStorage.getItem('user_email') || 'test.user@gmail.com');
    const [userPhone, setUserPhone] = useState(localStorage.getItem('user_phone') || '+234 803 123 4567');
    const [userDob, setUserDob] = useState(localStorage.getItem('user_dob') || '');
    const [userStateLoc, setUserStateLoc] = useState(localStorage.getItem('user_state') || '');
    const [userNationality, setUserNationality] = useState(localStorage.getItem('user_nationality') || 'Nigerian');
    const [agronomistBio, setAgronomistBio] = useState(localStorage.getItem('agronomistBio') || 'Expert in tropical plant pathology with 10+ years of experience in West Africa.');
    const [experienceYears, setExperienceYears] = useState(localStorage.getItem('experience_years') || '12');

    // Farm Profile State
    const [farmName, setFarmName] = useState(localStorage.getItem('farm_name') || '');
    const [farmAddress, setFarmAddress] = useState(localStorage.getItem('address_line') || '');
    const [farmState, setFarmState] = useState(localStorage.getItem('state') || localStorage.getItem('farm_location') || 'Ogun State');
    const [farmCountry, setFarmCountry] = useState(localStorage.getItem('country') || 'Nigeria');
    const [primaryCrop, setPrimaryCrop] = useState(() => {
        const saved = localStorage.getItem('primary_crop') || '';
        return saved ? saved.split(',').map(s => s.trim()).filter(Boolean) : [];
    });
    const [customCrop, setCustomCrop] = useState(localStorage.getItem('custom_crop') || '');
    const [farmSize, setFarmSize] = useState(localStorage.getItem('farm_size') || '');

    // Expert Specific
    const [certificates, setCertificates] = useState(localStorage.getItem('certificates') || null);
    const [certPreview, setCertPreview] = useState(localStorage.getItem('certificates') || null);

    // Flatten cropsData for easier searching
    const allCrops = Object.values(cropsData).flat().sort((a, b) => a.name.localeCompare(b.name));
    const [cropSearch, setCropSearch] = useState('');

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
    const [videoFee, setVideoFee] = useState(localStorage.getItem('videoFee') || '5000');
    const [textFee, setTextFee] = useState(localStorage.getItem('textFee') || '2500');

    // Avatar State
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(''), 2500);
    };

    const updateProfileOnBackend = async (data) => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.post(`${API_URL}/api/auth/profile/`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error("Profile update failed:", error);
            throw error;
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/auth');
    };

    const agronomistMenus = [
        { icon: <User className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-50', title: 'Professional Profile', desc: 'Avatar, Name, Biography, and Credentials', action: () => setIsProfileModalOpen(true) },
        { icon: <Lock className="w-5 h-5 text-rose-600" />, bg: 'bg-rose-50', title: 'Contact Information', desc: 'Email and Phone (password required)', action: () => { setContactPasswordVerified(false); setContactPassword(''); setContactPasswordError(''); setIsContactModalOpen(true); } },
        ...(!isPremium ? [{ icon: <Award className="w-5 h-5 text-harvest-600" />, bg: 'bg-harvest-50', title: 'Upgrade to Veritas Premium', desc: 'Unlock Gold status, lower fees, and priority listing', action: () => setIsUpgradeOpen(true) }] : []),
        { icon: <Wallet className="w-5 h-5 text-emerald-600" />, bg: 'bg-emerald-50', title: 'Consultation Fees & Payouts', desc: 'Set your rates and manage bank details', action: () => setIsConsultationModalOpen(true) },
        { icon: <Bell className="w-5 h-5 text-amber-600" />, bg: 'bg-amber-50', title: 'Notifications', desc: 'Push, Email alerts, and Marketing preferences', action: () => setIsNotificationsModalOpen(true) },
        { icon: <Shield className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-50', title: 'Security', desc: 'Password, 2FA, and connected devices', action: () => setIsSecurityModalOpen(true) },
    ];

    const farmerMenus = [
        { icon: <User className="w-5 h-5 text-forest-600" />, bg: 'bg-forest-50', title: 'Account Profile', desc: 'Avatar and Name', action: () => setIsProfileModalOpen(true) },
        { icon: <Lock className="w-5 h-5 text-rose-600" />, bg: 'bg-rose-50', title: 'Contact Information', desc: 'Email and Phone (password required)', action: () => { setContactPasswordVerified(false); setContactPassword(''); setContactPasswordError(''); setIsContactModalOpen(true); } },
        { icon: <MapPin className="w-5 h-5 text-forest-500" />, bg: 'bg-forest-50', title: 'Farm Profile', desc: 'Location, primary crops, and farm size', action: () => setIsFarmProfileModalOpen(true) },
        { icon: <Wallet className="w-5 h-5 text-harvest-600" />, bg: 'bg-harvest-50', title: 'Payment Methods', desc: 'Manage connected cards for Escrow payouts', action: () => setIsPaymentModalOpen(true) },
        { icon: <Book className="w-5 h-5 text-forest-600" />, bg: 'bg-forest-50', title: 'Scan History & Sync', desc: 'Manage offline AI scans and cloud backup', action: () => setIsScanHistoryModalOpen(true) },
        { icon: <Shield className="w-5 h-5 text-harvest-700" />, bg: 'bg-harvest-50', title: 'Security', desc: 'Password and account recovery', action: () => setIsSecurityModalOpen(true) },
    ];

    const activeMenus = userRole === 'agronomist' ? agronomistMenus : farmerMenus;

    // Overlay Animation Variants (Fullscreen Slide-up)
    const overlayVariants = {
        hidden: { opacity: 0, y: '100%' },
        visible: { 
            opacity: 1, 
            y: 0, 
            transition: { 
                type: 'spring', 
                damping: 30, 
                stiffness: 200,
                mass: 0.8
            } 
        },
        exit: { 
            opacity: 0, 
            y: '100%', 
            transition: { 
                duration: 0.3, 
                ease: 'easeInOut' 
            } 
        }
    };

    return (
        <>
        <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 bg-earth-50 min-h-full">
            <ExpertPremiumPaymentOverlay 
                isOpen={isUpgradeOpen} 
                onClose={() => setIsUpgradeOpen(false)} 
            />
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-sage-200/20 rounded-full blur-[100px] -z-10 mix-blend-multiply"></div>

                <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden mb-8">
                    {/* User Mini Profile Header */}
                    <div className="p-8 border-b border-gray-100 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-sage-50 rounded-full blur-3xl -z-10"></div>
                        
                        <div className="relative group cursor-pointer" onClick={() => setIsProfileModalOpen(true)}>
                            <div className="w-24 h-24 rounded-[1.5rem] bg-gradient-to-br from-sage-100 to-sage-200 flex items-center justify-center text-sage-800 font-black text-3xl overflow-hidden shadow-inner border-[3px] border-white ring-4 ring-sage-50">
                                {localStorage.getItem('profile_picture') ? (
                                    <img src={localStorage.getItem('profile_picture')} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    userName.charAt(0)
                                )}
                            </div>
                            <button 
                                onClick={(e) => { e.stopPropagation(); setIsProfileModalOpen(true); }}
                                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-lg border-2 border-white hover:bg-sage-600 transition-colors z-10"
                            >
                                <Edit3 className="w-4 h-4" />
                            </button>
                        </div>
                        
                        <div className="text-center sm:text-left pt-2">
                            <div className="flex flex-col sm:flex-row items-center gap-3">
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">{userName}</h2>
                                {userRole === 'agronomist' && isPremium && (
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-harvest-100 text-harvest-700 rounded-full border border-harvest-200 shadow-sm shrink-0">
                                        <Award className="w-3 h-3 fill-harvest-400" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Gold Veritas</span>
                                    </div>
                                )}
                            </div>
                            <p className="text-sage-600 font-bold uppercase tracking-widest text-xs mt-1">{userRole} Account</p>
                            <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-3">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 text-gray-600 text-xs font-bold border border-gray-100">
                                    <MapPin className="w-3.5 h-3.5" /> {userStateLoc ? `${userStateLoc}, ${userNationality}` : userNationality}
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

            {/* General Profile Modal (Fullscreen Stacked Info) */}
            <AnimatePresence>
                {isProfileModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-white overflow-hidden flex flex-col"
                        onClick={() => setIsProfileModalOpen(false)}
                    >
                        <motion.div
                            variants={overlayVariants} initial="hidden" animate="visible" exit="exit"
                            className="flex-1 flex flex-col w-full h-full bg-white overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="bg-gradient-to-br from-sage-800 to-sage-900 p-6 sm:p-8 pt-10 sm:pt-12 relative overflow-hidden shrink-0 min-h-[200px] sm:min-h-[250px] flex items-end">
                                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
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
                                                userName.charAt(0)
                                            )}
                                        </div>
                                        <div className="absolute inset-0 bg-black/40 rounded-[1.5rem] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Camera className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                    <div className="text-center sm:text-left text-white pb-2">
                                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{userName}</h2>
                                        <p className="text-sage-200 font-bold">{userRole === 'agronomist' ? 'Professional Profile' : 'Account Details'}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-4 sm:p-8 bg-gray-50/50 space-y-6 sm:space-y-8 overflow-y-auto">
                                
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
                                            <label className="block text-xs font-bold text-gray-600 mb-1.5">Date of Birth</label>
                                            <div className="relative">
                                                <input type="date" value={userDob} onChange={(e) => setUserDob(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500 shadow-sm" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-600 mb-1.5">State/Province</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                <input type="text" value={userStateLoc} onChange={(e) => setUserStateLoc(e.target.value)} placeholder="e.g. Lagos" className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 bg-white font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500 shadow-sm" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-600 mb-1.5">Nationality</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                <input type="text" value={userNationality} onChange={(e) => setUserNationality(e.target.value)} placeholder="e.g. Nigerian" className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 bg-white font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500 shadow-sm" />
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
                                                rows="3"
                                                value={agronomistBio} 
                                                onChange={(e) => setAgronomistBio(e.target.value)} 
                                                className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500 shadow-sm resize-none leading-relaxed" 
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-600 mb-1.5">Experience (Years)</label>
                                                <input type="number" value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500 shadow-sm" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-bold text-gray-600 mb-1.5">Professional Certificate (Image)</label>
                                                <div className="relative group h-40 bg-white border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center overflow-hidden transition-all hover:border-harvest-300">
                                                    {certPreview ? (
                                                        <>
                                                            <img src={certPreview} alt="Certificate" className="w-full h-full object-cover group-hover:brightness-75 transition-all" />
                                                            <button onClick={(e) => { e.stopPropagation(); setCertPreview(null); setCertificates(null); }} className="absolute top-4 right-4 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <div className="text-center space-y-2">
                                                            <UploadCloud className="w-8 h-8 text-gray-300 mx-auto" />
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Certificate Image</p>
                                                        </div>
                                                    )}
                                                    <input 
                                                        type="file" 
                                                        accept="image/*"
                                                        className="absolute inset-0 opacity-0 cursor-pointer" 
                                                        onChange={(e) => {
                                                            const file = e.target.files[0];
                                                            if (file) {
                                                                setCertificates(file);
                                                                const reader = new FileReader();
                                                                reader.onloadend = () => setCertPreview(reader.result);
                                                                reader.readAsDataURL(file);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                <div className="pt-8 flex flex-col sm:flex-row justify-end gap-3 border-t border-gray-200">
                                    <button onClick={() => setIsProfileModalOpen(false)} className="px-8 py-4 rounded-2xl font-black text-gray-500 hover:bg-gray-100 transition-colors uppercase tracking-widest text-xs">Back to Settings</button>
                                    <button
                                        onClick={async () => {
                                            const profileData = {
                                                phone_number: userPhone,
                                                dob: userDob,
                                                state: userStateLoc,
                                                nationality: userNationality,
                                                bio: agronomistBio || '',
                                                certificates: typeof certificates === 'string' ? certificates.split(',').map(s => s.trim()).filter(Boolean) : (certificates || []),
                                                experience_years: parseInt(experienceYears) || 0
                                            };

                                            try {
                                                await updateProfileOnBackend(profileData);
                                                showToast('Profile updated and synced!');
                                            } catch (err) {
                                                showToast('Saved locally. Server sync will retry later.');
                                            }
                                            localStorage.setItem('user_name', userName);
                                            localStorage.setItem('user_email', userEmail);
                                            localStorage.setItem('user_phone', userPhone);
                                            localStorage.setItem('user_dob', userDob);
                                            localStorage.setItem('user_state', userStateLoc);
                                            localStorage.setItem('user_nationality', userNationality);
                                            
                                            if (userRole === 'agronomist') {
                                                localStorage.setItem('agronomistBio', agronomistBio);
                                                localStorage.setItem('certificates', certPreview || '');
                                                localStorage.setItem('experience_years', experienceYears);
                                            }
                                            setIsProfileModalOpen(false);
                                            window.dispatchEvent(new Event('profilePictureUpdated'));
                                        }}
                                        className="px-10 py-4 rounded-2xl font-black text-white bg-sage-800 hover:bg-black shadow-xl shadow-sage-900/20 transition-all hover:-translate-y-0.5 uppercase tracking-widest text-xs"
                                    >
                                        Update Profile Info
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Farm Profile Modal (Stacked Info) */}
            <AnimatePresence>
                {isFarmProfileModalOpen && userRole === 'farmer' && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-white overflow-hidden flex flex-col"
                        onClick={() => setIsFarmProfileModalOpen(false)}
                    >
                        <motion.div
                            variants={overlayVariants} initial="hidden" animate="visible" exit="exit"
                            className="flex-1 flex flex-col w-full h-full bg-white overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="bg-gradient-to-br from-forest-500 to-forest-700 p-6 sm:p-8 pt-10 sm:pt-12 relative overflow-hidden shrink-0 min-h-[200px] sm:min-h-[250px] flex items-end">
                                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                                <button onClick={() => setIsFarmProfileModalOpen(false)} className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors text-white backdrop-blur-md z-10">
                                    <X className="w-5 h-5" />
                                </button>
                                <div className="relative z-10">
                                    <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">Farm Details</h2>
                                    <p className="text-forest-100/80 font-bold uppercase tracking-[0.2em] text-xs">Property & Crop Inventory</p>
                                </div>
                            </div>

                            <div className="flex-1 p-4 sm:p-8 pt-8 sm:pt-12 max-w-3xl mx-auto w-full">
                                <div className="space-y-8">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Core Identity</label>
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Farm Name</label>
                                                <input
                                                    type="text"
                                                    value={farmName}
                                                    onChange={(e) => setFarmName(e.target.value)}
                                                    placeholder="Enter farm name"
                                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Farm Address</label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                    <input
                                                        type="text"
                                                        value={farmAddress}
                                                        onChange={(e) => setFarmAddress(e.target.value)}
                                                        placeholder="Enter farm address"
                                                        className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 bg-white font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">State / Region</label>
                                            <input
                                                type="text"
                                                value={farmState}
                                                onChange={(e) => setFarmState(e.target.value)}
                                                className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Country</label>
                                            <input
                                                type="text"
                                                value={farmCountry}
                                                onChange={(e) => setFarmCountry(e.target.value)}
                                                className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Crops Cultivated</label>
                                            {/* Selected crops as chips */}
                                            {primaryCrop.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {primaryCrop.map((crop, idx) => (
                                                        <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-xs font-bold">
                                                            {crop}
                                                            <button type="button" onClick={() => setPrimaryCrop(primaryCrop.filter((_, i) => i !== idx))} className="text-emerald-400 hover:text-red-500 transition-colors">
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                            <div className="relative">
                                                <select
                                                    value=""
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        if (val && !primaryCrop.includes(val)) {
                                                            setPrimaryCrop([...primaryCrop, val]);
                                                        }
                                                    }}
                                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none shadow-sm cursor-pointer"
                                                >
                                                    <option value="">Select crop to add</option>
                                                    {allCrops.filter(c => !primaryCrop.includes(c.name)).map(crop => (
                                                        <option key={crop.name} value={crop.name}>{crop.name}</option>
                                                    ))}
                                                    <option value="__custom__">+ Add custom crop</option>
                                                </select>
                                                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-90 pointer-events-none" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Farm Size</label>
                                            <div className="relative">
                                                <select
                                                    value={farmSize}
                                                    onChange={(e) => setFarmSize(e.target.value)}
                                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none shadow-sm cursor-pointer"
                                                >
                                                    <option value="" disabled>Select option</option>
                                                    <option value="Under 1 Acre">Under 1 Acre</option>
                                                    <option value="1 - 5 Acres">1 - 5 Acres</option>
                                                    <option value="5 - 20 Acres">5 - 20 Acres</option>
                                                    <option value="20+ Acres">20+ Acres</option>
                                                </select>
                                                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-90 pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>

                                    {primaryCrop.includes('__custom__') && (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Enter Custom Crop Name</label>
                                            <div className="flex gap-2">
                                                <input 
                                                    type="text" 
                                                    value={customCrop}
                                                    onChange={(e) => setCustomCrop(e.target.value)}
                                                    placeholder="Enter crop name..."
                                                    className="flex-1 border border-gray-200 rounded-xl px-4 py-3 bg-white font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm" 
                                                />
                                                <button 
                                                    type="button"
                                                    onClick={() => {
                                                        if (customCrop.trim()) {
                                                            setPrimaryCrop([...primaryCrop.filter(c => c !== '__custom__'), customCrop.trim()]);
                                                            setCustomCrop('');
                                                        }
                                                    }}
                                                    className="px-4 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                <div className="pt-8 flex flex-col sm:flex-row justify-end gap-3 border-t border-gray-200 mt-12">
                                    <button onClick={() => setIsFarmProfileModalOpen(false)} className="px-8 py-4 rounded-2xl font-black text-gray-500 hover:bg-gray-100 transition-colors uppercase tracking-widest text-xs">Close</button>
                                    <button 
                                        onClick={async () => {
                                            const farmData = {
                                                farm_name: farmName,
                                                address_line: farmAddress,
                                                state: farmState,
                                                country: farmCountry,
                                                primary_crop: primaryCrop.filter(c => c !== '__custom__').join(', '),
                                                farm_size: farmSize
                                            };

                                            try {
                                                await updateProfileOnBackend(farmData);
                                                showToast('Farm profile updated and synced!');
                                            } catch (err) {
                                                showToast('Saved locally. Server sync will retry later.');
                                            }
                                            // Always save to localStorage
                                            localStorage.setItem('farm_name', farmName);
                                            localStorage.setItem('address_line', farmAddress);
                                            localStorage.setItem('state', farmState);
                                            localStorage.setItem('country', farmCountry);
                                            localStorage.setItem('primary_crop', primaryCrop.filter(c => c !== '__custom__').join(', '));
                                            localStorage.setItem('custom_crop', customCrop);
                                            localStorage.setItem('farm_size', farmSize);
                                            setIsFarmProfileModalOpen(false);
                                        }} 
                                        className="px-10 py-4 rounded-2xl font-black text-white bg-forest-500 hover:bg-black shadow-xl shadow-forest-900/20 transition-all hover:-translate-y-0.5 uppercase tracking-widest text-xs"
                                    >
                                        Save Farm Data
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Contact Information Modal (Password-Protected) */}
            <AnimatePresence>
                {isContactModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-white overflow-hidden flex flex-col"
                        onClick={() => setIsContactModalOpen(false)}
                    >
                        <motion.div
                            variants={overlayVariants} initial="hidden" animate="visible" exit="exit"
                            className="flex-1 flex flex-col w-full h-full bg-white overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="bg-gradient-to-br from-rose-600 to-rose-800 p-6 sm:p-8 pt-10 sm:pt-12 relative overflow-hidden shrink-0 min-h-[200px] sm:min-h-[250px] flex items-end">
                                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                                <button onClick={() => setIsContactModalOpen(false)} className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors text-white backdrop-blur-md z-10">
                                    <X className="w-5 h-5" />
                                </button>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Lock className="w-8 h-8 text-white/80" />
                                        <h2 className="text-3xl sm:text-4xl font-black text-white">Contact Information</h2>
                                    </div>
                                    <p className="text-rose-100/80 font-bold uppercase tracking-[0.2em] text-xs">Password verification required</p>
                                </div>
                            </div>

                            <div className="flex-1 p-4 sm:p-8 pt-8 sm:pt-12 max-w-xl mx-auto w-full">
                                {!contactPasswordVerified ? (
                                    <div className="space-y-6">
                                        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 text-center">
                                            <Lock className="w-10 h-10 text-rose-400 mx-auto mb-3" />
                                            <h3 className="text-lg font-black text-gray-900 mb-1">Verify Your Identity</h3>
                                            <p className="text-sm text-gray-500 font-medium">Enter your account password to access and modify your contact details.</p>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Account Password</label>
                                            <div className="relative">
                                                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                <input 
                                                    type="password" 
                                                    value={contactPassword}
                                                    onChange={(e) => { setContactPassword(e.target.value); setContactPasswordError(''); }}
                                                    placeholder="Enter your password"
                                                    className="w-full border border-gray-200 rounded-xl pl-12 pr-4 py-4 bg-white font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-sm text-base"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            document.getElementById('verify-contact-btn')?.click();
                                                        }
                                                    }}
                                                />
                                            </div>
                                            {contactPasswordError && (
                                                <p className="mt-2 text-sm font-bold text-red-500">{contactPasswordError}</p>
                                            )}
                                        </div>

                                        <button 
                                            id="verify-contact-btn"
                                            disabled={!contactPassword || contactVerifying}
                                            onClick={async () => {
                                                setContactVerifying(true);
                                                setContactPasswordError('');
                                                try {
                                                    const currentUsername = localStorage.getItem('user_name') || userName;
                                                    const currentEmail = localStorage.getItem('user_email') || userEmail;
                                                    // Try login with username or email
                                                    await axios.post(`${API_URL}/api/auth/login/`, {
                                                        username: currentUsername,
                                                        password: contactPassword
                                                    });
                                                    setContactPasswordVerified(true);
                                                } catch (err) {
                                                    // Try with email if username failed
                                                    try {
                                                        const currentEmail = localStorage.getItem('user_email') || userEmail;
                                                        await axios.post(`${API_URL}/api/auth/login/`, {
                                                            username: currentEmail,
                                                            password: contactPassword
                                                        });
                                                        setContactPasswordVerified(true);
                                                    } catch (err2) {
                                                        setContactPasswordError('Incorrect password. Please try again.');
                                                    }
                                                }
                                                setContactVerifying(false);
                                            }}
                                            className="w-full py-4 bg-rose-600 text-white font-black rounded-2xl shadow-xl shadow-rose-600/20 hover:bg-rose-700 transition-all uppercase tracking-widest text-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {contactVerifying ? (
                                                <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</>
                                            ) : (
                                                <><Shield className="w-4 h-4" /> Verify & Continue</>
                                            )}
                                        </button>
                                    </div>
                                ) : (
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                        <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-center gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                            <p className="text-sm font-bold text-green-700">Identity verified. You can now edit your contact details.</p>
                                        </div>

                                        <div className="space-y-5">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                    <input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} className="w-full border border-gray-200 rounded-xl pl-12 pr-4 py-4 bg-white font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-sm" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                                                <div className="relative">
                                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                    <input type="text" value={userPhone} onChange={(e) => setUserPhone(e.target.value)} className="w-full border border-gray-200 rounded-xl pl-12 pr-4 py-4 bg-white font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-sm" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-6 flex flex-col sm:flex-row justify-end gap-3 border-t border-gray-200">
                                            <button onClick={() => setIsContactModalOpen(false)} className="px-8 py-4 rounded-2xl font-black text-gray-500 hover:bg-gray-100 transition-colors uppercase tracking-widest text-xs">Cancel</button>
                                            <button 
                                                onClick={async () => {
                                                    const contactData = {
                                                        phone_number: userPhone,
                                                    };
                                                    try {
                                                        await updateProfileOnBackend(contactData);
                                                        showToast('Contact info updated!');
                                                    } catch (err) {
                                                        showToast('Saved locally. Server sync will retry later.');
                                                    }
                                                    localStorage.setItem('user_email', userEmail);
                                                    localStorage.setItem('user_phone', userPhone);
                                                    setIsContactModalOpen(false);
                                                }}
                                                className="px-10 py-4 rounded-2xl font-black text-white bg-rose-600 hover:bg-black shadow-xl shadow-rose-600/20 transition-all hover:-translate-y-0.5 uppercase tracking-widest text-xs"
                                            >
                                                Save Contact Info
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Notifications Modal (Fullscreen) */}
            <AnimatePresence>
                {isNotificationsModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-white overflow-hidden flex flex-col"
                        onClick={() => setIsNotificationsModalOpen(false)}
                    >
                        <motion.div
                            variants={overlayVariants} initial="hidden" animate="visible" exit="exit"
                            className="flex-1 flex flex-col w-full h-full bg-white overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="bg-gradient-to-br from-harvest-500 to-harvest-700 p-6 sm:p-8 pt-10 sm:pt-12 relative overflow-hidden shrink-0 min-h-[200px] sm:min-h-[250px] flex items-end">
                                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                                <button onClick={() => setIsNotificationsModalOpen(false)} className="absolute top-6 right-6 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors text-white backdrop-blur-md z-10">
                                    <X className="w-5 h-5" />
                                </button>
                                <div className="relative z-10">
                                    <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">Alert Preferences</h2>
                                    <p className="text-harvest-50/80 font-bold uppercase tracking-[0.2em] text-xs">Reach & Marketing Controls</p>
                                </div>
                            </div>

                            <div className="flex-1 p-4 sm:p-8 pt-8 sm:pt-12 max-w-3xl mx-auto w-full">
                                <div className="space-y-8">
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-harvest-100 text-harvest-600 rounded-xl flex items-center justify-center">
                                                    <Smartphone className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900">Push Notifications</h3>
                                                    <p className="text-xs text-gray-400 font-medium">Instant alerts on your mobile device</p>
                                                </div>
                                            </div>
                                            <div className={`w-14 h-7 rounded-full relative cursor-pointer outline-none transition-colors shrink-0 shadow-inner ${smsEnabled ? 'bg-harvest-600' : 'bg-gray-300'}`} onClick={() => setSmsEnabled(!smsEnabled)}>
                                                <div className={`w-5 h-5 bg-white rounded-full absolute top-1 shadow-md transition-all ${smsEnabled ? 'right-1' : 'left-1'}`}></div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-harvest-100 text-harvest-600 rounded-xl flex items-center justify-center">
                                                    <Mail className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900">Email Alerts</h3>
                                                    <p className="text-xs text-gray-400 font-medium">Daily summaries and security logs</p>
                                                </div>
                                            </div>
                                            <div className={`w-14 h-7 rounded-full relative cursor-pointer outline-none transition-colors shrink-0 shadow-inner ${emailEnabled ? 'bg-harvest-600' : 'bg-gray-300'}`} onClick={() => setEmailEnabled(!emailEnabled)}>
                                                <div className={`w-5 h-5 bg-white rounded-full absolute top-1 shadow-md transition-all ${emailEnabled ? 'right-1' : 'left-1'}`}></div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-harvest-100 text-harvest-600 rounded-xl flex items-center justify-center">
                                                    <Plus className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900">Marketing & News</h3>
                                                    <p className="text-xs text-gray-400 font-medium">Occasional updates on new features</p>
                                                </div>
                                            </div>
                                            <div className={`w-14 h-7 rounded-full relative cursor-pointer outline-none transition-colors shrink-0 shadow-inner ${marketingEnabled ? 'bg-harvest-600' : 'bg-gray-300'}`} onClick={() => setMarketingEnabled(!marketingEnabled)}>
                                                <div className={`w-5 h-5 bg-white rounded-full absolute top-1 shadow-md transition-all ${marketingEnabled ? 'right-1' : 'left-1'}`}></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-8 flex flex-col sm:flex-row justify-end gap-3 border-t border-gray-200 mt-12">
                                        <button 
                                            onClick={() => {
                                                setIsNotificationsModalOpen(false);
                                                showToast('Preferences updated.');
                                            }} 
                                            className="px-10 py-4 rounded-2xl font-black text-white bg-harvest-600 hover:bg-black shadow-xl shadow-harvest-900/20 transition-all hover:-translate-y-0.5 uppercase tracking-widest text-xs"
                                        >
                                            Apply Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Consultation Fees Modal (Fullscreen) */}
            <AnimatePresence>
                {isConsultationModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-white overflow-hidden flex flex-col"
                        onClick={() => setIsConsultationModalOpen(false)}
                    >
                        <motion.div
                            variants={overlayVariants} initial="hidden" animate="visible" exit="exit"
                            className="flex-1 flex flex-col w-full h-full bg-white overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="bg-gradient-to-br from-indigo-800 to-indigo-900 p-8 pt-12 relative overflow-hidden shrink-0 min-h-[250px] flex items-end">
                                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                                <button onClick={() => setIsConsultationModalOpen(false)} className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors text-white backdrop-blur-md z-10">
                                    <X className="w-5 h-5" />
                                </button>
                                <div className="relative z-10">
                                    <h2 className="text-4xl font-black text-white mb-2">Earnings & Fees</h2>
                                    <p className="text-indigo-100/80 font-bold uppercase tracking-[0.2em] text-xs">Set your professional consulting rates</p>
                                </div>
                            </div>

                            <div className="flex-1 p-8 pt-12 max-w-3xl mx-auto w-full">
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="p-8 bg-gradient-to-br from-indigo-50 to-white rounded-3xl border border-indigo-100 shadow-sm transition-all hover:shadow-md">
                                            <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-4">Live Video Consultation</label>
                                            <div className="flex items-center gap-4 bg-white p-6 rounded-2xl border border-indigo-50 shadow-inner group-focus-within:ring-2 ring-indigo-500 transition-all">
                                                <span className="text-4xl font-black text-gray-300">₦</span>
                                                <input 
                                                    type="number" 
                                                    value={videoFee} 
                                                    onChange={(e) => setVideoFee(e.target.value)} 
                                                    className="w-full text-5xl font-black text-gray-900 border-none p-0 focus:ring-0 outline-none bg-transparent" 
                                                />
                                            </div>
                                            <p className="text-xs text-indigo-400 font-bold mt-4 flex items-center gap-2">
                                                <Sparkles className="w-4 h-4" /> Earn 95% of this as a Premium Expert.
                                            </p>
                                        </div>
                                        
                                        <div className="p-8 bg-gradient-to-br from-emerald-50 to-white rounded-3xl border border-emerald-100 shadow-sm transition-all hover:shadow-md">
                                            <label className="block text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-4">Diagnostic Soil Report</label>
                                            <div className="flex items-center gap-4 bg-white p-6 rounded-2xl border border-emerald-50 shadow-inner">
                                                <span className="text-4xl font-black text-gray-300">₦</span>
                                                <input 
                                                    type="number" 
                                                    value={textFee} 
                                                    onChange={(e) => setTextFee(e.target.value)} 
                                                    className="w-full text-5xl font-black text-gray-900 border-none p-0 focus:ring-0 outline-none bg-transparent" 
                                                />
                                            </div>
                                            <p className="text-xs text-emerald-400 font-bold mt-4 flex items-center gap-2">
                                                <Activity className="w-4 h-4" /> Average market rate is ₦3,500.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-8 flex flex-col sm:flex-row justify-end gap-3 border-t border-gray-200 mt-12">
                                        <button 
                                            onClick={() => {
                                                localStorage.setItem('videoFee', videoFee);
                                                localStorage.setItem('textFee', textFee);
                                                setIsConsultationModalOpen(false);
                                                showToast('Fee structure updated and live.');
                                            }} 
                                            className="px-10 py-4 rounded-2xl font-black text-white bg-indigo-600 hover:bg-black shadow-xl shadow-indigo-900/20 transition-all hover:-translate-y-0.5 uppercase tracking-widest text-xs"
                                        >
                                            Save Current Rates
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Avatar Upload Modal (Fullscreen) */}
            <AnimatePresence>
                {isAvatarModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-white overflow-hidden flex flex-col"
                    >
                        <motion.div
                            variants={overlayVariants} initial="hidden" animate="visible" exit="exit"
                            className="flex-1 flex flex-col w-full h-full bg-white overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="bg-gradient-to-br from-sage-600 to-sage-700 p-8 pt-12 relative overflow-hidden shrink-0 min-h-[250px] flex items-end">
                                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                                <button onClick={() => { setIsAvatarModalOpen(false); setAvatarPreview(null); setAvatarFile(null); }} className="absolute top-6 right-6 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors text-white backdrop-blur-md z-10">
                                    <X className="w-5 h-5" />
                                </button>
                                <div className="relative z-10 text-left">
                                    <h2 className="text-4xl font-black text-white mb-2">Profile Photo</h2>
                                    <p className="text-sage-50/80 font-bold uppercase tracking-[0.2em] text-xs">Visual Identity & Recognition</p>
                                </div>
                            </div>

                            <div className="flex-1 p-8 pt-12 max-w-3xl mx-auto w-full text-center">
                                <div className="relative w-48 h-48 mx-auto mb-12 cursor-pointer group rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white bg-sage-50">
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover group-hover:brightness-90 transition-all scale-100 group-hover:scale-105" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-sage-200 font-black text-7xl group-hover:bg-sage-100 transition-colors">
                                            {userRole === 'agronomist' ? 'O' : 'K'}
                                        </div>
                                    )}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="w-10 h-10 text-white mb-2" />
                                        <span className="text-white text-[10px] font-black uppercase tracking-widest">Update Photo</span>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setAvatarFile(file);
                                                const reader = new FileReader();
                                                reader.onloadend = () => setAvatarPreview(reader.result);
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                </div>

                                <div className="max-w-sm mx-auto space-y-6">
                                    <p className="text-gray-500 font-medium leading-relaxed">
                                        Upload a professional photo. This helps build trust with other members in the CeresVera ecosystem.
                                    </p>
                                    
                                    <div className="flex flex-col gap-3">
                                        <button
                                            disabled={!avatarFile || isUploading}
                                            onClick={async () => {
                                                if (!avatarFile) return;
                                                setIsUploading(true);
                                                try {
                                                    if (avatarPreview) {
                                                        localStorage.setItem('profile_picture', avatarPreview);
                                                        window.dispatchEvent(new Event('profilePictureUpdated'));
                                                        showToast('Profile picture updated!');
                                                    }
                                                    setIsAvatarModalOpen(false);
                                                } catch (error) {
                                                    showToast('Failed to upload picture.');
                                                } finally {
                                                    setIsUploading(false);
                                                }
                                            }}
                                            className={`w-full py-4 rounded-2xl font-black text-white shadow-xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs ${avatarFile && !isUploading ? 'bg-sage-700 hover:bg-black shadow-sage-900/20 hover:-translate-y-0.5' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                                        >
                                            {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
                                            {isUploading ? 'Uploading...' : 'Save New Photo'}
                                        </button>
                                        
                                        <button 
                                            onClick={() => { setIsAvatarModalOpen(false); setAvatarPreview(null); setAvatarFile(null); }} 
                                            className="w-full py-4 rounded-2xl font-black text-gray-400 hover:bg-gray-50 transition-colors uppercase tracking-widest text-xs"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Other Modals (Security, Payment, Consults, Scan History) use similar improved overlay designs */}
            
            {/* Payment Methods Modal (Fullscreen) */}
            <AnimatePresence>
                {isPaymentModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-white overflow-hidden flex flex-col"
                        onClick={() => setIsPaymentModalOpen(false)}
                    >
                        <motion.div
                            variants={overlayVariants} initial="hidden" animate="visible" exit="exit"
                            className="flex-1 flex flex-col w-full h-full bg-white overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="bg-gradient-to-br from-harvest-600 to-harvest-800 p-6 sm:p-8 pt-10 sm:pt-12 relative overflow-hidden shrink-0 min-h-[200px] sm:min-h-[250px] flex items-end">
                                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                                <button onClick={() => setIsPaymentModalOpen(false)} className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors text-white backdrop-blur-md z-10">
                                    <X className="w-5 h-5" />
                                </button>
                                <div className="relative z-10">
                                    <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">Connected Accounts</h2>
                                    <p className="text-harvest-100/80 font-bold uppercase tracking-[0.2em] text-xs">Payment & Withdrawal Methods</p>
                                </div>
                            </div>

                            <div className="flex-1 p-4 sm:p-8 pt-8 sm:pt-12 max-w-3xl mx-auto w-full">
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        {savedCards.map(card => (
                                            <div key={card.id} className="bg-white border border-gray-200 rounded-3xl p-6 flex items-center justify-between shadow-sm hover:border-harvest-200 transition-colors">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-16 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-[10px] font-black text-gray-400 border border-gray-100">
                                                        {card.type}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 text-lg">•••• {card.last4}</h3>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Expires {card.exp}</p>
                                                    </div>
                                                </div>
                                                {card.isDefault && (
                                                    <span className="text-[10px] font-black text-harvest-600 bg-harvest-50 px-3 py-1.5 rounded-full uppercase tracking-wider border border-harvest-100">Default</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <button className="w-full py-6 border-2 border-dashed border-gray-200 rounded-3xl flex items-center justify-center gap-3 text-gray-400 font-bold hover:bg-harvest-50 hover:border-harvest-300 hover:text-harvest-600 transition-all hover:scale-[1.01]">
                                        <Plus className="w-5 h-5" /> Add New Payment Method
                                    </button>

                                    <div className="p-6 bg-blue-50/50 rounded-3xl flex items-start gap-4 border border-blue-100">
                                        <Shield className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
                                        <div className="space-y-1">
                                            <h4 className="font-bold text-blue-900 text-sm">Bank-Grade Security</h4>
                                            <p className="text-xs text-blue-700/70 font-medium leading-relaxed">
                                                All payments are processed securely via Interswitch. Your sensitive card details are never stored on our servers.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-8 flex flex-col sm:flex-row justify-end gap-3 border-t border-gray-200 mt-12">
                                        <button onClick={() => setIsPaymentModalOpen(false)} className="px-10 py-4 rounded-2xl font-black text-white bg-harvest-600 hover:bg-black shadow-xl shadow-harvest-900/20 transition-all hover:-translate-y-0.5 uppercase tracking-widest text-xs">Close Payment Hub</button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Scan History & Sync Modal (Fullscreen) */}
            <AnimatePresence>
                {isScanHistoryModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-white overflow-hidden flex flex-col"
                        onClick={() => setIsScanHistoryModalOpen(false)}
                    >
                        <motion.div
                            variants={overlayVariants} initial="hidden" animate="visible" exit="exit"
                            className="flex-1 flex flex-col w-full h-full bg-white overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="bg-gradient-to-br from-forest-600 to-forest-800 p-6 sm:p-8 pt-10 sm:pt-12 relative overflow-hidden shrink-0 min-h-[200px] sm:min-h-[250px] flex items-end">
                                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                                <button onClick={() => setIsScanHistoryModalOpen(false)} className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors text-white backdrop-blur-md z-10">
                                    <X className="w-5 h-5" />
                                </button>
                                <div className="relative z-10">
                                    <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">Scan & Sync</h2>
                                    <p className="text-forest-100/80 font-bold uppercase tracking-[0.2em] text-xs">Offline Diagnostics Archive</p>
                                </div>
                            </div>

                            <div className="flex-1 p-4 sm:p-8 pt-8 sm:pt-12 max-w-3xl mx-auto w-full">
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <div className="bg-sage-50 rounded-3xl p-8 border border-sage-100 flex items-center justify-between">
                                            <div>
                                                <h3 className="font-black text-sage-900 text-xl">Database Backup</h3>
                                                <p className="text-xs text-sage-400 font-bold mt-1 uppercase tracking-widest">Your analyses are safe in the cloud</p>
                                            </div>
                                            <div className="px-6 py-3 bg-white text-sage-600 text-[10px] font-black rounded-xl border border-sage-100">
                                                SYNCED
                                            </div>
                                        </div>

                                        <div className="bg-white border border-gray-200 rounded-3xl p-8 flex items-center justify-between shadow-sm">
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                                                    <Cloud className="w-7 h-7" />
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-gray-900 text-xl">Auto-Backup</h3>
                                                    <p className="text-xs text-gray-400 font-medium">Real-time cloud database mirroring</p>
                                                </div>
                                            </div>
                                            <div className="w-14 h-7 bg-emerald-500 rounded-full relative cursor-pointer shadow-inner">
                                                <div className="w-5 h-5 bg-white rounded-full absolute top-1 right-1 shadow-md"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-12 flex justify-end border-t border-gray-100 pt-8">
                                        <button onClick={() => setIsScanHistoryModalOpen(false)} className="px-10 py-4 rounded-2xl font-black text-gray-400 hover:bg-gray-50 transition-colors uppercase tracking-widest text-xs">Done</button>
                                    </div>

                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Security Modal (Fullscreen) */}
            <AnimatePresence>
                {isSecurityModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-white overflow-hidden flex flex-col"
                        onClick={() => setIsSecurityModalOpen(false)}
                    >
                        <motion.div
                            variants={overlayVariants} initial="hidden" animate="visible" exit="exit"
                            className="flex-1 flex flex-col w-full h-full bg-white overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="bg-gradient-to-br from-forest-800 to-forest-900 p-6 sm:p-8 pt-10 sm:pt-12 relative overflow-hidden shrink-0 min-h-[200px] sm:min-h-[250px] flex items-end">
                                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                                <button onClick={() => setIsSecurityModalOpen(false)} className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors text-white backdrop-blur-md z-10">
                                    <X className="w-5 h-5" />
                                </button>
                                <div className="relative z-10">
                                    <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">Access Control</h2>
                                    <p className="text-forest-100/80 font-bold uppercase tracking-[0.2em] text-xs">Security & Authentication</p>
                                </div>
                            </div>

                            <div className="flex-1 p-8 pt-12 max-w-3xl mx-auto w-full">
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 gap-4">
                                        <button onClick={() => showToast('Password reset link sent!')} className="w-full bg-gray-50 rounded-3xl p-8 flex items-center justify-between hover:bg-white border border-gray-100 hover:border-forest-300 hover:shadow-2xl hover:shadow-forest-950/5 transition-all group">
                                            <div className="flex items-center gap-6 text-left">
                                                <div className="w-16 h-16 bg-forest-50 text-forest-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <Lock className="w-8 h-8" />
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-gray-900 text-xl">Change Passcode</h3>
                                                    <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest">Update vault credentials</p>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-forest-500 group-hover:translate-x-1 transition-all" />
                                        </button>
                                        
                                        <div className="bg-white border border-gray-100 rounded-3xl p-8 flex items-center justify-between shadow-sm">
                                            <div className="flex items-center gap-6 text-left">
                                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${twoFactorEnabled ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                                                    <Smartphone className="w-8 h-8" />
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-gray-900 text-xl">Double-Layer Auth</h3>
                                                    <p className="text-xs text-gray-400 font-medium">{twoFactorEnabled ? 'Active protection via SMS' : 'Not yet configured'}</p>
                                                </div>
                                            </div>
                                            <div 
                                                className={`w-14 h-7 rounded-full relative cursor-pointer shadow-inner transition-colors ${twoFactorEnabled ? 'bg-forest-500' : 'bg-gray-300'}`} 
                                                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                                            >
                                                <div className={`w-5 h-5 bg-white rounded-full absolute top-1 shadow-md transition-all ${twoFactorEnabled ? 'right-1' : 'left-1'}`}></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-8 bg-forest-50/50 rounded-3xl border border-forest-100">
                                        <div className="flex items-center gap-4 mb-4">
                                            <Shield className="w-6 h-6 text-forest-600" />
                                            <h4 className="font-black text-forest-900 uppercase tracking-widest text-xs">Security Pro-Tip</h4>
                                        </div>
                                        <p className="text-sm text-forest-800/70 font-medium leading-relaxed">
                                            We recommend enabling Double-Layer Authentication to prevent unauthorized access to your payout history and farm diagnostics data.
                                        </p>
                                    </div>

                                    <div className="pt-8 flex flex-col sm:flex-row justify-end gap-3 border-t border-gray-200 mt-12">
                                        <button onClick={() => setIsSecurityModalOpen(false)} className="px-10 py-4 rounded-2xl font-black text-forest-600 hover:bg-gray-50 transition-colors uppercase tracking-widest text-xs">Done</button>
                                    </div>
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
        </>
    );
}
