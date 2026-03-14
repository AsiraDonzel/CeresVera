import { useState, useEffect } from 'react';
import { Lock, Star, GraduationCap, ArrowRight, Search, Filter, CheckCircle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function Consultants() {
    const [experts, setExperts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        fetchExperts();
    }, []);

    const fetchExperts = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/consultants/`);
            setExperts(res.data);
        } catch (err) {
            console.error('Failed to fetch experts:', err);
        } finally {
            setLoading(false);
        }
    };

    const categories = ['All', 'Tropical Plant Diseases', 'Soil Health & Agronomy', 'Pest Control', 'Grains & Cereals', 'Horticulture'];

    const filteredExperts = experts
        .filter(expert => {
            const matchesSearch = expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                expert.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                expert.bio.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || expert.specialty === selectedCategory;

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
        <div className="p-8 space-y-12 bg-earth-50 min-h-full">

            {/* Search and Filter Section */}
            <div className="mb-12 max-w-4xl mx-auto space-y-6">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name, specialty, or keywords (e.g., maize, soil)..."
                        className="block w-full pl-11 pr-4 py-4 bg-white border border-earth-300 rounded-2xl shadow-sm focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-shadow outline-none text-gray-900 placeholder-gray-500"
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
                                    : 'bg-white text-gray-700 border border-earth-300 hover:bg-sage-100'
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
                        <div key={expert.id} className={`bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all border flex flex-col items-center text-center relative overflow-hidden group ${expert.is_premium ? 'border-amber-300 ring-1 ring-amber-100' : 'border-earth-300'}`}>

                            {expert.is_premium ? (
                                <div className="absolute top-4 right-4 bg-amber-50 text-amber-700 text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-amber-200 uppercase tracking-wider animate-pulse">
                                    <ShieldCheck className="w-3 h-3" /> Gold Veritas
                                </div>
                            ) : (
                                <div className="absolute top-4 right-4 bg-gray-50 text-gray-400 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-gray-100 uppercase tracking-tight">
                                    Verified
                                </div>
                            )}

                            <img src={expert.profile_pic_url || `https://i.pravatar.cc/150?u=${expert.id}`} alt={expert.name} className={`w-24 h-24 rounded-full mb-4 border-4 shadow-sm object-cover ${expert.is_premium ? 'border-amber-100' : 'border-sage-50'}`} />

                            <div className="flex items-center gap-1 justify-center mb-1">
                                <h2 className="text-xl font-bold text-gray-900">{expert.name}</h2>
                                {expert.is_premium && <CheckCircle className="w-5 h-5 text-amber-500 fill-amber-50" />}
                            </div>
                            
                            <div className="flex items-center gap-1 text-sm text-sage-700 font-medium mb-4">
                                <GraduationCap className="w-4 h-4" /> {expert.specialty}
                            </div>

                            <p className="text-gray-600 text-sm mb-6 line-clamp-3">{expert.bio}</p>

                            <div className="flex items-center gap-1 text-amber-500 mb-6">
                                <Star className="w-5 h-5 fill-current" />
                                <span className="text-gray-900 font-bold">{expert.rating || 4.8}</span>
                                <span className="text-gray-500 text-xs ml-1">(120+ consults)</span>
                            </div>

                            <div className="w-full mt-auto pt-4 border-t border-earth-100 flex items-center justify-between">
                                <div className="text-left">
                                    <div className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Fee</div>
                                    <div className="text-lg font-black text-gray-900 tracking-tight">₦{parseFloat(expert.rate).toLocaleString()}</div>
                                </div>

                                <Link to={`/checkout/${expert.id}`} className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-1.5 shadow-md active:scale-95 ${expert.is_premium ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-sage-600 hover:bg-sage-700 text-white'}`}>
                                    Consult <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
