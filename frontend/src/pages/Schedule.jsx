import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, Video, User, ChevronLeft, ChevronRight, CheckCircle2, Leaf, Phone, X, Mic, Video as VideoIcon } from 'lucide-react';

export default function Schedule() {
    const [activeVideoCall, setActiveVideoCall] = useState(null);
    const [isAvailabilitySet, setIsAvailabilitySet] = useState(false);

    // Mock Schedule Data
    const todayAppointments = [
        { id: 1, time: '10:00 AM', farmer: 'Ibrahim Musa', crop: 'Cassava', type: 'Video Call', status: 'Upcoming' },
        { id: 2, time: '11:30 AM', farmer: 'Oluwaseun Farms', crop: 'Maize', type: 'Video Call', status: 'Upcoming' },
        { id: 3, time: '02:00 PM', farmer: 'Chidi Okonkwo', crop: 'Tomato', type: 'In Person', status: 'Pending Confirmation' },
    ];

    return (
        <div className="min-h-screen bg-earth-50 pt-24 pb-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Schedule</h1>
                        <p className="text-gray-600 mt-1">Manage your upcoming escrow-funded consultations.</p>
                    </div>
                    <button
                        onClick={() => setIsAvailabilitySet(true)}
                        className={`px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 shadow-sm ${isAvailabilitySet
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-sage-700 hover:bg-sage-900 text-white shadow-sage-700/20'
                            }`}
                    >
                        {isAvailabilitySet ? <CheckCircle2 className="w-5 h-5" /> : <CalendarIcon className="w-5 h-5" />}
                        {isAvailabilitySet ? 'Availability Set' : 'Set Availability'}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Calendar Widget (Mock) */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-gray-900 text-lg">October 2026</h3>
                                <div className="flex gap-2 text-gray-400">
                                    <ChevronLeft className="w-5 h-5 cursor-pointer hover:text-sage-700 transition-colors" />
                                    <ChevronRight className="w-5 h-5 cursor-pointer hover:text-sage-700 transition-colors" />
                                </div>
                            </div>

                            {/* Days of week */}
                            <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-gray-400 mb-2">
                                <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                            </div>

                            {/* Dates grid (Mocked for current week) */}
                            <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-gray-700">
                                <div className="p-2 opacity-30">27</div>
                                <div className="p-2 opacity-30">28</div>
                                <div className="p-2 opacity-30">29</div>
                                <div className="p-2 opacity-30">30</div>
                                <div className="p-2">1</div>
                                <div className="p-2">2</div>
                                <div className="p-2 relative">3<span className="absolute bottom-1 right-1 w-1 h-1 bg-sage-500 rounded-full"></span></div>

                                <div className="p-2 bg-sage-700 text-white rounded-xl shadow-sm relative">4<span className="absolute -top-1 -right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 flex items-center justify-center border border-white"></span></span></div>
                                <div className="p-2 hover:bg-sage-50 rounded-xl cursor-pointer relative">5<span className="absolute bottom-1 left-1.5 w-1 h-1 bg-amber-500 rounded-full"></span></div>
                                <div className="p-2 hover:bg-sage-50 rounded-xl cursor-pointer">6</div>
                                <div className="p-2 hover:bg-sage-50 rounded-xl cursor-pointer relative">7<span className="absolute bottom-1 right-1.5 w-1 h-1 bg-sage-500 rounded-full"></span></div>
                                <div className="p-2 hover:bg-sage-50 rounded-xl cursor-pointer">8</div>
                                <div className="p-2 hover:bg-sage-50 rounded-xl cursor-pointer">9</div>
                                <div className="p-2 hover:bg-sage-50 rounded-xl cursor-pointer relative">10<span className="absolute bottom-1 left-1.5 w-1 h-1 bg-blue-500 rounded-full"></span></div>
                            </div>
                        </div>
                    </div>

                    {/* Today's Agenda */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-xl font-bold text-gray-900 border-l-4 border-sage-500 pl-3">Today's Appointments</h2>
                            <span className="bg-sage-100 text-sage-800 text-xs px-2 py-0.5 rounded-full font-bold">Oct 4th</span>
                        </div>

                        <motion.div
                            initial="hidden" animate="show"
                            variants={{
                                hidden: { opacity: 0 },
                                show: { opacity: 1, transition: { staggerChildren: 0.1 } }
                            }}
                            className="space-y-4"
                        >
                            {todayAppointments.map((apt, idx) => (
                                <motion.div
                                    key={apt.id}
                                    variants={{
                                        hidden: { opacity: 0, y: 10 },
                                        show: { opacity: 1, y: 0, transition: { type: 'spring' } }
                                    }}
                                    className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:border-sage-300 transition-colors"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 shrink-0 text-center">
                                            <div className="text-sm font-black text-gray-900">{apt.time.split(' ')[0]}</div>
                                            <div className="text-[10px] font-bold text-gray-500 uppercase">{apt.time.split(' ')[1]}</div>
                                        </div>
                                        <div className="w-px h-10 bg-gray-200 hidden sm:block"></div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                                {apt.farmer}
                                            </h3>
                                            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                                <span className="flex items-center gap-1"><Leaf className="w-3 h-3 text-sage-600" /> {apt.crop}</span>
                                                <span className="flex items-center gap-1"><Video className="w-3 h-3 text-blue-500" /> {apt.type}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex w-full sm:w-auto items-center gap-3 mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-gray-100">
                                        <div className={`text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ${apt.status === 'Upcoming' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {apt.status}
                                        </div>
                                        <button
                                            onClick={() => setActiveVideoCall(apt)}
                                            className="bg-sage-50 text-sage-700 hover:bg-sage-700 hover:text-white transition-colors p-2 rounded-xl"
                                        >
                                            <Video className="w-5 h-5" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                </div>
            </div>

            {/* Premium Video Call Overlay Modal */}
            <AnimatePresence>
                {activeVideoCall && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            className="bg-black text-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl relative border border-gray-800"
                        >
                            <div className="absolute top-6 left-8 z-10">
                                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span> REC
                                </span>
                            </div>
                            <button onClick={() => setActiveVideoCall(null)} className="absolute top-6 right-8 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors backdrop-blur-md">
                                <X className="w-5 h-5" />
                            </button>

                            {/* Mock Video Feed Area */}
                            <div className="aspect-video bg-gray-900 relative flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-0"></div>
                                <div className="w-32 h-32 rounded-full bg-gray-800 border-4 border-gray-700 flex items-center justify-center z-10 shadow-xl">
                                    <User className="w-12 h-12 text-gray-500" />
                                </div>

                                {/* Self View PIP */}
                                <div className="absolute bottom-6 flex justify-between items-end w-full px-8 z-10">
                                    <div>
                                        <h3 className="font-bold text-xl">{activeVideoCall.farmer}</h3>
                                        <p className="text-gray-400 text-sm">Reviewing: {activeVideoCall.crop}</p>
                                    </div>
                                    <div className="w-24 h-36 bg-gray-800 rounded-2xl border-2 border-gray-600 shadow-xl flex items-center justify-center overflow-hidden">
                                        <span className="text-xs text-gray-500 font-bold uppercase">You</span>
                                    </div>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="p-6 bg-gray-950 flex justify-center gap-4">
                                <button className="w-14 h-14 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"><Mic className="w-6 h-6" /></button>
                                <button className="w-14 h-14 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"><VideoIcon className="w-6 h-6" /></button>
                                <button onClick={() => setActiveVideoCall(null)} className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center transition-colors shadow-lg shadow-red-900/50">
                                    <Phone className="w-6 h-6 fill-white rotate-135 transform" />
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
