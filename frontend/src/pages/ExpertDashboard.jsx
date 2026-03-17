import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Database, Users, Cloud, Sparkles, Settings,
    Search, Bell, HelpCircle, LogOut, Filter, ChevronDown, Monitor,
    DollarSign, Star, Briefcase, TrendingUp, ArrowUpRight, CheckCircle2,
    Clock, MoreHorizontal, MessageSquare, ShieldAlert, Award, Loader2, Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ExpertPremiumPaymentOverlay from '../components/ExpertPremiumPaymentOverlay';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function ExpertDashboard() {
    const [isPremium, setIsPremium] = useState(localStorage.getItem('is_premium') === 'true');
    const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const token = localStorage.getItem('access_token');
                if (token) {
                    const res = await axios.get(`${API_URL}/api/consultants/me/`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setIsActive(res.data.is_active);
                }
            } catch (err) {
                console.error('Failed to fetch expert status:', err);
            }
        };

        fetchStatus();

        const handlePremiumUpdate = () => {
            setIsPremium(localStorage.getItem('is_premium') === 'true');
        };
        window.addEventListener('premiumStatusChanged', handlePremiumUpdate);
        return () => window.removeEventListener('premiumStatusChanged', handlePremiumUpdate);
    }, []);

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

    const [pendingRequests, setPendingRequests] = useState([]);

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
    const userEmail = localStorage.getItem('user_email') || '';
    const userPhone = localStorage.getItem('user_phone') || '';
    const agronomistBio = localStorage.getItem('agronomistBio') || '';
    const experienceYears = localStorage.getItem('experience_years') || '';
    const linkedinUrl = localStorage.getItem('linkedin_url') || '';

    const maskEmail = (email) => {
        if (!email || email.length < 5) return email;
        const [local, domain] = email.split('@');
        if (!domain) return email;
        return local.slice(0, 2) + '***@' + domain;
    };
    const maskPhone = (phone) => {
        if (!phone || phone.length < 6) return phone;
        return phone.slice(0, 4) + '****' + phone.slice(-3);
    };


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

            {/* Expert Profile Card */}
            <div className="bg-app-card rounded-[2rem] border border-app-card-border shadow-sm p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-earth-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                <div className="flex items-center gap-3 mb-5">
                    <div className="p-2.5 bg-earth-50 rounded-xl">
                        <Briefcase className="w-5 h-5 text-earth-700" />
                    </div>
                    <div>
                        <h3 className="font-black text-app-text text-sm">Professional Profile</h3>
                        <p className="text-[10px] text-app-text-muted font-bold uppercase tracking-widest">Your Credentials</p>
                    </div>
                    <a href="/settings" className="ml-auto text-[10px] font-black text-earth-600 hover:text-earth-800 uppercase tracking-widest transition-colors relative z-10 px-3 py-2 rounded-lg hover:bg-earth-50 cursor-pointer">Edit →</a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Identity */}
                    <div className="bg-app-subtle rounded-xl p-4 border border-app-border flex items-center gap-3">
                        <div className="w-12 h-12 bg-earth-100 rounded-full flex items-center justify-center text-earth-700 font-black text-lg shrink-0">{userName.charAt(0).toUpperCase()}</div>
                        <div className="min-w-0">
                            <div className="text-sm font-bold text-app-text truncate">Dr. {userName}</div>
                            <div className="text-[10px] font-bold text-earth-600 uppercase tracking-widest">Expert Consultant</div>
                            {experienceYears && <div className="text-[10px] text-app-text-muted font-medium">{experienceYears} yrs experience</div>}
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="bg-app-subtle rounded-xl p-4 border border-app-border flex flex-col">
                        <div className="text-[9px] font-black text-app-text-muted uppercase tracking-widest mb-1">Bio & Specialties</div>
                        <div className="text-xs font-medium text-app-text leading-relaxed line-clamp-3 flex-1">{agronomistBio || 'No bio set. Update your profile in Settings.'}</div>
                        {linkedinUrl && (
                            <a href={linkedinUrl} target="_blank" rel="noopener" className="mt-2 text-[10px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-widest">LinkedIn →</a>
                        )}
                    </div>
                </div>
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
                                {pendingRequests.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-12 text-center text-gray-500 font-medium">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="w-16 h-16 bg-earth-50 rounded-full flex items-center justify-center mb-4">
                                                    <LayoutDashboard className="w-8 h-8 text-earth-300" />
                                                </div>
                                                <p>No active diagnosis requests.</p>
                                                <p className="text-sm mt-1 text-app-text-muted text-gray-400">When farmers consult you, their requests will appear here.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    pendingRequests.map((req, i) => (
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
                                    ))
                                )}
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

            {/* Expert Circles Section */}
            <div className={`mt-8 bg-white rounded-[2rem] border overflow-hidden relative ${isPremium ? 'border-harvest-200 shadow-lg shadow-harvest-100/50' : 'border-app-border shadow-sm'}`}>
                {/* Header */}
                <div className={`p-8 border-b flex justify-between items-center ${isPremium ? 'border-harvest-100 bg-harvest-50/30' : 'border-app-border bg-gray-50'}`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-2xl ${isPremium ? 'bg-harvest-100 text-harvest-600' : 'bg-gray-200 text-gray-500'}`}>
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className={`text-xl font-black ${isPremium ? 'text-harvest-900' : 'text-gray-900'}`}>Expert Circles</h3>
                            <p className="text-sm text-gray-500 font-medium">Collaborate, refer clients, and share knowledge with elite peers.</p>
                        </div>
                    </div>
                    {isPremium && (
                        <button className="px-5 py-2.5 bg-harvest-600 hover:bg-harvest-700 text-white rounded-xl text-sm font-bold shadow-md shadow-harvest-600/20 transition-all flex items-center gap-2">
                            <Sparkles className="w-4 h-4" /> Explore Circles
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="p-8 relative">
                    {!isPremium && (
                        <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] flex items-center justify-center p-8">
                            <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 max-w-md text-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                                    <Lock className="w-8 h-8 text-gray-400" />
                                </div>
                                <h4 className="text-xl font-black text-gray-900 mb-2">Veritas Premium Required</h4>
                                <p className="text-gray-500 text-sm mb-6">Unlock Expert Circles to network with top-tier agronomists, share difficult cases, and build your referral network.</p>
                                <button 
                                    onClick={() => setIsUpgradeOpen(true)}
                                    className="w-full py-3 bg-harvest-500 hover:bg-harvest-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-harvest-500/20"
                                >
                                    <Award className="w-4 h-4" /> Upgrade to Access
                                </button>
                            </div>
                        </div>
                    )}

                    <div className={`grid md:grid-cols-3 gap-6 ${!isPremium && 'opacity-30 pointer-events-none filter blur-[1px] select-none py-8'}`}>
                        {/* Circle Cards mocked layout */}
                        {[
                            { title: 'Tropical Pathogenesis', members: 142, active: 12, topic: 'Disease' },
                            { title: 'Soil Enrichment strategies', members: 89, active: 5, topic: 'Soil' },
                            { title: 'Livestock Health Hub', members: 215, active: 24, topic: 'Livestock' },
                        ].map((circle, i) => (
                            <div key={i} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-harvest-200 transition-colors cursor-pointer group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="text-[10px] font-black text-harvest-600 bg-harvest-100 px-2 py-0.5 rounded-md uppercase tracking-widest">{circle.topic}</div>
                                    <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold bg-white px-2 py-0.5 rounded-full border border-gray-200">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> {circle.active} Active
                                    </div>
                                </div>
                                <h4 className="font-bold text-gray-900 mb-2 group-hover:text-harvest-700 transition-colors">{circle.title}</h4>
                                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                                    <div className="flex -space-x-2">
                                        {[1,2,3].map(j => (
                                            <img key={j} src={`https://i.pravatar.cc/150?u=${i*10+j}`} className="w-6 h-6 rounded-full border border-white" alt=""/>
                                        ))}
                                    </div>
                                    <div className="text-xs font-bold text-gray-500">{circle.members} members</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
