import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bug, Info } from 'lucide-react';
import { pestsData } from '../data/pests';

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// Flatten the pestsData into a single A-Z list
const allPests = alphabet.reduce((acc, letter) => {
    if (pestsData[letter]) {
        acc.push({ letter, pests: pestsData[letter] });
    }
    return acc;
}, []);

export default function Pests() {
    const [selectedPest, setSelectedPest] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (selectedPest) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => document.body.style.overflow = 'unset';
    }, [selectedPest]);

    // Filter pests based on search query
    const filteredGroups = allPests.map(group => ({
        letter: group.letter,
        pests: group.pests.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    })).filter(group => group.pests.length > 0);

    return (
        <div className="min-h-screen bg-app-subtle">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-earth-800 to-earth-700 text-white py-16 px-4">
                <div className="max-w-5xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                <Bug className="w-5 h-5 text-amber-300" />
                            </div>
                            <span className="text-earth-200 font-semibold text-sm uppercase tracking-wider">Pathogen & Pest Index</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
                            Agricultural <span className="text-amber-400">Pests A-Z</span>
                        </h1>
                        <p className="text-earth-200 text-lg max-w-2xl">
                            A comprehensive database of agricultural pests, insects, and pathogens affecting global crop health. Powered by AGES.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-10">
                {/* Search Bar */}
                <div className="mb-10 w-full max-w-md">
                    <input
                        type="text"
                        placeholder="Search for a pest or disease..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-5 py-3.5 bg-app-card border border-app-border rounded-xl text-app-text focus:outline-none focus:ring-2 focus:ring-earth-400 shadow-sm text-sm transition-shadow placeholder:text-app-text-muted"
                    />
                </div>

                {/* Main A-Z List Area */}
                {filteredGroups.length === 0 ? (
                    <div className="text-center py-20">
                        <Bug className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No pests found</h3>
                        <p className="text-gray-500">Could not find any pests matching your search.</p>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {filteredGroups.map((group) => (
                            <div key={group.letter} className="flex gap-6 md:gap-12 relative animate-fade-in">
                                {/* Letter Column */}
                                <div className="w-12 shrink-0 md:w-24">
                                    <div className="sticky top-24">
                                        <span className="text-5xl md:text-7xl font-bold text-earth-200/60 leading-none block -mt-2 md:-mt-4">
                                            {group.letter}
                                        </span>
                                    </div>
                                </div>

                                {/* Pests Grid for this Letter */}
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {group.pests.map((pest, idx) => (
                                        <motion.div
                                            key={idx}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setSelectedPest(pest)}
                                            className="bg-app-card border border-app-border rounded-2xl p-5 cursor-pointer shadow-sm hover:shadow-md hover:border-amber-300 transition-all group flex flex-col justify-between"
                                        >
                                            <div>
                                                <h3 className="text-lg font-bold text-app-text group-hover:text-amber-600 transition-colors tracking-tight leading-tight mb-2">
                                                    {pest.name}
                                                </h3>
                                                <p className="text-xs text-gray-500 font-medium line-clamp-3 leading-relaxed mb-4">
                                                    {pest.description}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-earth-500">
                                                <Info className="w-3 h-3" /> View Details
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
                {selectedPest && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm overflow-y-auto"
                        onClick={() => setSelectedPest(null)}
                    >
                        <motion.div
                            initial={{ y: 20, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 20, opacity: 0, scale: 0.95 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="bg-app-card rounded-[2rem] shadow-2xl overflow-hidden w-full max-w-lg my-auto relative border border-app-border"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="bg-gradient-to-br from-earth-700 to-earth-900 p-8 pt-10 relative text-white text-center">
                                <button
                                    onClick={() => setSelectedPest(null)}
                                    className="absolute top-6 right-6 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors text-white backdrop-blur-md"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20 shadow-inner text-amber-300">
                                    <Bug className="w-8 h-8" />
                                </div>
                                <h2 className="text-3xl font-black mb-1">{selectedPest.name}</h2>
                                <p className="text-earth-200 text-sm font-medium uppercase tracking-widest">Agricultural Pest</p>
                            </div>

                            {/* Modal Body */}
                            <div className="p-8 space-y-8 bg-app-subtle">
                                <div>
                                    <h4 className="text-xs font-black text-app-text-muted uppercase tracking-widest mb-3 border-b border-app-border pb-2">Description</h4>
                                    <p className="text-sm text-app-text leading-relaxed font-medium">
                                        {selectedPest.description}
                                    </p>
                                </div>
                                
                                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3 text-amber-900 text-sm shadow-sm">
                                    <Info className="w-6 h-6 text-amber-600 shrink-0" />
                                    <div>
                                        <strong>Informational:</strong> This data is sourced directly from the European AGES Plant Health Database. For diagnosis, please consult a certified agronomist or use our AI scanner on affected crops.
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
