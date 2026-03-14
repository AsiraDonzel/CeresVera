import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Briefcase, Calendar, MapPin, Clipboard,
    ChevronRight, AlertCircle, TreeDeciduous,
    Droplets, Map, MessageSquare, ArrowRight,
    Search, Filter, CheckCircle2, Clock, X, Leaf
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const mockRequests = [
    {
        id: 'REQ-001',
        farmerName: 'Kemi Adebayo',
        crop: 'Cassava',
        soilType: 'Sandy Loam',
        location: 'Abeokuta, Ogun State',
        problem: 'Yellowish spots appearing on lower leaves, possible mosaic virus or nitrogen deficiency.',
        dateBooked: '2026-03-13',
        status: 'Pending',
        severity: 'High'
    },
    {
        id: 'REQ-002',
        farmerName: 'John Okafor',
        crop: 'Maize',
        soilType: 'Clay',
        location: 'Ibadan, Oyo State',
        problem: 'Armyworm infestation suspected in the northern section of the farm.',
        dateBooked: '2026-03-12',
        status: 'Pending',
        severity: 'Critical'
    }
];

export default function FarmerRequests() {
    const navigate = useNavigate();
    const [selectedRequest, setSelectedRequest] = useState(null);

    return (
        <div className="flex flex-col space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Farmer's Requests</h1>
                    <p className="text-gray-500 font-medium mt-1">Review incoming bookings and provide expert guidance.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search requests..."
                            className="pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-harvest-500 outline-none w-64 shadow-sm font-medium"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-grow">
                {mockRequests.map((req) => (
                    <motion.div
                        key={req.id}
                        whileHover={{ y: -4 }}
                        className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden group flex flex-col"
                    >
                        <div className="p-8 space-y-6 flex-1">
                            <div className="flex justify-between items-start">
                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${req.severity === 'Critical' ? 'bg-rose-50 text-rose-600' : 'bg-orange-50 text-orange-600'
                                    }`}>
                                    {req.severity} Priority
                                </div>
                                <span className="text-xs font-bold text-gray-400">{req.dateBooked}</span>
                            </div>

                            <div>
                                <h3 className="text-2xl font-black text-gray-900 leading-tight group-hover:text-harvest-600 transition-colors uppercase">{req.farmerName}</h3>
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">Cultivator Profile</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-gray-700 font-bold">
                                    <Leaf className="w-5 h-5 text-forest-600" />
                                    <span>Affected Crop: <span className="text-forest-700 bg-forest-50 px-2 py-0.5 rounded-lg">{req.crop}</span></span>
                                </div>
                                <div className="flex gap-4 border-t border-gray-50 pt-4">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <MapPin className="w-4 h-4" /> <span className="text-xs font-medium">{req.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <Droplets className="w-4 h-4" /> <span className="text-xs font-medium">{req.soilType}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between mt-auto">
                            <button onClick={() => setSelectedRequest(req)} className="text-harvest-600 font-black text-sm uppercase tracking-widest hover:text-harvest-800 transition-colors">Details</button>
                            <button onClick={() => navigate('/schedule')} className="flex items-center gap-2 px-6 py-2.5 bg-harvest-500 text-white font-black rounded-xl text-xs hover:bg-harvest-600 transition-all">Set Schedule <ArrowRight className="w-4 h-4" /></button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {selectedRequest && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-md"
                        onClick={() => setSelectedRequest(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl relative"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-10 space-y-8">
                                <h2 className="text-3xl font-black uppercase text-gray-900">{selectedRequest.farmerName} - Full Details</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 italic">
                                        <p className="text-[10px] text-gray-400 font-black uppercase mb-1">Crop Affected</p>
                                        <p className="font-bold text-gray-900">{selectedRequest.crop}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 italic">
                                        <p className="text-[10px] text-gray-400 font-black uppercase mb-1">Soil Type</p>
                                        <p className="font-bold text-gray-900">{selectedRequest.soilType}</p>
                                    </div>
                                </div>
                                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 italic text-gray-700 leading-relaxed font-medium">
                                    "{selectedRequest.problem}"
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={() => setSelectedRequest(null)} className="flex-1 py-4 bg-gray-100 text-gray-500 font-black rounded-xl">Dismiss</button>
                                    <button onClick={() => navigate('/schedule')} className="flex-[2] py-4 bg-harvest-500 text-white font-black rounded-xl">Set Schedule</button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
