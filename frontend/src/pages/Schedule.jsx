import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, Video, User, ChevronLeft, ChevronRight, CheckCircle2, Leaf, Phone, X, Mic, Video as VideoIcon, Plus, Save } from 'lucide-react';

export default function Schedule() {
    const [activeVideoCall, setActiveVideoCall] = useState(null);
    const [isAvailabilityOverlayOpen, setIsAvailabilityOverlayOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(15); // Mock selected date
    const [savedSlots, setSavedSlots] = useState([]);

    // Mock Schedule Data
    const todayAppointments = [
        { id: 1, time: '10:00 AM', farmer: 'Ibrahim Musa', crop: 'Cassava', type: 'Video Call', status: 'Upcoming' },
        { id: 2, time: '11:30 AM', farmer: 'Oluwaseun Farms', crop: 'Maize', type: 'Video Call', status: 'Upcoming' },
        { id: 3, time: '02:00 PM', farmer: 'Chidi Okonkwo', crop: 'Tomato', type: 'In Person', status: 'Pending Confirmation' },
    ];

    const generateDays = () => {
        const days = [];
        // Mock days for current month
        for (let i = 1; i <= 31; i++) {
            days.push(i);
        }
        return days;
    };

    const handleSaveAvailability = () => {
        setSavedSlots([...savedSlots, selectedDate]);
        setIsAvailabilityOverlayOpen(false);
    };

    return (
        <div className="min-h-screen bg-earth-50 pt-24 pb-12 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-sage-200/40 rounded-full blur-[120px] -z-10 mix-blend-multiply opacity-70"></div>
            <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-earth-200/50 rounded-full blur-[100px] -z-10 mix-blend-multiply opacity-50"></div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4"
                >
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage-100 text-sage-800 text-xs font-bold uppercase tracking-wider mb-3">
                            <CalendarIcon className="w-3 h-3" /> Agenda
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">My Schedule</h1>
                        <p className="text-gray-600 mt-2 text-lg">Manage your upcoming escrow-funded consultations and availability.</p>
                    </div>
                    <button
                        onClick={() => setIsAvailabilityOverlayOpen(true)}
                        className="px-6 py-3 bg-sage-700 hover:bg-sage-900 text-white font-bold rounded-xl shadow-md shadow-sage-700/20 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    >
                        <Plus className="w-5 h-5" /> Set Availability
                    </button>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Interactive Calendar Widget */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="lg:col-span-5"
                    >
                        <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-8 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative">
                            {/* Decorative element */}
                            <div className="absolute -top-6 -right-6 w-24 h-24 bg-sage-100 rounded-full blur-2xl opacity-50 z-0"></div>
                            
                            <div className="flex items-center justify-between mb-8 relative z-10">
                                <div>
                                    <h3 className="font-black text-gray-900 text-2xl tracking-tight">October</h3>
                                    <p className="text-sage-600 font-bold text-sm">2026</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="w-10 h-10 rounded-full bg-gray-50 hover:bg-sage-50 text-gray-400 hover:text-sage-700 flex items-center justify-center transition-colors border border-gray-100">
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button className="w-10 h-10 rounded-full bg-gray-50 hover:bg-sage-50 text-gray-400 hover:text-sage-700 flex items-center justify-center transition-colors border border-gray-100">
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Days of week */}
                            <div className="grid grid-cols-7 gap-2 text-center text-xs font-black text-gray-400 uppercase tracking-widest mb-4 relative z-10">
                                <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                            </div>

                            {/* Dates grid */}
                            <div className="grid grid-cols-7 gap-2 text-center text-sm font-bold text-gray-700 relative z-10">
                                {/* Padding for start of month */}
                                <div className="aspect-square flex items-center justify-center opacity-0"></div>
                                <div className="aspect-square flex items-center justify-center opacity-0"></div>
                                <div className="aspect-square flex items-center justify-center opacity-0"></div>
                                <div className="aspect-square flex items-center justify-center opacity-0"></div>

                                {generateDays().map(day => {
                                    const isSelected = selectedDate === day;
                                    const hasAppointment = day === 4 || day === 15 || day === 22;
                                    const isSavedSlot = savedSlots.includes(day);

                                    return (
                                        <motion.button
                                            key={day}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => {
                                                setSelectedDate(day);
                                                setIsAvailabilityOverlayOpen(true);
                                            }}
                                            className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-colors ${
                                                isSelected 
                                                    ? 'bg-sage-700 text-white shadow-lg shadow-sage-700/30' 
                                                    : 'hover:bg-sage-50 text-gray-700 bg-gray-50/50'
                                            }`}
                                        >
                                            <span className="z-10">{day}</span>
                                            
                                            {/* Indicators */}
                                            <div className="flex gap-1 absolute bottom-2">
                                                {hasAppointment && (
                                                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-red-400'}`}></span>
                                                )}
                                                {isSavedSlot && (
                                                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-sage-300' : 'bg-sage-500'}`}></span>
                                                )}
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>

                    {/* Today's Agenda */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="lg:col-span-7 space-y-6"
                    >
                        <div className="flex items-center gap-3 mb-6 bg-white/50 p-4 rounded-2xl backdrop-blur-sm border border-white">
                            <div className="w-12 h-12 bg-sage-100 rounded-xl flex items-center justify-center shrink-0">
                                <Clock className="w-6 h-6 text-sage-700" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-gray-900 tracking-tight">Today's Appointments</h2>
                                <p className="text-sage-700 text-sm font-bold">Oct 15th, 2026</p>
                            </div>
                            <div className="ml-auto bg-white px-4 py-2 rounded-xl shadow-sm text-sm font-bold text-gray-700 border border-gray-100">
                                3 Scheduled
                            </div>
                        </div>

                        <div className="space-y-4">
                            {todayAppointments.map((apt, idx) => (
                                <motion.div
                                    key={apt.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.3 + (idx * 0.1) }}
                                    className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-sage-200 transition-all"
                                >
                                    <div className="flex items-center gap-6 w-full sm:w-auto">
                                        <div className="w-20 shrink-0 text-center bg-gray-50 py-3 rounded-2xl group-hover:bg-sage-50 transition-colors border border-gray-100">
                                            <div className="text-xl font-black text-gray-900">{apt.time.split(' ')[0]}</div>
                                            <div className="text-[10px] font-bold text-sage-600 uppercase tracking-widest">{apt.time.split(' ')[1]}</div>
                                        </div>
                                        
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2 group-hover:text-sage-700 transition-colors">
                                                {apt.farmer}
                                            </h3>
                                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-2 font-medium">
                                                <span className="flex items-center gap-1.5"><Leaf className="w-4 h-4 text-sage-500" /> {apt.crop}</span>
                                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                <span className="flex items-center gap-1.5"><Video className="w-4 h-4 text-blue-500" /> {apt.type}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-4 mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-gray-100">
                                        <div className={`text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap ${apt.status === 'Upcoming' ? 'bg-sage-100 text-sage-800' : 'bg-gray-100 text-gray-600'}`}>
                                            {apt.status}
                                        </div>
                                        <button
                                            onClick={() => setActiveVideoCall(apt)}
                                            className="bg-gray-900 text-white hover:bg-sage-700 transition-colors p-3 rounded-2xl shadow-md hover:-translate-y-0.5 active:translate-y-0"
                                        >
                                            <Video className="w-5 h-5 flex-shrink-0" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                </div>
            </div>

            {/* Set Availability Glassmorphic Overlay */}
            <AnimatePresence>
                {isAvailabilityOverlayOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md"
                        onClick={() => setIsAvailabilityOverlayOpen(false)}
                    >
                        <motion.div
                            initial={{ y: 40, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 40, opacity: 0, scale: 0.95 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden w-full max-w-lg relative border border-white/20"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="bg-gradient-to-br from-sage-800 to-sage-700 p-8 relative overflow-hidden">
                                {/* Decorative circles */}
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-xl"></div>
                                
                                <button
                                    onClick={() => setIsAvailabilityOverlayOpen(false)}
                                    className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-full transition-colors backdrop-blur-md z-10"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                
                                <div className="relative z-10">
                                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-5 border border-white/10 shadow-inner">
                                        <CalendarIcon className="w-7 h-7 text-white" />
                                    </div>
                                    <h2 className="text-3xl font-black text-white tracking-tight mb-1">
                                        Set Availability
                                    </h2>
                                    <p className="text-sage-200 text-sm font-medium">
                                        Configure your active slots for October {selectedDate}, 2026.
                                    </p>
                                </div>
                            </div>

                            <div className="p-8 bg-gray-50/50">
                                <div className="mb-6">
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Available Time Slots</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'].map((time) => (
                                            <label key={time} className="cursor-pointer group relative">
                                                <input type="checkbox" className="peer sr-only" defaultChecked={time === '10:00 AM' || time === '02:00 PM'} />
                                                <div className="p-3 text-center border border-gray-200 rounded-xl bg-white text-gray-600 font-bold text-sm transition-all peer-checked:bg-sage-100 peer-checked:border-sage-500 peer-checked:text-sage-800 hover:border-sage-300 shadow-sm peer-focus:ring-2 peer-focus:ring-sage-500 peer-focus:ring-offset-1">
                                                    {time}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="mb-8">
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Consultation Type</label>
                                    <div className="flex gap-4">
                                        <label className="flex-1 cursor-pointer">
                                            <input type="radio" name="type" className="peer sr-only" defaultChecked />
                                            <div className="flex items-center justify-center gap-2 p-4 border border-gray-200 rounded-xl bg-white text-gray-600 font-bold text-sm transition-all peer-checked:bg-earth-100 peer-checked:border-earth-500 peer-checked:text-earth-800 hover:border-earth-300 shadow-sm">
                                                <VideoIcon className="w-4 h-4" /> Video Call
                                            </div>
                                        </label>
                                        <label className="flex-1 cursor-pointer">
                                            <input type="radio" name="type" className="peer sr-only" />
                                            <div className="flex items-center justify-center gap-2 p-4 border border-gray-200 rounded-xl bg-white text-gray-600 font-bold text-sm transition-all peer-checked:bg-earth-100 peer-checked:border-earth-500 peer-checked:text-earth-800 hover:border-earth-300 shadow-sm">
                                                <User className="w-4 h-4" /> In Person
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button 
                                        onClick={() => setIsAvailabilityOverlayOpen(false)}
                                        className="flex-1 py-4 px-4 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleSaveAvailability}
                                        className="flex-1 py-4 px-4 bg-sage-700 hover:bg-sage-900 text-white font-bold rounded-xl shadow-md shadow-sage-700/20 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                                    >
                                        <Save className="w-5 h-5" /> Save Slots
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

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
