import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Database, Users, Cloud, Sparkles, Settings,
    Search, Bell, HelpCircle, LogOut, Filter, ChevronDown, Monitor,
    DollarSign, Star, Briefcase, TrendingUp, ArrowUpRight, CheckCircle2,
    Clock, MoreHorizontal, MessageSquare, ShieldAlert
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ExpertDashboard() {
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

    return (
        <div className="p-8 space-y-8 bg-earth-50 min-h-full">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h2 className="text-2xl font-black text-earth-900">Welcome back, Dr. {userName}!</h2>
                    <p className="text-gray-500 font-medium">You have {pendingRequests.filter(r => r.status === 'At risk').length} urgent requests today.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-6 py-2.5 bg-earth-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-earth-700/20 hover:bg-earth-900 hover:-translate-y-0.5 transition-all">
                        Withdraw Funds
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-earth-100 rounded-xl text-sm font-bold text-earth-700 shadow-sm hover:shadow-md transition-all">
                        Monthly <ChevronDown className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2rem] border border-earth-50 shadow-sm relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-3 bg-earth-50 rounded-xl text-earth-700 group-hover:bg-earth-700 group-hover:text-white transition-all duration-300">
                                {stat.icon}
                            </div>
                            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-black tracking-tight ${stat.up ? 'bg-earth-50 text-earth-700' : 'bg-rose-50 text-rose-600'}`}>
                                <ArrowUpRight className={`w-3 h-3 ${stat.up ? '' : 'rotate-90'}`} /> {stat.change}
                            </div>
                        </div>
                        <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</div>
                        <div className="text-3xl font-black text-earth-900 tracking-tight">{stat.value}</div>
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
                                    <tr key={i} className="group hover:bg-earth-50 transition-colors cursor-pointer">
                                        <td className="px-8 py-5">
                                            <div className="font-bold text-earth-900">{req.farmer}</div>
                                            <div className="text-[10px] text-gray-400 font-bold">{req.date}</div>
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

                    <div className="mt-8 p-4 bg-earth-50 rounded-2xl border border-earth-50 text-center">
                        <div className="text-xs font-black text-earth-600 uppercase tracking-widest mb-1">Total This Week</div>
                        <div className="text-2xl font-black text-earth-900 tracking-tight">₦24,800.00</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
