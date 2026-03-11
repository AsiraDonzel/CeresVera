import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float } from '@react-three/drei';
import { AlertCircle, ShieldCheck, Leaf, Search, Activity, Zap } from 'lucide-react';
import { diseaseData, cropFilters } from '../data/diseases';

// Subtle floating particle effect for the background
function SporeParticles() {
    const ref = useRef();
    useFrame((state, delta) => {
        ref.current.rotation.x -= delta / 10;
        ref.current.rotation.y -= delta / 15;
    });

    return (
        <group ref={ref}>
            <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        </group>
    );
}

// Custom SVG Icon representing a microscopic spore
function MicrobeIcon(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <circle cx="12" cy="12" r="8" strokeDasharray="2 2" />
            <circle cx="12" cy="12" r="3" fill="currentColor" />
            <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" opacity="0.5" />
        </svg>
    );
}

export default function Diseases() {
    const [activeFilter, setActiveFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Filter logic based on crop category and search text
    const filteredDiseases = diseaseData.filter(disease => {
        const matchesCategory = activeFilter === 'All' || disease.crop === activeFilter;
        const matchesSearch = disease.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            disease.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const getSeverityBadge = (severity) => {
        switch (severity) {
            case 'CRITICAL':
                return (
                    <div className="flex items-center space-x-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
                        <Zap className="w-3.5 h-3.5 text-red-500" />
                        <span className="text-red-500 text-xs font-black tracking-widest uppercase">CRITICAL</span>
                    </div>
                );
            case 'HIGH':
                return (
                    <div className="flex items-center space-x-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full">
                        <Activity className="w-3.5 h-3.5 text-orange-500" />
                        <span className="text-orange-500 text-xs font-black tracking-widest uppercase">HIGH</span>
                    </div>
                );
            case 'MEDIUM':
                return (
                    <div className="flex items-center space-x-2 px-3 py-1 bg-amber-400/10 border border-amber-400/20 rounded-full">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-amber-400 text-xs font-black tracking-widest uppercase">MEDIUM</span>
                    </div>
                );
            case 'NONE':
            default:
                return (
                    <div className="flex items-center space-x-2 px-3 py-1 bg-emerald-400/10 border border-emerald-400/20 rounded-full">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 text-xs font-black tracking-widest uppercase">NONE</span>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-[#060B12] text-gray-300 font-sans relative overflow-hidden">

            {/* Interactive Cyber-Agriculture 3D Background */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
                <Canvas camera={{ position: [0, 0, 1] }}>
                    <ambientLight intensity={0.5} />
                    <SporeParticles />
                    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#4ade80" />
                    </Float>
                </Canvas>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">

                {/* Header Section */}
                <div className="text-center mb-16 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="inline-flex items-center justify-center p-4 bg-sage-500/10 rounded-2xl mb-2 backdrop-blur-sm border border-sage-500/20"
                    >
                        <MicrobeIcon className="w-8 h-8 text-sage-400" />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                        className="text-5xl md:text-7xl font-black text-white tracking-tight font-display drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                    >
                        Disease <span className="text-transparent bg-clip-text bg-gradient-to-r from-sage-400 to-emerald-300">Database</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-light"
                    >
                        Explore our curated index of common agricultural pathogens, their symptoms, and baseline severity metrics across major crops.
                    </motion.p>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">

                    {/* Search Input */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="relative w-full md:w-96 group"
                    >
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-500 group-focus-within:text-sage-400 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search diseases or symptoms..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#0D1420]/80 border border-gray-800 text-white rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-sage-500/50 focus:border-sage-500 backdrop-blur-md transition-all shadow-inner"
                        />
                    </motion.div>

                    {/* Sub-navigation Filters */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-wrap items-center justify-center md:justify-end gap-2 w-full md:w-auto"
                    >
                        {cropFilters.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${activeFilter === filter
                                        ? 'bg-sage-500 text-[#060B12] shadow-[0_0_15px_rgba(74,222,128,0.3)]'
                                        : 'bg-[#151E2E]/60 text-gray-400 hover:text-white hover:bg-[#1E293B] border border-gray-800'
                                    } backdrop-blur-sm`}
                            >
                                {filter}
                            </button>
                        ))}
                    </motion.div>
                </div>

                {/* Disease Grid */}
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence>
                        {filteredDiseases.map((disease, idx) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3, delay: idx * 0.05 }}
                                key={disease.id}
                                className="bg-[#111823]/80 rounded-2xl p-6 border border-gray-800/60 hover:border-gray-600 backdrop-blur-md transition-all group overflow-hidden relative shadow-lg hover:shadow-2xl hover:-translate-y-1"
                            >
                                {/* Subtle glowing orb in background of card */}
                                <div className="absolute -right-10 -top-10 w-32 h-32 bg-sage-500/5 rounded-full blur-3xl group-hover:bg-sage-500/10 transition-colors" />

                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    {/* Icon box */}
                                    <div className="w-10 h-10 rounded-xl bg-[#1A2333] flex items-center justify-center border border-gray-700/50 shadow-inner group-hover:scale-110 transition-transform">
                                        {disease.severity === 'NONE' ? (
                                            <ShieldCheck className="w-5 h-5 text-emerald-400" />
                                        ) : (
                                            <MicrobeIcon className="w-5 h-5 text-gray-400 group-hover:text-sage-400 transition-colors" />
                                        )}
                                    </div>
                                    {/* Severity Badge */}
                                    {getSeverityBadge(disease.severity)}
                                </div>

                                <div className="relative z-10">
                                    <h3 className="text-xl font-bold text-white mb-2 tracking-tight group-hover:text-sage-100 transition-colors">
                                        {disease.name}
                                    </h3>
                                    <div className="flex items-center text-sage-400 font-medium text-sm mb-4">
                                        <Leaf className="w-3.5 h-3.5 mr-1.5" />
                                        {disease.crop}
                                    </div>
                                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                                        {disease.description}
                                    </p>
                                </div>

                                {/* Decorative bottom border reflecting severity */}
                                <div className={`absolute bottom-0 left-0 h-1 w-full opacity-50 transition-opacity group-hover:opacity-100 ${disease.severity === 'CRITICAL' ? 'bg-red-500' :
                                        disease.severity === 'HIGH' ? 'bg-orange-500' :
                                            disease.severity === 'MEDIUM' ? 'bg-amber-400' : 'bg-emerald-400'
                                    }`} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filteredDiseases.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div className="inline-block p-4 bg-[#1A2333] rounded-full mb-4">
                            <Search className="w-8 h-8 text-gray-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No pathogens found</h3>
                        <p className="text-gray-400">Try adjusting your search query or crop filter.</p>
                    </motion.div>
                )}

            </div>
        </div>
    );
}
