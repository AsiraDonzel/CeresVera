import { useState, useEffect } from 'react';
import { Lock, Star, GraduationCap, ArrowRight, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Consultants() {
    // Read dynamic settings from LocalStorage
    const savedBio = localStorage.getItem('agronomistBio');
    const savedFee = localStorage.getItem('videoFee');
    const savedAvatar = localStorage.getItem('profile_picture');

    const [experts, setExperts] = useState([
        { 
            id: 1, 
            name: 'Dr. Amina Okafor', 
            specialty: 'Tropical Plant Diseases', 
            bio: savedBio || '10+ years experience diagnosing cassava and maize blights.', 
            rate: savedFee ? parseInt(savedFee) : 5000, 
            img: savedAvatar || 'https://i.pravatar.cc/150?u=amina', 
            rating: 4.8 
        },
        { id: 2, name: 'Mr. Tunde Lawal', specialty: 'Soil Health & Agronomy', bio: 'Specializes in improving crop yield through localized soil treatments.', rate: 4500, img: 'https://i.pravatar.cc/150?u=tunde', rating: 4.9 },
        { id: 3, name: 'Prof. S. Mensah', specialty: 'Pest Control', bio: 'Expert insect and pest management strategies using organic methods.', rate: 7000, img: 'https://i.pravatar.cc/150?u=mensah', rating: 5.0 },
        { id: 4, name: 'Dr. John Doe', specialty: 'Grains & Cereals', bio: 'Specialist in wheat, rice, and maize health management.', rate: 6000, img: 'https://i.pravatar.cc/150?u=johndoe', rating: 4.7 },
        { id: 5, name: 'Jane Smith', specialty: 'Horticulture', bio: 'Expertise in fruit and vegetable crop optimization.', rate: 4000, img: 'https://i.pravatar.cc/150?u=janesmith', rating: 4.6 },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', 'Tropical Plant Diseases', 'Soil Health & Agronomy', 'Pest Control', 'Grains & Cereals', 'Horticulture'];

    const filteredExperts = experts.filter(expert => {
        const matchesSearch = expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            expert.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
            expert.bio.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || expert.specialty === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="max-w-6xl mx-auto px-4 py-16">
            <div className="text-center mb-12 max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Expert Marketplace</h1>
                <p className="text-lg text-gray-600">Connect with certified agronomists and plant pathologists. Premium advice is locked behind a seamless paywall via Interswitch.</p>
            </div>

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
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredExperts.map(expert => (
                        <div key={expert.id} className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-shadow border border-earth-300 flex flex-col items-center text-center relative overflow-hidden group">

                            {/* Premium 'Locked' Overlay Hint */}
                            <div className="absolute top-4 right-4 bg-earth-100 text-earth-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                <Lock className="w-3 h-3" /> Premium
                            </div>

                            <img src={expert.img} alt={expert.name} className="w-24 h-24 rounded-full mb-4 border-4 border-sage-100 shadow-sm" />

                            <h2 className="text-xl font-bold text-gray-900 mb-1">{expert.name}</h2>
                            <div className="flex items-center gap-1 text-sm text-sage-700 font-medium mb-4">
                                <GraduationCap className="w-4 h-4" /> {expert.specialty}
                            </div>

                            <p className="text-gray-600 text-sm mb-6 line-clamp-3">{expert.bio}</p>

                            <div className="flex items-center gap-1 text-amber-500 mb-6">
                                <Star className="w-5 h-5 fill-current" />
                                <span className="text-gray-900 font-bold">{expert.rating}</span>
                                <span className="text-gray-500 text-xs ml-1">(120+ consults)</span>
                            </div>

                            <div className="w-full mt-auto pt-4 border-t border-earth-300 flex items-center justify-between">
                                <div className="text-left">
                                    <div className="text-xs text-gray-500">Consultation Fee</div>
                                    <div className="text-lg font-bold text-gray-900">₦{expert.rate.toLocaleString()}</div>
                                </div>

                                <Link to={`/checkout/${expert.id}`} className="bg-sage-700 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-sage-900 transition-colors flex items-center gap-1 shadow-md">
                                    Unlock <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
