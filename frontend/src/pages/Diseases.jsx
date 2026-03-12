import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ShieldCheck, Leaf, Search, Activity, Zap, Shield, Info } from 'lucide-react';
import { diseaseData, cropFilters } from '../data/diseases';

function MicrobeIcon(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <circle cx="12" cy="12" r="8" strokeDasharray="2 2" />
            <circle cx="12" cy="12" r="3" fill="currentColor" />
            <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" opacity="0.5" />
        </svg>
    );
}

const SEVERITY_CONFIG = {
    CRITICAL: { label: 'Critical', color: 'bg-red-100 text-red-700 border-red-300', dot: 'bg-red-500', bar: 'bg-red-500', Icon: Zap },
    HIGH: { label: 'High', color: 'bg-orange-100 text-orange-700 border-orange-300', dot: 'bg-orange-500', bar: 'bg-orange-500', Icon: Activity },
    MEDIUM: { label: 'Medium', color: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-400', bar: 'bg-amber-400', Icon: AlertCircle },
    NONE: { label: 'Healthy', color: 'bg-sage-100 text-sage-700 border-sage-200', dot: 'bg-sage-500', bar: 'bg-sage-500', Icon: ShieldCheck },
};

export default function Diseases() {
    const [activeFilter, setActiveFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredDiseases = diseaseData.filter(disease => {
        const matchesCategory = activeFilter === 'All' || disease.crop === activeFilter;
        const matchesSearch = disease.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            disease.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gradient-to-b from-earth-50 to-white">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-sage-800 to-sage-700 text-white py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                <MicrobeIcon className="w-5 h-5 text-sage-200" />
                            </div>
                            <span className="text-sage-300 font-semibold text-sm uppercase tracking-wider">Disease Library</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
                            Crop Disease <span className="text-sage-300">Database</span>
                        </h1>
                        <p className="text-sage-200 text-lg max-w-2xl">
                            An indexed reference of common agricultural pathogens, their symptoms, and severity levels across major crops.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Search + Filter Row */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-10">
                    {/* Search */}
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search diseases or symptoms..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-sage-400 shadow-sm text-sm"
                        />
                    </div>

                    {/* Crop Filters */}
                    <div className="flex flex-wrap gap-2">
                        {cropFilters.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border
                                    ${activeFilter === filter
                                        ? 'bg-sage-700 text-white border-sage-700 shadow-sm'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-sage-400 hover:text-sage-700'
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results Count */}
                <div className="flex items-center justify-between mb-6">
                    <p className="text-sm text-gray-500">
                        Showing <span className="font-semibold text-gray-800">{filteredDiseases.length}</span> {filteredDiseases.length === 1 ? 'result' : 'results'}
                    </p>
                </div>

                {/* Disease Grid */}
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    <AnimatePresence>
                        {filteredDiseases.map((disease, idx) => {
                            const cfg = SEVERITY_CONFIG[disease.severity] || SEVERITY_CONFIG.NONE;
                            const SevIcon = cfg.Icon;
                            return (
                                <motion.div
                                    layout
                                    key={disease.id}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.25, delay: idx * 0.03 }}
                                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 overflow-hidden group relative"
                                >
                                    {/* Severity colour bar on top */}
                                    <div className={`h-1 w-full ${cfg.bar}`} />

                                    <div className="p-5">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="w-9 h-9 rounded-xl bg-earth-50 border border-earth-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                {disease.severity === 'NONE'
                                                    ? <ShieldCheck className="w-4 h-4 text-sage-600" />
                                                    : <MicrobeIcon className="w-4 h-4 text-earth-600" />
                                                }
                                            </div>
                                            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${cfg.color}`}>
                                                <SevIcon className="w-3 h-3" />
                                                {cfg.label}
                                            </span>
                                        </div>

                                        <h3 className="font-bold text-gray-900 mb-1 text-base leading-tight">{disease.name}</h3>
                                        <div className="flex items-center gap-1.5 text-sage-600 text-xs font-medium mb-3">
                                            <Leaf className="w-3 h-3" /> {disease.crop}
                                        </div>
                                        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{disease.description}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>

                {/* Empty State */}
                {filteredDiseases.length === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-center py-24">
                        <div className="w-16 h-16 bg-earth-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-7 h-7 text-earth-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No diseases found</h3>
                        <p className="text-gray-500">Try adjusting your search or crop filter.</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
