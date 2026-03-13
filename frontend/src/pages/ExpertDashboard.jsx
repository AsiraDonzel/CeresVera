import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Clock,
    CheckCircle,
    MessageCircle,
    Video,
    TrendingUp,
    DollarSign,
    ShieldCheck,
    Users,
    User,
    MoreVertical,
    Phone,
    X,
    Mic,
    Video as VideoIcon,
    Star,
    Sparkles,
    ArrowRight
} from 'lucide-react';

export default function ExpertDashboard() {
    const [activeVideoCall, setActiveVideoCall] = useState(null);

    // Mock Data for the Agronomist
    const stats = [
        { label: 'Available Balance', value: '₦145,000', change: '+12%', icon: <DollarSign className="w-6 h-6 text-earth-600" /> },
        { label: 'Escrow Locked', value: '₦32,500', change: '3 Pending', icon: <ShieldCheck className="w-6 h-6 text-sage-600" /> },
        { label: 'Total Consultations', value: '128', change: '+24 this month', icon: <Users className="w-6 h-6 text-blue-600" /> },
        { label: 'Average Rating', value: '4.9', change: 'Top 5%', icon: <Star className="w-6 h-6 text-amber-500" /> },
    ];

    const pendingRequests = [
        { id: 1, farmer: 'Ibrahim Musa', crop: 'Cassava', issue: 'Suspected Brown Streak', time: '2 hours ago', amount: '₦4,500', status: 'Payment in Escrow' },
        { id: 2, farmer: 'Oluwaseun Farms', crop: 'Maize', issue: 'Fall Armyworm infestation', time: '5 hours ago', amount: '₦7,000', status: 'Payment in Escrow' },
        { id: 3, farmer: 'Chidi Okonkwo', crop: 'Tomato', issue: 'Early Blight visual check', time: '1 day ago', amount: '₦5,000', status: 'Payment in Escrow' },
    ];

    const recentDiagnoses = [
        { id: 101, farmer: 'Aminu Kano', crop: 'Sorghum', diagnosis: 'Anthracnose', date: 'Oct 11, 2026', earnings: '₦5,000', status: 'Escrow Released' },
        { id: 102, farmer: 'Mama Blessing', crop: 'Yam', diagnosis: 'Mosaic Virus', date: 'Oct 10, 2026', earnings: '₦4,500', status: 'Escrow Released' },
        { id: 103, farmer: 'Taiwo AgriTech', crop: 'Rice', diagnosis: 'Rice Blast', date: 'Oct 08, 2026', earnings: '₦6,000', status: 'Escrow Released' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <div className="min-h-screen bg-earth-50 pt-24 pb-12 relative overflow-hidden">

            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-sage-200/40 rounded-full blur-[120px] -z-10 mix-blend-multiply opacity-70"></div>
            <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-earth-200/50 rounded-full blur-[100px] -z-10 mix-blend-multiply opacity-50"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4"
                >
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage-100 text-sage-800 text-xs font-bold uppercase tracking-wider">
                                <span className="w-2 h-2 rounded-full bg-sage-500 animate-pulse"></span>
                                Agronomist Portal
                            </div>
                            {localStorage.getItem('is_premium') === 'true' && (
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest border border-amber-200 shadow-sm">
                                    <ShieldCheck className="w-3 h-3" /> Gold Veritas
                                </div>
                            )}
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Expert Dashboard</h1>
                        <p className="mt-2 text-lg text-gray-600">Welcome back, Dr. Okafor. You have 3 pending consultations.</p>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                        <Link to="/predictive-analytics" className="px-5 py-2.5 bg-amber-500 text-white font-bold rounded-xl shadow-md hover:bg-amber-600 transition-all hover:-translate-y-0.5 flex items-center gap-2">
                             <Sparkles className="w-4 h-4" /> Yield AI
                        </Link>
                        <Link to="/expert-circles" className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-all flex items-center gap-2">
                            <Users className="w-4 h-4" /> Circles
                        </Link>
                        <Link to="/schedule" className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center gap-2">
                            <Clock className="w-4 h-4" /> Schedule
                        </Link>
                        <Link to="/payouts" className="px-5 py-2.5 bg-gray-900 text-white font-bold rounded-xl shadow-md hover:bg-black transition-all hover:-translate-y-0.5 shadow-gray-900/20 flex items-center justify-center">
                            Withdraw
                        </Link>
                    </div>
                </motion.div>

                {/* KPI Stats Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
                >
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            variants={itemVariants}
                            whileHover={{ y: -4, transition: { duration: 0.2 } }}
                            className="bg-white/80 backdrop-blur-xl border border-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group"
                        >
                            <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
                                {stat.icon}
                            </div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 rounded-2xl bg-gray-50 inline-block border border-gray-100">
                                    {stat.icon}
                                </div>
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${idx === 1 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                                    {stat.change}
                                </span>
                            </div>
                            <h3 className="text-gray-500 font-medium text-sm mb-1">{stat.label}</h3>
                            <div className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</div>
                        </motion.div>
                    ))}
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Feed: Pending Requests */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                Action Required <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">3</span>
                            </h2>
                            <Link to="/schedule" className="text-sm font-bold text-sage-700 hover:text-sage-900 transition-colors">View all</Link>
                        </div>

                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className="space-y-4"
                        >
                            {pendingRequests.map((req) => (
                                <motion.div
                                    key={req.id}
                                    variants={itemVariants}
                                    className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
                                >
                                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                                        <div className="flex gap-4 items-center">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sage-100 to-earth-200 flex items-center justify-center font-bold text-sage-800 border-2 border-white shadow-sm shrink-0">
                                                {req.farmer.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-lg group-hover:text-sage-700 transition-colors">{req.farmer}</h3>
                                                <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                                    <span className="flex items-center gap-1 font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md"><ShieldCheck className="w-3.5 h-3.5" /> {req.status}</span>
                                                    <span>•</span>
                                                    <span>{req.time}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <div className="text-xl font-black text-gray-900">{req.amount}</div>
                                            <div className="text-sm text-gray-500 font-medium">Fee</div>
                                        </div>
                                    </div>

                                    <div className="mt-5 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-1">Crop Issue</div>
                                        <p className="text-gray-800"><span className="font-medium text-sage-700">{req.crop}</span> — {req.issue}</p>
                                    </div>

                                    <div className="mt-5 flex gap-3">
                                        <button onClick={() => setActiveVideoCall(req)} className="flex-1 bg-sage-700 hover:bg-sage-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 shadow-sm shadow-sage-700/20">
                                            <Video className="w-4 h-4" /> Start Video Call
                                        </button>
                                        <button onClick={() => alert(`Starting secure chat session with ${req.farmer}...`)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                                            <MessageCircle className="w-4 h-4" /> Message Farmer
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Sidebar: Recent Activity & Graph Mock */}
                    <div className="space-y-8">

                        {/* Fake Graph Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-gray-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-sage-500 rounded-full blur-[60px] opacity-20"></div>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-lg">Earnings Trend</h3>
                                <MoreVertical className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className="h-32 flex items-end justify-between gap-2">
                                {/* Mock Bars */}
                                {[40, 65, 30, 85, 55, 90, 75].map((height, i) => (
                                    <div key={i} className="w-full bg-white/10 rounded-t-sm hover:bg-sage-500 transition-colors cursor-pointer group relative" style={{ height: `${height}%` }}>
                                        {/* Tooltip on hover */}
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-gray-900 text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                            ₦{(height * 200).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-4 text-xs font-medium text-gray-400">
                                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                            </div>
                        </motion.div>

                        {/* Recent Completed Diagnoses */}
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-gray-400" /> Recently Completed
                            </h3>
                            <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 p-2">
                                {recentDiagnoses.map((diag, idx) => (
                                    <div key={diag.id} className={`p-4 flex items-center justify-between hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer ${idx !== recentDiagnoses.length - 1 ? 'border-b border-gray-50' : ''}`}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-sage-50 flex items-center justify-center text-sage-600">
                                                <CheckCircle className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 text-sm">{diag.farmer}</div>
                                                <div className="text-xs text-gray-500">{diag.crop} • {diag.date}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-sage-700 text-sm">+{diag.earnings}</div>
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{diag.status}</div>
                                        </div>
                                    </div>
                                ))}
                                <Link to="/payouts" className="block w-full text-center py-3 text-sm font-bold text-sage-700 hover:text-sage-900 transition-colors mt-2">
                                    View full history
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>

            </div>

            {/* Premium Video Call Overlay Modal */}
            <AnimatePresence>
                {activeVideoCall && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            className="bg-black text-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl relative border border-gray-800"
                        >
                            <div className="absolute top-6 left-8 z-10">
                                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span> REC
                                </span>
                            </div>
                            <button onClick={() => setActiveVideoCall(null)} className="absolute top-6 right-8 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors backdrop-blur-md">
                                <X className="w-5 h-5" />
                            </button>

                            {/* Mock Video Feed Area */}
                            <div className="aspect-video bg-gray-900 relative flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-0"></div>
                                <div className="w-32 h-32 rounded-full bg-gray-800 border-4 border-gray-700 flex items-center justify-center z-10 shadow-xl">
                                    <User className="w-12 h-12 text-gray-500" />
                                </div>

                                {/* Self View PIP */}
                                <div className="absolute bottom-6 flex justify-between items-end w-full px-8 z-10">
                                    <div>
                                        <h3 className="font-bold text-xl">{activeVideoCall.farmer}</h3>
                                        <p className="text-gray-400 text-sm">Reviewing: {activeVideoCall.crop}</p>
                                    </div>
                                    <div className="w-24 h-36 bg-gray-800 rounded-2xl border-2 border-gray-600 shadow-xl flex items-center justify-center overflow-hidden">
                                        <span className="text-xs text-gray-500 font-bold uppercase">You</span>
                                    </div>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="p-6 bg-gray-950 flex justify-center gap-4">
                                <button className="w-14 h-14 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"><Mic className="w-6 h-6" /></button>
                                <button className="w-14 h-14 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"><VideoIcon className="w-6 h-6" /></button>
                                <button onClick={() => setActiveVideoCall(null)} className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center transition-colors shadow-lg shadow-red-900/50">
                                    <Phone className="w-6 h-6 fill-white rotate-135 transform" />
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
