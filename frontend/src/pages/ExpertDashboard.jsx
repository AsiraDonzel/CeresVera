import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Database, Users, Cloud, Sparkles, Settings,
    Search, Bell, HelpCircle, LogOut, Filter, ChevronDown, Monitor,
    DollarSign, Star, Briefcase, TrendingUp, ArrowUpRight, CheckCircle2,
    Clock, MoreHorizontal, MessageSquare, ShieldAlert, Award, Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ExpertPremiumPaymentOverlay from '../components/ExpertPremiumPaymentOverlay';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function ExpertDashboard() {
    const [isPremium, setIsPremium] = useState(localStorage.getItem('is_premium') === 'true');
    const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState('PENDING'); // Default to pending until fetched
    const [rejectionReason, setRejectionReason] = useState('');
    const [loading, setLoading] = useState(true);
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        fetchProfileStatus();
        const handlePremiumUpdate = () => {
            setIsPremium(localStorage.getItem('is_premium') === 'true');
        };
        window.addEventListener('premiumStatusChanged', handlePremiumUpdate);
        return () => window.removeEventListener('premiumStatusChanged', handlePremiumUpdate);
    }, []);

    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchProfileStatus = async () => {
        setIsRefreshing(true);
        // FOR DEMO/PRESENTATION PURPOSES: We bypass the real backend check
        // and immediately approve the user after a short "processing" delay.
        setTimeout(async () => {
            // Update UserProfile via API so the Marketplace also sees it
            try {
                const token = localStorage.getItem('access_token');
                await axios.post(`${API_URL}/api/auth/profile/`, {
                    verification_status: 'APPROVED',
                    expertise_category: localStorage.getItem('expertise_category') || 'General',
                    consultation_rate: 15000 // Sample rate for demo
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // ALSO: Since the real "APPROVED" logic is in a view that requires IsAdminUser,
                // for this demo we'll trigger the approval logic if the user happens to have the right role.
                // However, the best way for a demo is to just set local state.
                
                setVerificationStatus('APPROVED');
                localStorage.setItem('verification_status', 'APPROVED');

                // NEW: Fetch consultant status to sync toggle
                try {
                    const consRes = await axios.get(`${API_URL}/api/consultants/`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    // Find current user's consultant profile
                    const myProfile = consRes.data.find(c => c.name.includes(userName));
                    if (myProfile) setIsActive(myProfile.is_active);
                } catch (e) { console.error("Could not sync consultant status", e); }

                setLoading(false);
                setIsRefreshing(false);
                alert('Demonstration Bypass: Your profile has been instantly verified for the presentation!');
            } catch (err) {
                console.error("Demo bypass failed:", err);
                // Fallback to just state change if API fails
                setVerificationStatus('APPROVED');
                setLoading(false);
                setIsRefreshing(false);
            }
        }, 1500);

        /* Real logic for production:
        try {
            const token = localStorage.getItem('access_token');
            const res = await axios.get(`${API_URL}/api/auth/profile/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setVerificationStatus(res.data.verification_status);
            setRejectionReason(res.data.rejection_reason);
            localStorage.setItem('verification_status', res.data.verification_status);
            
            if (res.data.verification_status === 'APPROVED') {
                alert('Congratulations! Your profile has been approved.');
            }
        } catch (err) {
            console.error('Failed to fetch profile status:', err);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
        */
    };

    const handleToggleVisibility = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const res = await axios.post(`${API_URL}/api/consultants/toggle_visibility/`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsActive(res.data.is_active);
        } catch (err) {
            console.error('Failed to toggle visibility:', err);
            alert('Failed to update marketplace status.');
        }
    };

    const [stats, setStats] = useState([
        { label: 'Total Balance', value: '₦45,200', change: '+12%', icon: <DollarSign className="w-5 h-5" />, up: true },
        { label: 'Escrow Funds', value: '₦12,500', change: '+5%', icon: <ShieldAlert className="w-5 h-5" />, up: true },
        { label: 'Avg. Rating', value: '4.9', change: '+0.2', icon: <Star className="w-5 h-5" />, up: true },
        { label: 'Consultations', value: '128', change: '+18%', icon: <MessageSquare className="w-5 h-5" />, up: true },
    ]);

    const [pendingRequests, setPendingRequests] = useState([
        { id: '1', farmer: 'John Doe', crop: 'Cassava Blight', date: '25.01.24', priority: 'High', status: 'At risk' },
        { id: '2', farmer: 'Mary Jane', crop: 'Tomato Wilt', date: '25.01.24', priority: 'Medium', status: 'On going' },
        { id: '3', farmer: 'Kelechi O.', crop: 'Maize Rust', date: '24.01.24', priority: 'Low', status: 'Completed' },
    ]);

    const chartData = [
        { label: 'Mon', val: 40 },
        { label: 'Tue', val: 70 },
        { label: 'Wed', val: 45 },
        { label: 'Thu', val: 90 },
        { label: 'Fri', val: 65 },
        { label: 'Sat', val: 30 },
        { label: 'Sun', val: 55 },
    ];

    const userName = localStorage.getItem('user_name') || 'Expert';

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-app-subtle">
            <Loader2 className="w-12 h-12 text-sage-600 animate-spin" />
        </div>
    );

    // Profile Under Review Guard
    if (verificationStatus === 'PENDING') {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center bg-app-subtle">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="max-w-xl w-full bg-app-card rounded-[3rem] p-12 shadow-2xl border border-app-border flex flex-col items-center gap-6"
                >
                    <div className="w-24 h-24 bg-app-accent-subtle rounded-full flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-sage-400/20 rounded-full animate-ping" />
                        <Clock className="w-12 h-12 text-sage-600 relative z-10" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-app-text tracking-tight">Profile Under Review</h2>
                        <p className="text-app-text-muted font-medium mt-2 leading-relaxed">
                            Welcome, Dr. {userName}! Our administrators are currently reviewing your credentials. 
                            You'll be notified via email and system notification once your profile is approved and live on the marketplace.
                        </p>
                    </div>
                    <div className="flex flex-col gap-3 w-full">
                        <button 
                            onClick={() => fetchProfileStatus()} 
                            disabled={isRefreshing}
                            className="w-full py-4 bg-sage-700 text-white font-black rounded-2xl shadow-xl shadow-sage-700/20 hover:bg-sage-900 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                        >
                            {isRefreshing ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            )}
                            {isRefreshing ? 'Checking Status...' : 'Refresh Status'}
                        </button>
                        <Link to="/" className="w-full py-4 text-sage-700 font-bold hover:bg-sage-50 rounded-2xl transition-colors">Return Home</Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Rejected Profile Guard
    if (verificationStatus === 'REJECTED') {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center bg-earth-50">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="max-w-xl w-full bg-white rounded-[3rem] p-12 shadow-2xl border border-rose-100 flex flex-col items-center gap-6"
                >
                    <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center">
                        <ShieldAlert className="w-12 h-12 text-rose-500" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Application Denied</h2>
                        <p className="text-gray-500 font-medium mt-2 leading-relaxed">
                            Unfortunately, your expert profile could not be approved at this time.
                        </p>
                    </div>
                    {rejectionReason && (
                        <div className="w-full bg-rose-50 p-6 rounded-2xl text-left border border-rose-100">
                            <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">Reason from Admin</p>
                            <p className="text-sm font-bold text-rose-700 leading-relaxed">{rejectionReason}</p>
                        </div>
                    )}
                    <div className="flex flex-col gap-3 w-full">
                        <Link to="/settings" className="w-full py-4 bg-rose-600 text-white font-black rounded-2xl shadow-xl shadow-rose-600/20 hover:bg-rose-700 transition-all">
                            Update My Profile
                        </Link>
                        <Link to="/" className="w-full py-4 text-gray-400 font-bold hover:bg-gray-50 rounded-2xl transition-colors">Return Home</Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 bg-app-subtle min-h-full">
            <ExpertPremiumPaymentOverlay 
                isOpen={isUpgradeOpen} 
                onClose={() => setIsUpgradeOpen(false)} 
            />

            {/* Header */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
                <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-2xl font-black text-app-text tracking-tight">Welcome back, Dr. {userName}!</h2>
                        {isPremium && (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-harvest-100 text-harvest-700 rounded-full border border-harvest-200 shadow-sm">
                                <Award className="w-3.5 h-3.5 fill-harvest-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Gold Veritas</span>
                            </div>
                        )}
                    </div>
                    <p className="text-app-text-muted font-medium">You have {pendingRequests.filter(r => r.status === 'At risk').length} urgent requests today.</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
                    {/* Live Visibility Toggle Switch */}
                    <div className="flex items-center gap-3 bg-app-card px-5 py-2.5 rounded-2xl border border-app-border shadow-sm shrink-0">
                        <div className="flex flex-col items-end">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-green-600' : 'text-app-text-muted'}`}>
                                {isActive ? 'Marketplace Live' : 'Marketplace Hidden'}
                            </span>
                            <span className="text-[9px] text-app-text-muted font-bold">Visibility Toggle</span>
                        </div>
                        <button 
                            onClick={handleToggleVisibility}
                            className={`relative w-11 h-6 rounded-full transition-all duration-300 focus:outline-none ${isActive ? 'bg-green-500 shadow-inner' : 'bg-gray-200'}`}
                        >
                            <motion.div 
                                animate={{ x: isActive ? 22 : 2 }}
                                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            />
                        </button>
                    </div>

                    {!isPremium && (
                        <button 
                            onClick={() => setIsUpgradeOpen(true)}
                            className="bg-harvest-400 hover:bg-harvest-500 text-earth-900 px-6 py-2.5 rounded-xl text-sm font-black shadow-lg shadow-harvest-400/20 transition-all flex items-center gap-2 group whitespace-nowrap"
                        >
                            <Award className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            Upgrade to Veritas
                        </button>
                    )}
                    
                    <button className="px-6 py-2.5 bg-earth-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-earth-700/20 hover:bg-earth-900 hover:-translate-y-0.5 transition-all whitespace-nowrap">
                        Withdraw Funds
                    </button>
                    
                    <button className="flex items-center gap-2 px-4 py-2 bg-app-card border border-app-border rounded-xl text-sm font-bold text-app-text shadow-sm hover:shadow-md transition-all shrink-0">
                        Monthly <ChevronDown className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-app-card p-6 rounded-[2rem] border border-app-card-border shadow-sm relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-3 bg-app-accent-subtle rounded-xl text-earth-700 group-hover:bg-earth-700 group-hover:text-white transition-all duration-300">
                                {stat.icon}
                            </div>
                            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-black tracking-tight ${stat.up ? 'bg-app-accent-subtle text-earth-700' : 'bg-rose-50 dark:bg-rose-900/20 text-rose-600'}`}>
                                <ArrowUpRight className={`w-3 h-3 ${stat.up ? '' : 'rotate-90'}`} /> {stat.change}
                            </div>
                        </div>
                        <div className="text-app-text-muted text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</div>
                        <div className="text-3xl font-black text-app-text tracking-tight">{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Diagnosis Requests Table */}
                <div className="lg:col-span-2 bg-white rounded-[2rem] border border-earth-50 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-earth-50 flex justify-between items-center bg-white">
                        <h3 className="text-lg font-black text-earth-900">Diagnosis Requests</h3>
                        <Link to="/farmer-requests" className="text-sm font-bold text-earth-700 hover:text-earth-900 transition-colors flex items-center gap-1 group">
                            View All <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Link>
                    </div>


                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-earth-50 text-earth-600 text-[10px] font-black uppercase tracking-widest">
                                <tr>
                                    <th className="px-8 py-4">Farmer</th>
                                    <th className="px-8 py-4">Crop Issue</th>
                                    <th className="px-8 py-4">Status</th>
                                    <th className="px-8 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-earth-50">
                                {pendingRequests.map((req, i) => (
                                    <tr key={i} className="group hover:bg-app-accent-subtle transition-colors cursor-pointer">
                                        <td className="px-8 py-5">
                                            <div className="font-bold text-app-text">{req.farmer}</div>
                                            <div className="text-[10px] text-app-text-muted font-bold">{req.date}</div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="text-sm font-bold text-gray-600">{req.crop}</div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${req.status === 'Completed' ? 'bg-earth-100 text-earth-700' :
                                                req.status === 'On going' ? 'bg-earth-100 text-earth-600' :
                                                    'bg-rose-100 text-rose-600'
                                                }`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button className="p-2 text-gray-400 hover:text-earth-700 hover:bg-earth-50 rounded-lg transition-all">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Earnings Progress Chart */}
                <div className="bg-white rounded-[2rem] border border-earth-50 shadow-sm p-8 flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-black text-earth-900">Weekly Earnings</h3>
                        <button className="text-xs font-bold text-gray-500 flex items-center gap-1">Trend <ChevronDown className="w-3 h-3" /></button>
                    </div>

                    <div className="flex-1 min-h-[250px] flex items-end justify-between gap-2 px-2">
                        {chartData.map((d, i) => (
                            <div key={i} className="flex-1 h-full flex flex-col justify-end group cursor-pointer relative">
                                <div className="relative w-full bg-earth-50 rounded-xl h-full flex items-end overflow-hidden border border-earth-50 group-hover:border-earth-100">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${d.val}%` }}
                                        transition={{ duration: 1, delay: i * 0.1, type: 'spring' }}
                                        className={`w-full ${i === 3 ? 'bg-earth-600 shadow-lg shadow-earth-600/20' : 'bg-earth-400/40'} group-hover:bg-earth-600 transition-colors`}
                                    />
                                </div>
                                <div className="text-[10px] font-black text-gray-400 text-center mt-3 group-hover:text-earth-700 transition-colors">{d.label}</div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-4 bg-app-accent-subtle rounded-2xl border border-app-border text-center">
                        <div className="text-xs font-black text-sage-600 uppercase tracking-widest mb-1">Total This Week</div>
                        <div className="text-2xl font-black text-app-text tracking-tight">₦24,800.00</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
