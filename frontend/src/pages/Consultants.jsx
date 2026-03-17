import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Star, GraduationCap, ArrowRight, Search, Filter, CheckCircle, ShieldCheck, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ConsultantPaymentOverlay from '../components/ConsultantPaymentOverlay';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function Consultants() {
    const [experts, setExperts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    
    // Payment Overlay State
    const [selectedExpertForPayment, setSelectedExpertForPayment] = useState(null);
    const [isPaymentOverlayOpen, setIsPaymentOverlayOpen] = useState(false);

    useEffect(() => {
        fetchExperts();
    }, []);

    const fetchExperts = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/marketplace/experts/`);
            setExperts(res.data);
        } catch (err) {
            console.error('Failed to fetch experts:', err);
        } finally {
            setLoading(false);
        }
    };

    const categories = ['All', 'Agronomy', 'Livestock', 'Soil Health', 'Pest Control', 'General'];

    const filteredExperts = experts
        .filter(expert => {
            const matchesSearch = expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (expert.specialty && expert.specialty.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (expert.bio && expert.bio.toLowerCase().includes(searchTerm.toLowerCase()));
            
            const matchesCategory = selectedCategory === 'All' || expert.expertise_category === selectedCategory;

            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            if (a.is_premium === b.is_premium) return 0;
            return a.is_premium ? -1 : 1;
        });

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-32 text-center">
                <div className="w-12 h-12 border-4 border-sage-200 border-t-sage-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500 font-medium">Loading Expert Marketplace...</p>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-12 bg-app-subtle min-h-full">

            {/* Search and Filter Section */}
            <div className="mb-12 max-w-4xl mx-auto space-y-6">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name, specialty, or keywords (e.g., maize, soil)..."
                        className="block w-full pl-11 pr-4 py-4 bg-app-card border border-app-border rounded-2xl shadow-sm focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-shadow outline-none text-app-text placeholder:text-app-text-muted"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                    <div className="flex items-center text-gray-500 mr-2 text-sm font-medium">
                        <Filter className="w-4 h-4 mr-1" /> Filter:
                    </div>
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category
                                    ? 'bg-sage-700 text-white shadow-md'
                                    : 'bg-app-card text-app-text border border-app-border hover:bg-app-accent-subtle'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {filteredExperts.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-earth-200 shadow-sm">
                    <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No experts found</h3>
                    <p className="text-gray-500">Try adjusting your search or filters to find exactly what you need.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredExperts.map(expert => (
                        <div key={expert.id} className={`bg-app-card rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all border flex flex-col items-center text-center relative overflow-hidden group ${expert.is_premium ? 'border-amber-300 ring-1 ring-amber-100' : 'border-app-border'}`}>

                            {expert.is_premium ? (
                                <div className="absolute top-4 right-4 bg-amber-50 text-amber-700 text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-amber-200 uppercase tracking-wider animate-pulse">
                                    <ShieldCheck className="w-3 h-3" /> Gold Veritas
                                </div>
                            ) : (
                                <div className="absolute top-4 right-4 bg-gray-50 text-gray-400 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-gray-100 uppercase tracking-tight">
                                    Verified
                                </div>
                            )}

                            {expert.profile_image_url ? (
                                <img src={expert.profile_image_url} alt={expert.name} className={`w-24 h-24 rounded-full mb-4 border-4 shadow-sm object-cover ${expert.is_premium ? 'border-amber-100' : 'border-sage-50'}`} />
                            ) : (
                                <div className={`w-24 h-24 rounded-full mb-4 border-4 shadow-sm flex items-center justify-center text-2xl font-black ${expert.is_premium ? 'border-amber-100 bg-amber-50 text-amber-700' : 'border-sage-50 bg-sage-50 text-sage-700'}`}>
                                    {expert.name ? expert.name.charAt(0).toUpperCase() : 'E'}
                                </div>
                            )}

                            <div className="flex items-center gap-1 justify-center mb-1">
                                <h2 className="text-xl font-bold text-app-text">{expert.name}</h2>
                                {expert.is_premium && <CheckCircle className="w-5 h-5 text-amber-500 fill-amber-50" />}
                            </div>
                            
                            <div className="flex items-center gap-1 text-sm text-sage-700 font-medium mb-4">
                                <GraduationCap className="w-4 h-4" /> {expert.expertise_category || expert.specialty}
                            </div>

                            <p className="text-app-text-muted text-sm mb-6 line-clamp-3">{expert.bio || 'Expert ready to assist with your agricultural needs.'}</p>

                            <div className={`w-full mt-auto pt-4 border-t border-app-border flex items-center justify-between ${!expert.is_active ? 'opacity-60 grayscale' : ''}`}>
                                <div className="text-left">
                                    <div className="text-[10px] text-app-text-muted uppercase font-black tracking-widest">Consultant</div>
                                    <div className={`text-sm font-bold tracking-tight ${expert.is_active ? 'text-sage-600' : 'text-gray-400'}`}>
                                        {expert.is_active ? 'Available Now' : 'Not Available'}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button 
                                        onClick={async () => {
                                            const userStr = localStorage.getItem('user');
                                            const token = localStorage.getItem('access_token');
                                            if (!userStr && !token) { window.location.href = '/auth'; return; }
                                            
                                            let user;
                                            if (userStr) {
                                                user = JSON.parse(userStr);
                                            } else {
                                                user = {
                                                    token: token,
                                                    role: localStorage.getItem('user_role'),
                                                    username: localStorage.getItem('user_name') || 'User'
                                                };
                                            }
                                            try {
                                                const res = await axios.post(`${API_URL}/api/chat/conversations/`, {
                                                    participants: [expert.user_id || expert.id] // Use user_id if available, fallback to id
                                                }, {
                                                    headers: { Authorization: `Bearer ${user.token}` }
                                                });
                                                window.location.href = '/messaging';
                                            } catch (err) {
                                                console.error('Failed to start chat:', err);
                                            }
                                        }}
                                        className="p-2.5 rounded-full bg-app-subtle text-app-text-muted hover:text-sage-600 border border-app-border transition-all active:scale-95"
                                        title="Send message"
                                    >
                                        <MessageSquare className="w-5 h-5" />
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setSelectedExpertForPayment(expert);
                                            setIsPaymentOverlayOpen(true);
                                        }} 
                                        className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-1.5 shadow-md active:scale-95 ${expert.is_premium ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-sage-600 hover:bg-sage-700 text-white'}`}
                                    >
                                        Consult <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            <AnimatePresence>
                <ConsultantPaymentOverlay 
                    isOpen={isPaymentOverlayOpen}
                    onClose={() => {
                        setIsPaymentOverlayOpen(false);
                        setSelectedExpertForPayment(null);
                    }}
                    expert={selectedExpertForPayment}
                />
            </AnimatePresence>
        </div>
    );
}
