import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, Beaker, Bug, MapPin, Calendar, Leaf } from 'lucide-react';
import { cropsData } from '../data/crops';

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// Flatten the cropsData into a single A-Z list
const allCrops = alphabet.reduce((acc, letter) => {
    if (cropsData[letter]) {
        acc.push({ letter, crops: cropsData[letter] });
    }
    return acc;
}, []);

export default function Crops() {
    const [selectedCrop, setSelectedCrop] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (selectedCrop) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => document.body.style.overflow = 'unset';
    }, [selectedCrop]);

    // Filter crops based on search query
    const filteredGroups = allCrops.map(group => ({
        letter: group.letter,
        crops: group.crops.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                     c.botanicalName.toLowerCase().includes(searchQuery.toLowerCase()))
    })).filter(group => group.crops.length > 0);

    return (
        <div className="min-h-screen bg-app-subtle">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-sage-800 to-sage-700 text-white py-16 px-4">
                <div className="max-w-5xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                <Leaf className="w-5 h-5 text-sage-200" />
                            </div>
                            <span className="text-sage-300 font-semibold text-sm uppercase tracking-wider">Crop Index</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
                            Agricultural <span className="text-sage-300">Crops A-Z</span>
                        </h1>
                        <p className="text-sage-200 text-lg max-w-2xl">
                            A comprehensive botanical database featuring planting seasons, optimal Nigerian cultivation states, and common pathogens.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-10">
                {/* Search Bar */}
                <div className="mb-10 w-full max-w-md">
                    <input
                        type="text"
                        placeholder="Search for a crop by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-5 py-3.5 bg-app-card border border-app-border rounded-xl text-app-text focus:outline-none focus:ring-2 focus:ring-sage-400 shadow-sm text-sm transition-shadow placeholder:text-app-text-muted"
                    />
                </div>

                {/* Main A-Z List Area */}
                {filteredGroups.length === 0 ? (
                    <div className="text-center py-20">
                        <Leaf className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No crops found</h3>
                        <p className="text-gray-500">Could not find any crops matching your search.</p>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {filteredGroups.map((group) => (
                            <div key={group.letter} className="flex gap-6 md:gap-12 relative animate-fade-in">
                                {/* Letter Column */}
                                <div className="w-12 shrink-0 md:w-24">
                                    <div className="sticky top-24">
                                        <span className="text-5xl md:text-7xl font-bold text-sage-100/60 leading-none block -mt-2 md:-mt-4">
                                            {group.letter}
                                        </span>
                                    </div>
                                </div>

                                {/* Crops Grid for this Letter */}
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {group.crops.map((crop, idx) => (
                                        <motion.div
                                            key={idx}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setSelectedCrop(crop)}
                                            className="bg-app-card border border-app-border rounded-2xl p-5 cursor-pointer shadow-sm hover:shadow-md hover:border-sage-200 transition-all group"
                                        >
                                            <h3 className="text-lg font-bold text-app-text group-hover:text-sage-700 transition-colors tracking-tight leading-tight mb-1">
                                                {crop.name}
                                            </h3>
                                            <p className="text-sm text-gray-400 font-mono italic mb-4">
                                                {crop.botanicalName}
                                            </p>
                                            
                                            <div className="flex flex-wrap gap-2">
                                                {crop.nigeriaStates && crop.nigeriaStates[0] && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-app-accent-subtle text-earth-700 dark:text-earth-400 text-[10px] font-bold uppercase rounded-md">
                                                        <MapPin className="w-3 h-3" /> {crop.nigeriaStates[0]}
                                                    </span>
                                                )}
                                                {crop.seasons && crop.seasons[0] && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-app-accent-subtle text-sage-700 dark:text-sage-400 text-[10px] font-bold uppercase rounded-md truncate max-w-[120px]">
                                                        <Calendar className="w-3 h-3 shrink-0" /> {crop.seasons[0]}
                                                    </span>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Glassmorphic Animated Details Overlay */}
            <AnimatePresence>
                {selectedCrop && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm overflow-y-auto"
                        onClick={() => setSelectedCrop(null)}
                    >
                        <motion.div
                            initial={{ y: 20, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 20, opacity: 0, scale: 0.95 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="bg-app-card rounded-[2rem] shadow-2xl overflow-hidden w-full max-w-2xl my-auto relative border border-app-border"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="bg-gradient-to-br from-sage-700 to-earth-800 p-8 pt-10 relative">
                                <button
                                    onClick={() => setSelectedCrop(null)}
                                    className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors backdrop-blur-md"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4">
                                    <Leaf className="w-6 h-6 text-sage-200" />
                                </div>

                                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
                                    {selectedCrop.name}
                                </h2>
                                <div className="flex items-center text-sage-200 font-mono text-sm tracking-widest">
                                    <Beaker className="w-4 h-4 mr-2" />
                                    {selectedCrop.botanicalName || "Spp."}
                                </div>
                            </div>

                            {/* Modal Content Details */}
                            <div className="p-8 bg-app-subtle flex-grow">
                                <div className="grid sm:grid-cols-2 gap-8">

                                    {/* Best Seasons to Plant */}
                                    <div className="space-y-4">
                                        <div className="flex items-center text-sage-800 font-bold text-lg mb-2">
                                            <Calendar className="w-5 h-5 mr-2 text-sage-600" />
                                            Optimal Seasons
                                        </div>
                                        {selectedCrop.seasons && selectedCrop.seasons.length > 0 ? (
                                            <ul className="space-y-2">
                                                {selectedCrop.seasons.map((season, i) => (
                                                    <li key={i} className="flex items-center text-app-text bg-app-card px-4 py-3 rounded-xl shadow-sm border border-app-border text-sm font-medium">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-sage-400 mr-3 shrink-0" />
                                                        {season}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-500 italic text-sm">Season data unavailable.</p>
                                        )}
                                    </div>

                                    {/* Best Places in Nigeria */}
                                    <div className="space-y-4">
                                        <div className="flex items-center text-earth-800 font-bold text-lg mb-2">
                                            <MapPin className="w-5 h-5 mr-2 text-earth-600" />
                                            Best Nigerian States
                                        </div>
                                        {selectedCrop.nigeriaStates && selectedCrop.nigeriaStates.length > 0 ? (
                                            <ul className="space-y-2">
                                                {selectedCrop.nigeriaStates.map((state, i) => (
                                                    <li key={i} className="flex items-center text-app-text bg-app-card px-4 py-3 rounded-xl shadow-sm border border-app-border text-sm font-medium">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-earth-400 mr-3 shrink-0" />
                                                        {state}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-500 italic text-sm">State data unavailable.</p>
                                        )}
                                    </div>
                                    
                                    {/* Global Regions */}
                                    <div className="space-y-4">
                                        <div className="flex items-center text-sky-800 font-bold text-lg mb-2">
                                            <Globe className="w-5 h-5 mr-2 text-sky-600" />
                                            Global Regions
                                        </div>
                                        {selectedCrop.regions && selectedCrop.regions.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {selectedCrop.regions.map((region, i) => (
                                                    <span key={i} className="px-3 py-1.5 bg-sky-50 text-sky-700 rounded-lg shadow-sm border border-sky-100 text-xs font-bold uppercase">
                                                        {region}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 italic text-sm">Region data unavailable.</p>
                                        )}
                                    </div>

                                    {/* Common Pathogens & Diseases */}
                                    <div className="space-y-4">
                                        <div className="flex items-center text-red-800 font-bold text-lg mb-2">
                                            <Bug className="w-5 h-5 mr-2 text-red-500" />
                                            Target Pathogens
                                        </div>
                                        {selectedCrop.commonDiseases && selectedCrop.commonDiseases.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {selectedCrop.commonDiseases.map((disease, i) => (
                                                    <span key={i} className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg shadow-sm border border-red-100 text-xs font-bold uppercase">
                                                        {disease}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 italic text-sm border border-dashed border-gray-300 rounded-xl p-3 text-center">Disease tracking pending.</p>
                                        )}
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
