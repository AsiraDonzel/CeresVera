import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MessageSquare, Users, Lock, Send, Search, Filter, 
    ShieldCheck, TrendingUp, MessageCircle, Award, 
    ChevronRight, Sparkles, Globe, Zap, Hash
} from 'lucide-react';
import ExpertPremiumPaymentOverlay from '../components/ExpertPremiumPaymentOverlay';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function ExpertCircles() {
    const [isPremium, setIsPremium] = useState(localStorage.getItem('is_premium') === 'true');
    const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('Trending');
    const [searchTerm, setSearchTerm] = useState('');
    const [isPosting, setIsPosting] = useState(false);

    useEffect(() => {
        const handlePremiumUpdate = () => {
            setIsPremium(localStorage.getItem('is_premium') === 'true');
        };
        window.addEventListener('premiumStatusChanged', handlePremiumUpdate);
        return () => window.removeEventListener('premiumStatusChanged', handlePremiumUpdate);
    }, []);

    const circles = [
        { id: 1, title: 'West African Cocoa Blight', participants: 42, threads: 156, category: 'Research', growth: '+12%', color: 'rose' },
        { id: 2, title: 'Predictive Oil Palm Yields', participants: 28, threads: 89, category: 'Analytics', growth: '+5%', color: 'blue' },
        { id: 3, title: 'Organic Pest Control Alpha', participants: 15, threads: 44, category: 'Innovation', growth: '+22%', color: 'emerald' },
        { id: 4, title: 'Sustainable Irrigation Tech', participants: 31, threads: 112, category: 'Engineering', growth: '+8%', color: 'amber' },
    ];

    const discussions = [
        { 
            id: 101, 
            author: 'Dr. Amina Okafor', 
            role: 'Pathologist', 
            content: 'Observed a new strain of mosaic virus in Cross River state. Seeking data from neighboring farms regarding leaf yellowing patterns.', 
            time: '2h ago', 
            comments: 12, 
            likes: 24, 
            gold: true,
            tags: ['Research', 'Virus']
        },
        { 
            id: 102, 
            author: 'Mr. Tunde Lawal', 
            role: 'Soil Expert', 
            content: 'The shift in rainfall patterns is significantly affecting nitrogen absorption in oil palms. Have anyone tried localized mulch buffers?', 
            time: '5h ago', 
            comments: 8, 
            likes: 15, 
            gold: false,
            tags: ['Soil', 'Climate']
        },
        { 
            id: 103, 
            author: 'Prof. S. Mensah', 
            role: 'Entomologist', 
            content: 'Proposed a biological deterrent for Fall Armyworm using localized neem extracts. Initial trials show 65% effectiveness.', 
            time: '1d ago', 
            comments: 45, 
            likes: 89, 
            gold: true,
            tags: ['Pest Control', 'Trial']
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    if (!isPremium) {
        return (
            <div className="min-h-screen bg-app-subtle flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-harvest-200/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-earth-300/10 rounded-full blur-[100px]"></div>
                
                <ExpertPremiumPaymentOverlay 
                    isOpen={isUpgradeOpen} 
                    onClose={() => setIsUpgradeOpen(false)} 
                />
                
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-xl w-full bg-white/70 backdrop-blur-2xl rounded-[3rem] p-12 shadow-2xl border border-white/50 text-center relative z-10"
                >
                    <div className="w-24 h-24 bg-gradient-to-br from-harvest-100 to-harvest-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl rotate-3">
                        <Lock className="w-10 h-10 text-harvest-600" />
                    </div>
                    
                    <div className="space-y-4 mb-10">
                        <h2 className="text-4xl font-black text-earth-900 tracking-tight leading-tight">Expert Circles</h2>
                        <div className="flex items-center justify-center gap-2 text-harvest-600 font-bold uppercase tracking-widest text-xs">
                            <Sparkles className="w-4 h-4" />
                            Veritas Premium Required
                        </div>
                        <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-sm mx-auto">
                            Join a private network of elite agronomists to collaborate on complex cases and share breakthrough research.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-10 text-left">
                        {[
                            { icon: <Globe className="w-4 h-4"/>, text: "Global Network" },
                            { icon: <Zap className="w-4 h-4"/>, text: "Rapid Solutions" },
                            { icon: <ShieldCheck className="w-4 h-4"/>, text: "Verified Experts" },
                            { icon: <MessageSquare className="w-4 h-4"/>, text: "Private Channels" },
                        ].map((feat, i) => (
                            <div key={i} className="flex items-center gap-3 p-4 bg-white/50 rounded-2xl border border-white/80">
                                <div className="p-2 bg-harvest-50 text-harvest-600 rounded-lg">{feat.icon}</div>
                                <span className="text-sm font-bold text-earth-900">{feat.text}</span>
                            </div>
                        ))}
                    </div>

                    <button 
                        onClick={() => setIsUpgradeOpen(true)}
                        className="w-full bg-harvest-500 hover:bg-harvest-600 text-earth-900 font-black py-5 rounded-[2rem] shadow-xl shadow-harvest-200 transition-all active:scale-95 flex items-center justify-center gap-3 text-lg"
                    >
                        <Award className="w-6 h-6" />
                        Upgrade to Gold Veritas
                    </button>
                    
                    <p className="mt-8 text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Exclusively for Verified Agronomists</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-app-subtle pb-20 pt-8 px-6">
            <div className="max-w-7xl mx-auto space-y-12">
                
                {/* Premium Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 bg-white/40 backdrop-blur-md p-10 rounded-[3rem] border border-white/60 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Users className="w-48 h-48 rotate-12" />
                    </div>
                    
                    <div className="relative z-10 space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-harvest-100 text-harvest-700 rounded-full border border-harvest-200 shadow-sm mb-2">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Alpha Circle Active</span>
                        </div>
                        <h1 className="text-5xl font-black text-earth-900 tracking-tighter">Expert Circles</h1>
                        <p className="text-earth-700/60 font-medium text-lg max-w-lg">The epicenter of agricultural innovation and peer-to-peer expert collaboration.</p>
                    </div>

                    <div className="flex flex-wrap gap-4 relative z-10 w-full lg:w-auto">
                        <div className="relative group flex-1 lg:flex-none">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-harvest-600 transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Search discussions..." 
                                className="bg-white border border-white/50 pl-11 pr-6 py-4 rounded-[1.5rem] text-sm font-bold focus:ring-4 focus:ring-harvest-100 outline-none w-full lg:w-72 shadow-xl shadow-black/5 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button 
                            onClick={() => setIsPosting(true)}
                            className="bg-earth-900 text-white px-8 py-4 rounded-[1.5rem] font-black flex items-center gap-2 shadow-xl shadow-earth-900/10 hover:bg-earth-950 transition-all hover:-translate-y-0.5"
                        >
                            <MessageSquare className="w-5 h-5 text-harvest-400" /> Start Discussion
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    
                    {/* Left: Private Channels & Members */}
                    <div className="lg:col-span-3 space-y-10">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Circles</h2>
                                <button className="text-[10px] font-black text-harvest-600 uppercase tracking-widest hover:text-harvest-700">Explore +</button>
                            </div>
                            <div className="space-y-4">
                                {circles.map(circle => (
                                    <motion.div 
                                        key={circle.id}
                                        whileHover={{ scale: 1.02, x: 4 }}
                                        className="bg-white p-5 rounded-[2rem] border border-white shadow-xl shadow-black/5 cursor-pointer group relative overflow-hidden transition-all"
                                    >
                                        <div className={`absolute top-0 right-0 w-16 h-16 bg-${circle.color}-500/5 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2`}></div>
                                        <div className="flex justify-between items-center mb-3">
                                            <div className="bg-app-subtle p-2.5 rounded-xl group-hover:bg-app-accent-subtle transition-colors">
                                                <Hash className="w-4 h-4 text-earth-700" />
                                            </div>
                                            <span className="text-[10px] font-black text-sage-600 py-1 px-2 bg-sage-50 rounded-lg">{circle.growth}</span>
                                        </div>
                                        <h3 className="font-black text-earth-900 text-sm leading-tight mb-2 pr-4">{circle.title}</h3>
                                        <div className="flex items-center gap-3 text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                                            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {circle.participants}</span>
                                            <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {circle.threads}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Member Spotlight */}
                        <div className="bg-earth-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-earth-900/20">
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                            <h3 className="text-[10px] font-black text-harvest-400 uppercase tracking-widest mb-6">Top Contributors</h3>
                            <div className="space-y-6">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full border-2 border-harvest-500/50 p-0.5">
                                            <img src={`https://i.pravatar.cc/150?u=${i*50}`} className="w-full h-full rounded-full grayscale hover:grayscale-0 transition-all cursor-pointer" alt="" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-xs font-bold truncate">Expert Participant {i}</div>
                                            <div className="text-[9px] text-harvest-400 font-bold uppercase tracking-widest">324 Case Assists</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Premium Discussion Feed */}
                    <div className="lg:col-span-9 space-y-8">
                        <div className="flex gap-8 border-b border-gray-200">
                            {['Trending', 'Latest Feed', 'Case Studies', 'Resources'].map(tab => (
                                <button 
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-earth-900' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    {tab}
                                    {activeTab === tab && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-1 bg-harvest-500 rounded-full" />}
                                </button>
                            ))}
                        </div>

                        <motion.div 
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid gap-6"
                        >
                            {discussions.map(post => (
                                <motion.div 
                                    key={post.id}
                                    variants={itemVariants}
                                    className="bg-white p-8 rounded-[3rem] border border-white shadow-xl shadow-black-[0.02] hover:shadow-2xl hover:shadow-black/5 transition-all group"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex gap-4 items-center">
                                            <div className="relative">
                                                <div className="w-14 h-14 rounded-2xl bg-app-subtle border border-app-border flex items-center justify-center font-black text-xl text-earth-900 shadow-inner">
                                                    {post.author.charAt(0)}
                                                </div>
                                                {post.gold && (
                                                    <div className="absolute -bottom-1 -right-1 bg-harvest-500 rounded-lg p-1 border-2 border-white shadow-lg">
                                                        <ShieldCheck className="w-3 h-3 text-earth-900" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <span className="font-black text-earth-900 text-lg tracking-tight">{post.author}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black text-harvest-600 uppercase tracking-widest bg-harvest-50 px-2 py-0.5 rounded-md">{post.role}</span>
                                                    <span className="text-[10px] font-bold text-gray-400">• {post.time}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="p-3 bg-app-subtle rounded-2xl text-gray-400 hover:text-earth-900 transition-colors group-hover:bg-app-accent-subtle">
                                            <TrendingUp className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="pl-0 lg:pl-[4.5rem] mb-8">
                                        <p className="text-earth-900/80 leading-relaxed font-medium text-lg mb-6">
                                            {post.content}
                                        </p>
                                        <div className="flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-widest">
                                            {post.tags.map(tag => (
                                                <span key={tag} className="border border-app-border px-3 py-1 rounded-full text-gray-500 flex items-center gap-1.5 hover:border-harvest-400 hover:text-harvest-700 transition-colors cursor-pointer">
                                                    <Hash className="w-3 h-3" /> {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-6 border-t border-app-border">
                                        <div className="flex gap-3 lg:pl-[4.5rem]">
                                            <button className="flex items-center gap-2 text-xs font-black text-gray-500 hover:text-earth-900 transition-colors bg-app-subtle px-5 py-2.5 rounded-2xl border border-transparent hover:border-app-border">
                                                <MessageCircle className="w-4 h-4" /> {post.comments} <span className="hidden sm:inline">Comments</span>
                                            </button>
                                            <button className="flex items-center gap-2 text-xs font-black text-gray-500 hover:text-earth-900 transition-colors bg-app-subtle px-5 py-2.5 rounded-2xl border border-transparent hover:border-app-border">
                                                <TrendingUp className="w-4 h-4" /> {post.likes} <span className="hidden sm:inline">Upvotes</span>
                                            </button>
                                        </div>
                                        <button className="flex items-center gap-2 text-earth-900 font-black text-xs uppercase tracking-widest hover:gap-3 transition-all px-4 py-2 hover:bg-app-accent-subtle rounded-xl">
                                            Join Discussion <ChevronRight className="w-4 h-4 text-harvest-500" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}

                            <div className="py-10 text-center">
                                <button className="text-gray-400 font-bold hover:text-earth-900 transition-colors flex items-center justify-center gap-2 mx-auto">
                                    Load past discussions <ChevronRight className="w-4 h-4 rotate-90" />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
            
            {/* New Discussion Trigger (Floating on Mobile) */}
            <div className="fixed bottom-8 right-8 lg:hidden z-50">
                <button 
                    onClick={() => setIsPosting(true)}
                    className="w-16 h-16 bg-earth-900 text-harvest-400 rounded-full shadow-2xl flex items-center justify-center active:scale-95 transition-transform border-4 border-white"
                >
                    <MessageSquare className="w-6 h-6" />
                </button>
            </div>
            
            {/* Simulation of New Discussion Modal */}
            <AnimatePresence>
                {isPosting && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-earth-900/60 backdrop-blur-md flex items-center justify-center p-6"
                        onClick={() => setIsPosting(false)}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl relative"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-10">
                                <h3 className="text-3xl font-black text-earth-900 tracking-tight mb-8">Start New Discussion</h3>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Discussion Topic / Research Title</label>
                                        <input type="text" placeholder="e.g. Unusual root rot patterns in Ogun State" className="w-full bg-app-subtle border border-app-border rounded-2xl p-4 font-bold outline-none focus:ring-4 focus:ring-harvest-100 transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Detailed Content</label>
                                        <textarea rows="4" placeholder="Share your observations or research details..." className="w-full bg-app-subtle border border-app-border rounded-2xl p-4 font-bold outline-none focus:ring-4 focus:ring-harvest-100 transition-all resize-none"></textarea>
                                    </div>
                                    <div className="flex gap-4 pt-4">
                                        <button onClick={() => setIsPosting(false)} className="flex-1 py-4 bg-gray-100 text-gray-500 font-black rounded-2xl hover:bg-gray-200 transition-colors">Discard</button>
                                        <button className="flex-[2] py-4 bg-earth-900 text-white font-black rounded-2xl shadow-xl shadow-earth-900/20 hover:bg-earth-950 transition-all">Submit to Circle</button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
