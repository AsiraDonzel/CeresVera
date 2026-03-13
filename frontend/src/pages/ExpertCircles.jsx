import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Users, Lock, Send, Search, Filter, ShieldCheck, TrendingUp, MessageCircle } from 'lucide-react';

export default function ExpertCircles() {
    const isPremium = localStorage.getItem('is_premium') === 'true';
    const [activeTab, setActiveTab] = useState('Trending');
    const [searchTerm, setSearchTerm] = useState('');

    const circles = [
        { id: 1, title: 'West African Cocoa Blight', participants: 42, threads: 156, category: 'Research', growth: '+12%' },
        { id: 2, title: 'Predictive Oil Palm Yields', participants: 28, threads: 89, category: 'Analytics', growth: '+5%' },
        { id: 3, title: 'Organic Pest Control Alpha', participants: 15, threads: 44, category: 'Innovation', growth: '+22%' },
        { id: 4, title: 'Sustainable Irrigation Tech', participants: 31, threads: 112, category: 'Engineering', growth: '+8%' },
    ];

    const discussions = [
        { id: 101, author: 'Dr. Amina Okafor', role: 'Pathologist', content: 'Observed a new strain of mosaic virus in Cross River state. Seeking data from neighboring farms.', time: '2h ago', comments: 12, likes: 24, gold: true },
        { id: 102, author: 'Mr. Tunde Lawal', role: 'Soil Expert', content: 'The shift in rainfall patterns is significantly affecting nitrogen absorption in oil palms.', time: '5h ago', comments: 8, likes: 15, gold: false },
        { id: 103, author: 'Prof. S. Mensah', role: 'Entomologist', content: 'Proposed a biological deterrent for Fall Armyworm using localized neem extracts.', time: '1d ago', comments: 45, likes: 89, gold: true },
    ];

    if (!isPremium) {
        return (
            <div className="min-h-screen bg-earth-50 pt-32 pb-12 flex items-center justify-center px-4">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-white rounded-[3rem] p-10 shadow-2xl border border-amber-100 text-center relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-2 bg-amber-400"></div>
                    <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-10 h-10 text-amber-600" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Consultant Circles</h2>
                    <p className="text-gray-600 mb-8 leading-relaxed font-medium">
                        This is a premium-only networking hub where top-tier agronomists collaborate on complex cases. Upgrade your account to join the circle.
                    </p>
                    <button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-amber-200 transition-all active:scale-95 mb-4">
                        Unlock Premium Access
                    </button>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Access Private Case Studies & Research</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-earth-50 pt-24 pb-12">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest border border-amber-200 shadow-sm mb-3">
                            <ShieldCheck className="w-3 h-3" /> Alpha Circle Access
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Expert Circles</h1>
                        <p className="text-gray-600 mt-2 font-medium">Collaborate on the harvest with the world's leading agronomists.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Search research..." 
                                className="bg-white border border-gray-200 pl-11 pr-4 py-3 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-amber-500 outline-none w-64 shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-gray-200">
                            <MessageSquare className="w-4 h-4" /> Start Discussion
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar: Private Groups */}
                    <div className="space-y-6">
                        <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Your Circles</h2>
                        <div className="space-y-3">
                            {circles.map(circle => (
                                <motion.div 
                                    key={circle.id}
                                    whileHover={{ x: 4 }}
                                    className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm cursor-pointer group hover:border-amber-200 transition-colors"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-amber-50 transition-colors">
                                            <Users className="w-4 h-4 text-gray-600 group-hover:text-amber-600" />
                                        </div>
                                        <span className="text-[10px] font-bold text-green-600">{circle.growth}</span>
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-sm mb-1">{circle.title}</h3>
                                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase">
                                        <span>{circle.participants} Experts</span>
                                        <span>•</span>
                                        <span>{circle.threads} Threads</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Main Feed: Discussions */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="flex gap-4 border-b border-gray-200">
                            {['Trending', 'Latest', 'Case Studies', 'Saved'].map(tab => (
                                <button 
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-4 text-sm font-bold transition-all relative ${activeTab === tab ? 'text-amber-600' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    {tab}
                                    {activeTab === tab && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-1 bg-amber-600 rounded-full" />}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-4">
                            {discussions.map(post => (
                                <motion.div 
                                    key={post.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white p-6 rounded-[2rem] border border-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-md transition-shadow"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex gap-3 items-center">
                                            <div className="w-10 h-10 rounded-full bg-sage-50 border border-sage-100 flex items-center justify-center font-bold text-sage-800">
                                                {post.author.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-gray-900">{post.author}</span>
                                                    {post.gold && <ShieldCheck className="w-3.5 h-3.5 text-amber-500 fill-amber-50" />}
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{post.role} • {post.time}</span>
                                            </div>
                                        </div>
                                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                            <TrendingUp className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <p className="text-gray-700 leading-relaxed font-medium mb-6">
                                        {post.content}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                        <div className="flex gap-4">
                                            <button className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-amber-600 transition-colors bg-gray-50 px-3 py-1.5 rounded-full">
                                                <MessageCircle className="w-4 h-4" /> {post.comments} Comments
                                            </button>
                                            <button className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-red-600 transition-colors bg-gray-50 px-3 py-1.5 rounded-full">
                                                {post.likes} Upvotes
                                            </button>
                                        </div>
                                        <button className="text-amber-600 text-xs font-bold hover:underline">
                                            Join Conversation
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
