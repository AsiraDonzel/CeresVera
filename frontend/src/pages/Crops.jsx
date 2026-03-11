import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, Beaker, Bug } from 'lucide-react';
import { cropsData } from '../data/crops';

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function Crops() {
    const [activeLetter, setActiveLetter] = useState('A');
    const [selectedCrop, setSelectedCrop] = useState(null);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (selectedCrop) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => document.body.style.overflow = 'unset';
    }, [selectedCrop]);

    return (
        <div className="bg-[#FAF9F6] min-h-screen pt-12 pb-24 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-[#0F172A] mb-4">Crops</h1>

                {/* Alphabet Filter */}
                <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-sm mb-12 border-b border-gray-200 pb-4">
                    <span className="text-gray-500 mr-2">Plants Start with:</span>
                    {alphabet.map((letter) => {
                        const hasCrops = cropsData[letter] && cropsData[letter].length > 0;
                        return (
                            <button
                                key={letter}
                                onClick={() => hasCrops && setActiveLetter(letter)}
                                disabled={!hasCrops}
                                className={`font-semibold transition-colors ${activeLetter === letter
                                    ? 'text-amber-500 scale-110'
                                    : hasCrops
                                        ? 'text-[#0F172A] hover:text-amber-500'
                                        : 'text-gray-300 cursor-not-allowed'
                                    }`}
                            >
                                {letter}
                            </button>
                        );
                    })}
                </div>

                {/* Main Content Area */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeLetter}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2 className="text-6xl font-black text-amber-500 mb-10">{activeLetter}</h2>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                            {cropsData[activeLetter]?.map((crop, idx) => (
                                <div key={idx} className="group cursor-pointer" onClick={() => setSelectedCrop(crop)}>
                                    <div className="aspect-[4/3] bg-gray-200 overflow-hidden mb-4 relative rounded-md shadow-sm">
                                        <img
                                            src={crop.img}
                                            alt={crop.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-amber-600 transition-colors">{crop.name}</h3>
                                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">
                                        See more info on <span className="underline group-hover:text-amber-600">{crop.name}</span>
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>

            </div>

            {/* Glassmorphic Animated Details Overlay */}
            <AnimatePresence>
                {selectedCrop && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                        onClick={() => setSelectedCrop(null)}
                    >
                        <motion.div
                            initial={{ y: 50, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 20, opacity: 0, scale: 0.95 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="bg-white rounded-[2rem] shadow-2xl overflow-hidden w-full max-w-2xl flex flex-col max-h-[90vh]"
                            onClick={(e) => e.stopPropagation()} // Prevent close on modal click
                        >
                            {/* Modal Header/Image Area */}
                            <div className="relative h-64 sm:h-80 w-full shrink-0">
                                <img src={selectedCrop.img} alt={selectedCrop.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                <button
                                    onClick={() => setSelectedCrop(null)}
                                    className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 backdrop-blur-md text-white p-2 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="absolute bottom-0 left-0 p-8">
                                    <h2 className="text-4xl font-black text-white tracking-tight mb-2 drop-shadow-md">
                                        {selectedCrop.name}
                                    </h2>
                                    <div className="flex items-center text-amber-300 font-mono text-sm tracking-widest drop-shadow-sm">
                                        <Beaker className="w-4 h-4 mr-2 opacity-80" />
                                        {selectedCrop.botanicalName || "Spp."}
                                    </div>
                                </div>
                            </div>

                            {/* Modal Content Details */}
                            <div className="p-8 overflow-y-auto custom-scrollbar bg-gray-50/50 flex-grow">
                                <div className="grid sm:grid-cols-2 gap-8">

                                    {/* Primary Growing Regions */}
                                    <div className="space-y-4">
                                        <div className="flex items-center text-gray-900 font-bold text-lg mb-2">
                                            <Globe className="w-5 h-5 mr-2 text-sage-600" />
                                            Primary Regions
                                        </div>
                                        {selectedCrop.regions && selectedCrop.regions.length > 0 ? (
                                            <ul className="space-y-3">
                                                {selectedCrop.regions.map((region, i) => (
                                                    <li key={i} className="flex items-center text-gray-600 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-sage-400 mr-3 shrink-0" />
                                                        {region}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-500 italic text-sm">Region data unavailable.</p>
                                        )}
                                    </div>

                                    {/* Common Pathogens & Diseases */}
                                    <div className="space-y-4">
                                        <div className="flex items-center text-gray-900 font-bold text-lg mb-2">
                                            <Bug className="w-5 h-5 mr-2 text-amber-600" />
                                            Target Pathogens
                                        </div>
                                        {selectedCrop.commonDiseases && selectedCrop.commonDiseases.length > 0 ? (
                                            <ul className="space-y-3">
                                                {selectedCrop.commonDiseases.map((disease, i) => (
                                                    <li key={i} className="flex items-center text-gray-600 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-3 shrink-0" />
                                                        {disease}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-500 italic text-sm">Disease tracking pending.</p>
                                        )}
                                    </div>

                                </div>

                                <div className="mt-10 pt-6 border-t border-gray-200">
                                    <button
                                        onClick={() => window.location.href = '/scan'}
                                        className="w-full bg-[#0F172A] hover:bg-amber-600 text-white font-bold py-4 px-6 rounded-xl transition-colors shadow-md flex items-center justify-center"
                                    >
                                        Diagnose {selectedCrop.name}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
