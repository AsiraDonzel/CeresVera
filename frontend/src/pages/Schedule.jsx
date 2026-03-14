import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, Video, User, ChevronLeft, ChevronRight, CheckCircle2, Leaf, Phone, X, Mic, Video as VideoIcon, Plus, Save, Trash2 } from 'lucide-react';

// Mock Default Data
const defaultAppointments = [
    { id: 1, time: '10:00 AM', farmer: 'Ibrahim Musa', crop: 'Cassava', type: 'Video Call', status: 'Upcoming' },
    { id: 2, time: '11:30 AM', farmer: 'Oluwaseun Farms', crop: 'Maize', type: 'Video Call', status: 'Upcoming' },
    { id: 3, time: '02:00 PM', farmer: 'Chidi Okonkwo', crop: 'Tomato', type: 'In Person', status: 'Upcoming' },
];

export default function Schedule() {
    const [activeVideoCall, setActiveVideoCall] = useState(null);
    const [isAvailabilityOverlayOpen, setIsAvailabilityOverlayOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(15); 
    const [currentDate, setCurrentDate] = useState(new Date(2026, 9)); // Default to October 2026

    const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    // States for the Modal Form
    const [selectedTimes, setSelectedTimes] = useState(['10:00 AM', '02:00 PM']);
    const [selectedType, setSelectedType] = useState('Video Call');

    // Filter state
    const [filterStatus, setFilterStatus] = useState('All'); // 'All', 'Upcoming', 'Completed'

    // Load from Local Storage or Defaults
    const [appointments, setAppointments] = useState(() => {
        const saved = localStorage.getItem('expert_appointments');
        if (saved) return JSON.parse(saved);
        return defaultAppointments;
    });

    const [savedSlots, setSavedSlots] = useState(() => {
        const saved = localStorage.getItem('expert_saved_slots');
        if (saved) return JSON.parse(saved);
        return [];
    });

    // Save to Local Storage on change
    useEffect(() => {
        localStorage.setItem('expert_appointments', JSON.stringify(appointments));
    }, [appointments]);

    useEffect(() => {
        localStorage.setItem('expert_saved_slots', JSON.stringify(savedSlots));
    }, [savedSlots]);

    const generateDays = () => {
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        return Array.from({ length: daysInMonth }, (_, i) => i + 1);
    };

    const toggleTimeSlot = (time) => {
        if (selectedTimes.includes(time)) {
            setSelectedTimes(selectedTimes.filter(t => t !== time));
        } else {
            setSelectedTimes([...selectedTimes, time]);
        }
    };

    const handleSaveAvailability = () => {
        // Mark the date on the calendar
        if (!savedSlots.includes(selectedDate)) {
            setSavedSlots([...savedSlots, selectedDate]);
        }
        
        // Create new 'Available Slot' blocks in the agenda so it appears
        const newSlots = selectedTimes.map((time, idx) => ({
            id: Date.now() + idx,
            date: selectedDate,
            time: time,
            farmer: 'Open Booking Slot',
            crop: 'Pending Client',
            type: selectedType,
            status: 'Upcoming'
        }));

        setAppointments([...appointments, ...newSlots]);
        setIsAvailabilityOverlayOpen(false);
    };

    const toggleAppointmentStatus = (id) => {
        setAppointments(appointments.map(apt => {
            if (apt.id === id) {
                return { ...apt, status: apt.status === 'Completed' ? 'Upcoming' : 'Completed' };
            }
            return apt;
        }));
    };

    const handleClearSchedule = () => {
        const confirmClear = window.confirm("Are you sure you want to clear your entire schedule? This cannot be undone.");
        if (confirmClear) {
            setAppointments([]);
            setSavedSlots([]);
        }
    };

    const markAllCompleted = () => {
        setAppointments(appointments.map(apt => ({ ...apt, status: 'Completed' })));
    };

    const timeSlotsOptions = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];

    // Filter appointments
    const filteredAppointments = appointments.filter(apt => {
        if (filterStatus === 'All') return true;
        return apt.status === filterStatus;
    });

    const hasCompletedAll = appointments.length > 0 && appointments.every(apt => apt.status === 'Completed');

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
                    <div className="flex gap-3 flex-wrap">
                        <button
                            onClick={handleClearSchedule}
                            className="px-6 py-3 bg-white text-red-600 border border-red-200 font-bold rounded-xl shadow-sm transition-all hover:-translate-y-0.5 hover:bg-red-50 flex items-center justify-center gap-2"
                        >
                            <Trash2 className="w-5 h-5" /> Clear Schedule
                        </button>
                        <button
                            onClick={() => setIsAvailabilityOverlayOpen(true)}
                            className="px-6 py-3 bg-sage-700 hover:bg-sage-900 text-white font-bold rounded-xl shadow-md shadow-sage-700/20 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                        >
                            <Plus className="w-5 h-5" /> Set Availability
                        </button>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Interactive Calendar Widget */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="lg:col-span-5"
                    >
                        <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-8 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative lg:sticky lg:top-28">
                            {/* Decorative element */}
                            <div className="absolute -top-6 -right-6 w-24 h-24 bg-sage-100 rounded-full blur-2xl opacity-50 z-0"></div>
                            
                            <div className="flex items-center justify-between mb-8 relative z-10">
                                <div className="min-w-[140px]">
                                    <h3 className="font-black text-gray-900 text-2xl tracking-tight">
                                        {currentDate.toLocaleString('default', { month: 'long' })}
                                    </h3>
                                    <p className="text-sage-600 font-bold text-sm">{currentDate.getFullYear()}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={handlePrevMonth}
                                        className="w-10 h-10 rounded-full bg-gray-50 hover:bg-sage-50 text-gray-400 hover:text-sage-700 flex items-center justify-center transition-colors border border-gray-100"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button 
                                        onClick={handleNextMonth}
                                        className="w-10 h-10 rounded-full bg-gray-50 hover:bg-sage-50 text-gray-400 hover:text-sage-700 flex items-center justify-center transition-colors border border-gray-100"
                                    >
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
                                {/* Padding for start of month - Simplified dynamic grid start */}
                                {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() }).map((_, i) => (
                                    <div key={`pad-${i}`} className="aspect-square flex items-center justify-center opacity-0"></div>
                                ))}

                                {generateDays().map(day => {
                                    const isSelected = selectedDate === day;
                                    const hasAppointment = appointments.some(apt => apt.date === day || (day === 15 && !apt.date)); // Fallback mock mapping
                                    const isSavedSlot = savedSlots.includes(day);

                                    return (
                                        <motion.button
                                            key={day}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => {
                                                setSelectedDate(day);
                                                setFilterStatus('All'); // Reset filters
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

                            {/* Legend */}
                            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-4 relative z-10 text-xs font-bold text-gray-500">
                                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-400"></span> Booked Consultation</div>
                                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-sage-500"></span> Available Open Slot</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Agenda */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="lg:col-span-7 space-y-6"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white/50 p-4 rounded-3xl backdrop-blur-sm border border-white shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-sage-100 rounded-xl flex items-center justify-center shrink-0">
                                    <Clock className="w-6 h-6 text-sage-700" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-gray-900 tracking-tight">
                                        Agenda for {currentDate.toLocaleString('default', { month: 'short' })} {selectedDate}
                                    </h2>
                                    <div className="text-sm font-medium text-gray-500 mt-0.5">
                                        {appointments.length} Items Total
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                {['All', 'Upcoming', 'Completed'].map(status => (
                                    <button 
                                        key={status} 
                                        onClick={() => setFilterStatus(status)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                            filterStatus === status 
                                                ? 'bg-gray-900 text-white shadow-sm' 
                                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                        }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Mark all completed shortcut */}
                        {appointments.length > 0 && !hasCompletedAll && (
                            <div className="flex justify-end">
                                <button onClick={markAllCompleted} className="text-sm font-bold text-sage-600 hover:text-sage-800 transition-colors flex items-center gap-1.5 bg-sage-50 px-3 py-1.5 rounded-full">
                                    <CheckCircle2 className="w-4 h-4" /> Mark Everything Completed
                                </button>
                            </div>
                        )}

                        <div className="space-y-4">
                            <AnimatePresence>
                                {filteredAppointments.length === 0 ? (
                                    <motion.div 
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="bg-white rounded-3xl p-12 text-center border border-gray-100 border-dashed"
                                    >
                                        <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-gray-900 font-bold text-lg">No {filterStatus !== 'All' ? filterStatus.toLowerCase() : ''} schedules found.</h3>
                                        <p className="text-gray-500 mt-1">Select a different date or set up availability.</p>
                                    </motion.div>
                                ) : (
                                    filteredAppointments.map((apt, idx) => {
                                        const isCompleted = apt.status === 'Completed';

                                        return (
                                            <motion.div
                                                key={apt.id}
                                                layout
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ duration: 0.3, delay: idx * 0.05 }}
                                                className={`rounded-3xl p-6 border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] relative overflow-hidden ${
                                                    isCompleted 
                                                        ? 'bg-gray-50 border-gray-200 opacity-75' 
                                                        : 'bg-white border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:border-sage-200'
                                                }`}
                                            >
                                                {/* Left Green Bar for upcoming */}
                                                {!isCompleted && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-sage-400"></div>}
                                                {/* Left Gray bar for completed */}
                                                {isCompleted && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gray-300"></div>}

                                                <div className="flex items-center gap-6 w-full sm:w-auto pl-2">
                                                    <div className={`w-20 shrink-0 text-center py-3 rounded-2xl transition-colors border ${isCompleted ? 'bg-gray-100 border-gray-200 text-gray-500' : 'bg-gray-50 border-gray-100 text-gray-900 group-hover:bg-sage-50'}`}>
                                                        <div className={`text-xl font-black ${isCompleted ? 'line-through' : ''}`}>{apt.time.split(' ')[0]}</div>
                                                        <div className={`text-[10px] font-bold uppercase tracking-widest ${isCompleted ? 'text-gray-400' : 'text-sage-600'}`}>{apt.time.split(' ')[1]}</div>
                                                    </div>
                                                    
                                                    <div>
                                                        <h3 className={`font-bold text-lg flex items-center gap-2 transition-colors ${isCompleted ? 'text-gray-500' : 'text-gray-900 group-hover:text-sage-700'}`}>
                                                            {apt.farmer}
                                                            {apt.farmer === 'Open Booking Slot' && <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest ml-2">Available</span>}
                                                        </h3>
                                                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-2 font-medium">
                                                            <span className="flex items-center gap-1.5">
                                                                <Leaf className={`w-4 h-4 ${isCompleted ? 'text-gray-400' : 'text-sage-500'}`} /> {apt.crop}
                                                            </span>
                                                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                            <span className="flex items-center gap-1.5">
                                                                {apt.type === 'Video Call' ? <Video className="w-4 h-4 text-blue-500" /> : <User className="w-4 h-4 text-amber-500" />} {apt.type}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex w-full sm:w-auto flex-col sm:items-end gap-3 mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-gray-100">
                                                    
                                                    <button 
                                                        onClick={() => toggleAppointmentStatus(apt.id)}
                                                        className={`text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap border transition-colors flex items-center gap-1.5 ${
                                                            isCompleted 
                                                                ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200' 
                                                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                                                        }`}
                                                    >
                                                        {isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                                                        {isCompleted ? 'Completed' : 'Mark Complete'}
                                                    </button>

                                                    {!isCompleted && apt.type === 'Video Call' && apt.farmer !== 'Open Booking Slot' && (
                                                        <button
                                                            onClick={() => setActiveVideoCall(apt)}
                                                            className="bg-gray-900 text-white hover:bg-sage-700 transition-colors px-4 py-2 text-sm font-bold rounded-xl shadow-md flex items-center justify-center gap-2"
                                                        >
                                                            <Video className="w-4 h-4" /> Start Call
                                                        </button>
                                                    )}
                                                </div>
                                            </motion.div>
                                        );
                                    })
                                )}
                            </AnimatePresence>
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
                            className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden w-full max-w-lg relative border border-white/20 flex flex-col max-h-[90vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="bg-gradient-to-br from-sage-800 to-sage-700 p-8 relative overflow-hidden shrink-0">
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
                                        Configure slots for {currentDate.toLocaleString('default', { month: 'long' })} {selectedDate}, {currentDate.getFullYear()}.
                                    </p>
                                </div>
                            </div>

                            <div className="p-8 bg-gray-50/50 overflow-y-auto">
                                <div className="mb-6">
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Available Time Slots</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {timeSlotsOptions.map((time) => {
                                            const isSelected = selectedTimes.includes(time);
                                            return (
                                                <button 
                                                    key={time} 
                                                    onClick={() => toggleTimeSlot(time)}
                                                    className={`p-3 text-center border rounded-xl font-bold text-sm transition-all shadow-sm ${
                                                        isSelected 
                                                            ? 'bg-sage-100 border-sage-500 text-sage-800 ring-2 ring-sage-500 ring-offset-1' 
                                                            : 'bg-white border-gray-200 text-gray-600 hover:border-sage-300'
                                                    }`}
                                                >
                                                    {time}
                                                </button>
                                            )
                                        })}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">* These slots will appear instantly in your schedule.</p>
                                </div>
                                
                                <div className="mb-8">
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Consultation Type</label>
                                    <div className="flex gap-4">
                                        <label className="flex-1 cursor-pointer">
                                            <input type="radio" name="type" className="peer sr-only" checked={selectedType === 'Video Call'} onChange={() => setSelectedType('Video Call')} />
                                            <div className="flex items-center justify-center gap-2 p-4 border rounded-xl bg-white text-gray-600 font-bold text-sm transition-all peer-checked:bg-blue-50 peer-checked:border-blue-500 peer-checked:text-blue-800 hover:border-blue-300 shadow-sm">
                                                <VideoIcon className="w-4 h-4" /> Video Call
                                            </div>
                                        </label>
                                        <label className="flex-1 cursor-pointer">
                                            <input type="radio" name="type" className="peer sr-only" checked={selectedType === 'In Person'} onChange={() => setSelectedType('In Person')} />
                                            <div className="flex items-center justify-center gap-2 p-4 border rounded-xl bg-white text-gray-600 font-bold text-sm transition-all peer-checked:bg-amber-50 peer-checked:border-amber-500 peer-checked:text-amber-800 hover:border-amber-300 shadow-sm">
                                                <User className="w-4 h-4" /> In Person
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-2 border-t border-gray-200">
                                    <button 
                                        onClick={() => setIsAvailabilityOverlayOpen(false)}
                                        className="flex-1 py-4 px-4 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleSaveAvailability}
                                        disabled={selectedTimes.length === 0}
                                        className="flex-1 py-4 px-4 bg-sage-700 hover:bg-sage-900 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                                    >
                                        <Save className="w-5 h-5" /> Post Slots
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
