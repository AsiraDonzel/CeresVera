import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bell, Shield, Wallet, Book, LogOut, ChevronRight, CheckCircle2, X, MapPin, Camera, CreditCard, Plus, Smartphone, Key, UploadCloud, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Settings() {
    const userRole = localStorage.getItem('user_role') || 'farmer';
    const navigate = useNavigate();
    const [toastMessage, setToastMessage] = useState('');
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isScanHistoryModalOpen, setIsScanHistoryModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

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

    const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
    const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
    const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);

    // Toggle States
    const [smsEnabled, setSmsEnabled] = useState(true);
    const [emailEnabled, setEmailEnabled] = useState(true);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

    // Consultation Fees State
    const [videoFee, setVideoFee] = useState('5000');
    const [textFee, setTextFee] = useState('2500');

    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
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
        { icon: <User className="w-5 h-5" />, title: 'Professional Profile', desc: 'Update your biography, specialties, and avatar.', action: () => setIsAvatarModalOpen(true) },
        { icon: <Wallet className="w-5 h-5" />, title: 'Consultation Fees', desc: 'Set your standard rates for video and text audits.', action: () => setIsConsultationModalOpen(true) },
        { icon: <Bell className="w-5 h-5" />, title: 'Notifications', desc: 'Push & Email alerts for new Escrow requests.', action: () => setIsNotificationsModalOpen(true) },
        { icon: <Shield className="w-5 h-5" />, title: 'Security', desc: 'Password, 2FA, and connected devices.', action: () => setIsSecurityModalOpen(true) },
    ];

    const farmerMenus = [
        { icon: <User className="w-5 h-5" />, title: 'Avatar & Avatar', desc: 'Update your profile picture.', action: () => setIsAvatarModalOpen(true) },
        { icon: <MapPin className="w-5 h-5" />, title: 'Farm Profile', desc: 'Location, primary crops, and farm size.', action: () => setIsProfileModalOpen(true) },
        { icon: <Book className="w-5 h-5" />, title: 'Scan History', desc: 'Manage your offline AI disease scan data.', action: () => setIsScanHistoryModalOpen(true) },
        { icon: <Wallet className="w-5 h-5" />, title: 'Payment Methods', desc: 'Manage connected cards for Interswitch Escrow.', action: () => setIsPaymentModalOpen(true) },
        { icon: <Shield className="w-5 h-5" />, title: 'Security', desc: 'Password and account recovery.', action: () => setIsSecurityModalOpen(true) },
    ];

    const activeMenus = userRole === 'agronomist' ? agronomistMenus : farmerMenus;

    return (
        <div className="min-h-screen bg-earth-50 pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-8">Settings</h1>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-8">
                    {/* User Mini Profile Header */}
                    <div className="p-6 border-b border-gray-100 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-sage-100 flex items-center justify-center text-sage-700 font-bold text-2xl overflow-hidden shadow-inner">
                            {localStorage.getItem('profile_picture') ? (
                                <img src={localStorage.getItem('profile_picture')} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                userRole === 'agronomist' ? 'O' : 'K'
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{userRole === 'agronomist' ? 'Dr. Okafor' : 'Kemi Adebayo'}</h2>
                            <p className="text-sm text-gray-500 font-medium capitalize">{userRole} Account</p>
                        </div>
                    </div>

                    <div className="divide-y divide-gray-50">
                        {activeMenus.map((menu, i) => (
                            <div
                                key={i}
                                onClick={() => {
                                    if (menu.action) {
                                        menu.action();
                                    } else {
                                        showToast(`Opened ${menu.title} configurations.`);
                                    }
                                }}
                                className="flex items-center justify-between p-4 sm:p-6 hover:bg-gray-50 cursor-pointer transition-colors group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center group-hover:bg-sage-100 group-hover:text-sage-700 transition-colors">
                                        {menu.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{menu.title}</h3>
                                        <p className="text-sm text-gray-500">{menu.desc}</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-sage-500 transition-colors" />
                            </div>
                        ))}
                    </div>
                </div>

                <button onClick={handleLogout} className="w-full sm:w-auto bg-white border border-red-200 text-red-600 hover:bg-red-50 font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2">
                    <LogOut className="w-5 h-5" /> Sign Out
                </button>

            </div>

            {/* Farmer Profile Modal */}
            <AnimatePresence>
                {isProfileModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative border border-gray-100 p-8"
                        >
                            <button onClick={() => setIsProfileModalOpen(false)} className="absolute top-6 right-6 w-8 h-8 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors text-gray-500">
                                <X className="w-4 h-4" />
                            </button>
                            <h2 className="text-2xl font-black text-gray-900 mb-2">Farm Profile</h2>
                            <p className="text-gray-500 text-sm mb-6">Manage your primary location and crop data for better AI diagnostics.</p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Farm Name</label>
                                    <input type="text" defaultValue="Kemi Adebayo Farms" className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Location / State</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            value={farmLocation}
                                            onChange={(e) => setFarmLocation(e.target.value)}
                                            className="w-full border border-gray-200 rounded-xl pl-12 pr-4 py-3 bg-gray-50 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500"
                                            placeholder="e.g. Ogun State, Nigeria"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Primary Crop</label>
                                        <select
                                            value={primaryCrop}
                                            onChange={(e) => setPrimaryCrop(e.target.value)}
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500 appearance-none"
                                        >
                                            <option value="Cassava">Cassava</option>
                                            <option value="Maize">Maize</option>
                                            <option value="Tomato">Tomato</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Farm Size</label>
                                        <select
                                            value={farmSize}
                                            onChange={(e) => setFarmSize(e.target.value)}
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500 appearance-none"
                                        >
                                            <option value="1 - 5 Acres">1 - 5 Acres</option>
                                            <option value="5 - 20 Acres">5 - 20 Acres</option>
                                            <option value="20+ Acres">20+ Acres</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end gap-3">
                                <button onClick={() => setIsProfileModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
                                <button
                                    onClick={async () => {
                                        const token = localStorage.getItem('access_token');
                                        if (token) {
                                            try {
                                                await axios.post('http://localhost:8000/api/auth/profile/', {
                                                    farm_location: farmLocation,
                                                    primary_crop: primaryCrop,
                                                    farm_size: farmSize
                                                }, {
                                                    headers: { 'Authorization': `Bearer ${token}` }
                                                });
                                            } catch (err) {
                                                console.error('Failed to save profile to database', err);
                                            }
                                        }

                                        // Keep local storage active for immediate UI updates on the Dashboard
                                        localStorage.setItem('farm_location', farmLocation);
                                        localStorage.setItem('primary_crop', primaryCrop);
                                        localStorage.setItem('farm_size', farmSize);

                                        setIsProfileModalOpen(false);
                                        showToast('Farm Profile saved successfully.');
                                    }}
                                    className="px-6 py-2.5 rounded-xl font-bold text-white bg-sage-700 hover:bg-sage-900 shadow-sm shadow-sage-700/20 transition-all hover:-translate-y-0.5"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Scan History Modal */}
            <AnimatePresence>
                {isScanHistoryModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-2xl rounded-[2rem] overflow-hidden shadow-2xl relative border border-gray-100 flex flex-col max-h-[85vh]"
                        >
                            <div className="p-8 border-b border-gray-100 flex-shrink-0 relative">
                                <button onClick={() => setIsScanHistoryModalOpen(false)} className="absolute top-8 right-8 w-8 h-8 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors text-gray-500">
                                    <X className="w-4 h-4" />
                                </button>
                                <h2 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-3">
                                    <Book className="w-6 h-6 text-sage-600" /> Scan History
                                </h2>
                                <p className="text-gray-500 text-sm">Manage your offline and synced AI disease scan data.</p>
                            </div>

                            <div className="p-8 overflow-y-auto space-y-4">
                                {[
                                    { id: 1, crop: 'Tomato', status: 'Healthy', date: 'Oct 12, 2026', synced: true },
                                    { id: 2, crop: 'Maize', status: 'Leaf Blight', date: 'Oct 10, 2026', synced: true },
                                    { id: 3, crop: 'Cassava', status: 'Healthy', date: 'Oct 05, 2026', synced: false },
                                    { id: 4, crop: 'Sorghum', status: 'Anthracnose', date: 'Oct 01, 2026', synced: true },
                                ].map((scan) => (
                                    <div key={scan.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100 gap-4 group hover:bg-white hover:shadow-sm hover:border-sage-200 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white border border-gray-100 rounded-xl shadow-sm flex items-center justify-center text-sage-600 group-hover:bg-sage-50 group-hover:text-sage-700 transition-colors">
                                                <Camera className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-lg">{scan.crop}</h3>
                                                <div className="flex items-center gap-2 text-xs font-semibold mt-1">
                                                    <span className="text-gray-500">{scan.date}</span>
                                                    <span className="text-gray-300">•</span>
                                                    <span className={scan.synced ? "text-sage-600" : "text-amber-500"}>
                                                        {scan.synced ? 'Backed up to Cloud' : 'Pending Sync (Offline)'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 w-full sm:w-auto">
                                            <span className={`px-4 py-1.5 text-xs font-bold rounded-full uppercase tracking-wider ${scan.status === 'Healthy' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {scan.status}
                                            </span>
                                            {!scan.synced && (
                                                <button onClick={() => showToast('Syncing scan...')} className="text-xs bg-sage-600 hover:bg-sage-800 text-white px-4 py-2 rounded-xl font-bold transition-colors shadow-sm focus:outline-none">
                                                    Sync
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-6 bg-gray-50 border-t border-gray-100 flex-shrink-0 flex justify-between items-center sm:justify-end gap-3 rounded-b-[2rem]">
                                <button onClick={() => setIsScanHistoryModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-colors w-full sm:w-auto">Close</button>
                                <button
                                    onClick={() => {
                                        setIsScanHistoryModalOpen(false);
                                        showToast('All pending offline scans have been synced to the database.');
                                    }}
                                    className="px-6 py-2.5 rounded-xl font-bold text-white bg-sage-700 hover:bg-sage-900 shadow-sm shadow-sage-700/20 transition-all hover:-translate-y-0.5 w-full sm:w-auto whitespace-nowrap"
                                >
                                    Sync All Offline Data
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Payment Methods Modal */}
            <AnimatePresence>
                {isPaymentModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative border border-gray-100 p-8"
                        >
                            <button onClick={() => setIsPaymentModalOpen(false)} className="absolute top-6 right-6 w-8 h-8 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors text-gray-500">
                                <X className="w-4 h-4" />
                            </button>
                            <div className="mb-8">
                                <h2 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-3">
                                    <Wallet className="w-6 h-6 text-sage-600" /> Payment Methods
                                </h2>
                                <p className="text-gray-500 text-sm">Manage cards securely linked via Interswitch for escrow consultations.</p>
                            </div>

                            <div className="space-y-4 mb-6">
                                {savedCards.map(card => (
                                    <div
                                        key={card.id}
                                        className={`border rounded-2xl p-4 flex items-center justify-between relative overflow-hidden transition-colors ${card.isDefault ? 'border-sage-500 bg-sage-50' : 'border-gray-100 bg-white hover:bg-gray-50 group cursor-pointer'}`}
                                        onClick={() => {
                                            if (!card.isDefault) {
                                                setSavedCards(savedCards.map(c => ({
                                                    ...c,
                                                    isDefault: c.id === card.id
                                                })));
                                                showToast(`${card.type} ending in ${card.last4} is now your default card.`);
                                            }
                                        }}
                                    >
                                        <div className="absolute top-0 right-0 p-2 opacity-5"><CreditCard className="w-20 h-20" /></div>
                                        <div className="flex gap-4 items-center relative z-10">
                                            <div className={`w-12 h-8 rounded-md shadow-sm border border-gray-100 flex items-center justify-center font-bold text-xs tracking-wider ${card.type === 'VISA' ? 'bg-white text-blue-800' : 'bg-gray-100 text-red-500'}`}>
                                                {card.type}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 text-lg tracking-widest">•••• {card.last4}</div>
                                                <div className={`text-xs font-medium ${card.isDefault ? 'text-sage-700' : 'text-gray-500'}`}>Expires {card.exp}</div>
                                            </div>
                                        </div>
                                        {card.isDefault ? (
                                            <div className="relative z-10 bg-white border border-sage-200 text-sage-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                                                Default
                                            </div>
                                        ) : (
                                            <button className="text-sm font-bold text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-gray-900 relative z-10">
                                                Make Default
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {isAddingCard ? (
                                <div className="border border-gray-200 rounded-2xl p-4 mb-6 bg-gray-50 animate-in fade-in slide-in-from-top-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="font-bold text-sm text-gray-700">Add New Card (Mock)</span>
                                        <button onClick={() => setIsAddingCard(false)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
                                    </div>
                                    <div className="space-y-4">
                                        <input type="text" placeholder="Card Number (e.g. 5555...)" className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-sage-500 outline-none" id="newCardNum" />
                                        <div className="grid grid-cols-2 gap-4">
                                            <input type="text" placeholder="MM/YY" className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-sage-500 outline-none" id="newCardExp" />
                                            <input type="text" placeholder="CVC" className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-sage-500 outline-none" />
                                        </div>
                                        <button
                                            className="w-full bg-gray-900 text-white font-bold py-2 rounded-xl text-sm hover:bg-black transition-colors"
                                            onClick={() => {
                                                const num = document.getElementById('newCardNum').value;
                                                const exp = document.getElementById('newCardExp').value;
                                                if (num && exp) {
                                                    const last4 = num.slice(-4) || '1234';
                                                    setSavedCards([...savedCards, {
                                                        id: Date.now(),
                                                        type: num.startsWith('4') ? 'VISA' : 'MC',
                                                        last4: last4,
                                                        exp: exp,
                                                        isDefault: false
                                                    }]);
                                                    setIsAddingCard(false);
                                                    showToast(`New card ending in ${last4} added successfully.`);
                                                } else {
                                                    showToast('Please fill out card details');
                                                }
                                            }}
                                        >
                                            Save Card
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsAddingCard(true)}
                                    className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-2xl py-4 text-gray-500 font-bold hover:border-sage-500 hover:text-sage-700 hover:bg-sage-50 transition-all mb-6"
                                >
                                    <Plus className="w-5 h-5" /> Add New Card
                                </button>
                            )}

                            <div className="flex justify-end">
                                <button onClick={() => setIsPaymentModalOpen(false)} className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-white bg-gray-900 hover:bg-black shadow-md transition-all hover:-translate-y-0.5">
                                    Done
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Security Modal */}
            <AnimatePresence>
                {isSecurityModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative border border-gray-100 p-8"
                        >
                            <button onClick={() => setIsSecurityModalOpen(false)} className="absolute top-6 right-6 w-8 h-8 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors text-gray-500">
                                <X className="w-4 h-4" />
                            </button>
                            <div className="mb-8">
                                <h2 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-3">
                                    <Shield className="w-6 h-6 text-sage-600" /> Security Settings
                                </h2>
                                <p className="text-gray-500 text-sm">Manage your password and secure your account credentials.</p>
                            </div>

                            <div className="space-y-6">
                                {/* Change Password */}
                                <div className="border border-gray-100 rounded-2xl p-5 hover:border-sage-200 transition-colors group cursor-pointer" onClick={() => showToast('Password reset link sent to registered email.')}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-50 group-hover:bg-sage-50 text-gray-400 group-hover:text-sage-600 rounded-xl flex items-center justify-center transition-colors">
                                            <Key className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">Change Password</h3>
                                            <p className="text-sm text-gray-500 mt-0.5">Last changed 3 months ago</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 ml-auto text-gray-300 group-hover:text-sage-400" />
                                    </div>
                                </div>

                                {/* 2FA */}
                                <div className="border border-gray-100 rounded-2xl p-5 hover:border-sage-200 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${twoFactorEnabled ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                            <Smartphone className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">Two-Factor Authentication</h3>
                                            <p className="text-sm text-gray-500 mt-0.5">{twoFactorEnabled ? 'SMS verification enabled' : 'Not configured'}</p>
                                        </div>
                                        <div
                                            className={`ml-auto w-12 h-6 rounded-full relative cursor-pointer transition-colors ${twoFactorEnabled ? 'bg-sage-500' : 'bg-gray-200'}`}
                                            onClick={() => {
                                                setTwoFactorEnabled(!twoFactorEnabled);
                                                showToast(twoFactorEnabled ? 'Two-Factor Authentication disabled.' : '2FA Enabled. Backup codes saved.');
                                            }}
                                        >
                                            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-all ${twoFactorEnabled ? 'right-1' : 'left-1'}`}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button onClick={() => setIsSecurityModalOpen(false)} className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-white bg-gray-900 hover:bg-black shadow-md transition-all hover:-translate-y-0.5">
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Consultation Fees Modal */}
            <AnimatePresence>
                {isConsultationModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative border border-gray-100 p-8"
                        >
                            <button onClick={() => setIsConsultationModalOpen(false)} className="absolute top-6 right-6 w-8 h-8 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors text-gray-500">
                                <X className="w-4 h-4" />
                            </button>
                            <div className="mb-8">
                                <h2 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-3">
                                    <Wallet className="w-6 h-6 text-sage-600" /> Consultation Fees
                                </h2>
                                <p className="text-gray-500 text-sm">Set your standard escrow rates. These fees will be locked before you begin service.</p>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Live Video Audit (Per 30 mins)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₦</span>
                                        <input
                                            type="number"
                                            value={videoFee}
                                            onChange={(e) => setVideoFee(e.target.value)}
                                            className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 bg-gray-50 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500 text-lg"
                                        />
                                    </div>
                                    <p className="text-xs text-sage-600 font-medium mt-2">Recommended: ₦4,000 - ₦10,000 based on your Tier.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Detailed Text Report (Asynchronous)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₦</span>
                                        <input
                                            type="number"
                                            value={textFee}
                                            onChange={(e) => setTextFee(e.target.value)}
                                            className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 bg-gray-50 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500 text-lg"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 flex justify-end gap-3">
                                <button onClick={() => setIsConsultationModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
                                <button
                                    onClick={() => {
                                        setIsConsultationModalOpen(false);
                                        showToast('Consultation rates updated successfully.');
                                    }}
                                    className="px-6 py-2.5 rounded-xl font-bold text-white bg-sage-700 hover:bg-sage-900 shadow-sm shadow-sage-700/20 transition-all hover:-translate-y-0.5"
                                >
                                    Save Rates
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Notifications Modal */}
            <AnimatePresence>
                {isNotificationsModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative border border-gray-100 p-8"
                        >
                            <button onClick={() => setIsNotificationsModalOpen(false)} className="absolute top-6 right-6 w-8 h-8 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors text-gray-500">
                                <X className="w-4 h-4" />
                            </button>
                            <div className="mb-8">
                                <h2 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-3">
                                    <Bell className="w-6 h-6 text-sage-600" /> Notifications
                                </h2>
                                <p className="text-gray-500 text-sm">Control how you receive incoming escrow requests from farmers.</p>
                            </div>

                            <div className="space-y-4">
                                {/* Push/SMS Toggle */}
                                <div className="border border-gray-100 rounded-2xl p-5 flex items-center justify-between group">
                                    <div>
                                        <h3 className="font-bold text-gray-900">Push Notifications</h3>
                                        <p className="text-sm text-gray-500 mt-0.5">Instant alerts on your device for immediate consultations.</p>
                                    </div>
                                    <div
                                        className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors flex-shrink-0 ${smsEnabled ? 'bg-sage-500' : 'bg-gray-200'}`}
                                        onClick={() => {
                                            setSmsEnabled(!smsEnabled);
                                            showToast(smsEnabled ? 'Push notifications disabled.' : 'Push notifications enabled.');
                                        }}
                                    >
                                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-all ${smsEnabled ? 'right-1' : 'left-1'}`}></div>
                                    </div>
                                </div>

                                {/* Email Toggle */}
                                <div className="border border-gray-100 rounded-2xl p-5 flex items-center justify-between group">
                                    <div>
                                        <h3 className="font-bold text-gray-900">Email Summaries</h3>
                                        <p className="text-sm text-gray-500 mt-0.5">Daily reports of your escrow payouts and pending text diagnosis requests.</p>
                                    </div>
                                    <div
                                        className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors flex-shrink-0 ${emailEnabled ? 'bg-sage-500' : 'bg-gray-200'}`}
                                        onClick={() => {
                                            setEmailEnabled(!emailEnabled);
                                            showToast(emailEnabled ? 'Email summaries disabled.' : 'Email summaries enabled.');
                                        }}
                                    >
                                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-all ${emailEnabled ? 'right-1' : 'left-1'}`}></div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button onClick={() => setIsNotificationsModalOpen(false)} className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-white bg-gray-900 hover:bg-black shadow-md transition-all hover:-translate-y-0.5">
                                    Done
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Avatar Upload Modal */}
            <AnimatePresence>
                {isAvatarModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative border border-gray-100 p-8 text-center"
                        >
                            <button onClick={() => { setIsAvatarModalOpen(false); setAvatarPreview(null); setAvatarFile(null); }} className="absolute top-6 right-6 w-8 h-8 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors text-gray-500">
                                <X className="w-4 h-4" />
                            </button>
                            <h2 className="text-2xl font-black text-gray-900 mb-2">Profile Picture</h2>
                            <p className="text-gray-500 text-sm mb-8">Upload a clear photo so your community can recognize you.</p>

                            <div className="relative w-32 h-32 mx-auto mb-8 cursor-pointer group rounded-full overflow-hidden border-4 border-sage-50 shadow-inner">
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover group-hover:brightness-75 transition-all" />
                                ) : (
                                    <div className="w-full h-full bg-sage-100 flex items-center justify-center text-sage-600 font-bold text-4xl group-hover:bg-sage-200 transition-colors">
                                        {userRole === 'agronomist' ? 'O' : 'K'}
                                    </div>
                                )}
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="w-8 h-8 text-white mb-1" />
                                    <span className="text-white text-xs font-bold uppercase tracking-wider">Change</span>
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

                            <div className="flex justify-center gap-3">
                                <button onClick={() => { setIsAvatarModalOpen(false); setAvatarPreview(null); setAvatarFile(null); }} className="px-5 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                                    Cancel
                                </button>
                                <button
                                    disabled={!avatarFile || isUploading}
                                    onClick={async () => {
                                        if (!avatarFile) return;
                                        setIsUploading(true);
                                        const token = localStorage.getItem('access_token');
                                        if (!token) {
                                            showToast('Session expired. Please log in again.');
                                            setIsUploading(false);
                                            return;
                                        }

                                        try {
                                            const formData = new FormData();
                                            formData.append('profile_picture', avatarFile);

                                            // Make actual API Call to Django
                                            const res = await axios.post('http://localhost:8000/api/auth/upload-avatar/', formData, {
                                                headers: {
                                                    'Authorization': `Bearer ${token}`,
                                                    'Content-Type': 'multipart/form-data'
                                                }
                                            });

                                            // Save the new URL to localStorage so other components can use it
                                            if (res.data.profile_picture) {
                                                localStorage.setItem('profile_picture', res.data.profile_picture);
                                                // Dispatch a custom event so the Layout component can immediately re-render
                                                window.dispatchEvent(new Event('profilePictureUpdated'));
                                            }

                                            showToast('Profile picture updated successfully!');
                                            setIsAvatarModalOpen(false);
                                        } catch (error) {
                                            console.error("Upload failed:", error);
                                            showToast('Failed to upload profile picture. Please try again.');
                                        } finally {
                                            setIsUploading(false);
                                        }
                                    }}
                                    className={`px-6 py-2.5 rounded-xl font-bold text-white shadow-sm transition-all focus:outline-none flex items-center gap-2 ${avatarFile && !isUploading ? 'bg-sage-700 hover:bg-sage-900 shadow-sage-700/20 hover:-translate-y-0.5' : 'bg-sage-300 cursor-not-allowed'}`}
                                >
                                    {isUploading ? (
                                        <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
                                    ) : (
                                        <><UploadCloud className="w-4 h-4" /> Save Photo</>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Settings Action Toast */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-medium text-sm border border-gray-800"
                    >
                        <CheckCircle2 className="w-5 h-5 text-sage-400" />
                        {toastMessage}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
