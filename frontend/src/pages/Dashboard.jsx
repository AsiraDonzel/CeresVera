import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, CheckCircle, Clock, AlertTriangle, ChevronRight, CloudRain, MessageCircle, Activity, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    // Mock data for Farmer Insights
    const [recentScans, setRecentScans] = useState([]);
    const [showAllScans, setShowAllScans] = useState(false);
    const [selectedHistoryScan, setSelectedHistoryScan] = useState(null);

    const [consultations, setConsultations] = useState([
        { id: 101, expert: 'Dr. Amina', date: 'Oct 11, 2026', status: 'Completed', type: 'Video Call', pendingEscrow: false },
        { id: 102, expert: 'Mr. Tunde', date: 'Oct 01, 2026', status: 'Follow-up Pending', type: 'Chat', pendingEscrow: true },
    ]);

    const [weatherData, setWeatherData] = useState(null);
    const [toastMessage, setToastMessage] = useState('');

    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(''), 3000);
    };

    useEffect(() => {
        // [HACKATHON REQUIREMENT] OpenWeatherMap Dashboard Integration
        const openWeatherKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

        async function fetchWeather() {
            if (openWeatherKey) {
                try {
                    // Try fetching weather based on the user's saved Farm Profile Location
                    // Fallback to 'Abuja,ng' if not set
                    const savedLocation = localStorage.getItem('farm_location') || 'Abuja,ng';

                    // Clean up the location string to make it URL-friendly for the API 
                    // (e.g., 'Ogun State, Nigeria' -> 'Ogun State, Nigeria')
                    const encodedLocation = encodeURIComponent(savedLocation);

                    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodedLocation}&units=metric&appid=${openWeatherKey}`);
                    if (!res.ok) throw new Error('Weather API error');
                    const data = await res.json();

                    setWeatherData({
                        temp: Math.round(data.main.temp),
                        condition: data.weather[0].main,
                        humidity: data.main.humidity,
                        locationName: data.name // Store the exact city name matched by the API
                    });
                } catch (error) {
                    console.error("Failed to fetch live weather:", error);
                    // Fallback to mock if API call fails
                    setWeatherData({ temp: 28, condition: 'Light Rain', humidity: 76, locationName: 'Local' });
                }
            } else {
                setWeatherData({ temp: 31, condition: 'Sunny', humidity: 60, locationName: 'Local' });
            }
        }

        fetchWeather();

        // Load scans from localStorage
        const savedScans = JSON.parse(localStorage.getItem('recent_scans') || '[]');
        if (savedScans.length > 0) {
            setRecentScans(savedScans.sort((a, b) => b.id - a.id));
        } else {
            // Fallback to defaults if empty
            setRecentScans([
                { id: 1, date: 'Oct 12, 2026', time: '10:30 AM', crop: 'Tomato', status: 'Healthy', isHealthy: true, weather: { temp: 28, condition: 'Sunny' } },
                { id: 2, date: 'Oct 10, 2026', time: '02:15 PM', crop: 'Maize', status: 'Leaf Blight', isHealthy: false, weather: { temp: 31, condition: 'Cloudy' } },
                { id: 3, date: 'Oct 05, 2026', time: '09:00 AM', crop: 'Cassava', status: 'Healthy', isHealthy: true, weather: { temp: 27, condition: 'Clear' } },
            ]);
        }
    }, []);

    useEffect(() => {
        if (weatherData) {
            localStorage.setItem('current_weather', JSON.stringify(weatherData));
        }
    }, [weatherData]);

    const handleSendbirdLaunch = (expertName) => {
        // [HACKATHON REQUIREMENT] Sendbird Chat Integration
        const sendbirdId = import.meta.env.VITE_SENDBIRD_APP_ID;
        console.log(`Launching Sendbird (${sendbirdId}) chat window with ${expertName}...`);
        showToast(`Connecting secure chat session with ${expertName}...`);
    };

    const handleReleaseEscrow = (id) => {
        // In reality, this would call /api/payment/release-escrow/
        setConsultations(prev => prev.map(c =>
            c.id === id ? { ...c, pendingEscrow: false, status: 'Completed' } : c
        ));
        showToast('Escrow funds successfully released to Agronomist!');
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 relative">
            {/* Subtle background decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-sage-200/40 rounded-full blur-3xl -z-10 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl -z-10 pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6"
            >
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Farmer Insights</h1>
                    <p className="text-gray-600 mt-1">Overview of your crop health and expert consultations.</p>
                </div>
                <Link to="/scan" className="bg-sage-700 text-white px-8 py-3.5 rounded-full font-bold flex items-center gap-3 hover:bg-sage-900 transition-all shadow-lg shadow-sage-700/30 hover:-translate-y-1">
                    <Camera className="w-5 h-5" /> Start New Scan
                </Link>
            </motion.div>

            <motion.div
                variants={containerVariants} initial="hidden" animate="show"
                className="grid lg:grid-cols-3 gap-8"
            >

                {/* Left Column - Stats & History */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Quick Stats Grid */}
                    <div className="grid sm:grid-cols-3 gap-6">
                        <motion.div variants={itemVariants} className="bg-white p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow border border-gray-100 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Activity className="w-16 h-16" /></div>
                            <div className="text-gray-500 mb-2 font-medium flex items-center justify-between">
                                Total Scans <ArrowUpRight className="w-4 h-4 text-green-500" />
                            </div>
                            <div className="text-5xl font-black text-gray-900 tracking-tight">24</div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="bg-gradient-to-br from-green-50 to-sage-100 p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow border border-green-200 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform text-green-700"><CheckCircle className="w-16 h-16" /></div>
                            <div className="text-green-800 mb-2 font-medium">Healthy Crops</div>
                            <div className="text-5xl font-black text-green-600 tracking-tight">82%</div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow border border-blue-100 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform text-blue-700"><CloudRain className="w-16 h-16" /></div>
                            <div className="text-blue-800 mb-2 font-medium truncate pr-8" title={`${weatherData?.locationName || 'Local'} Weather`}>{weatherData?.locationName || 'Local'} Weather</div>
                            <div className="text-4xl font-black text-gray-900 tracking-tight">{weatherData?.temp}°C</div>
                            <div className="text-sm font-bold text-blue-600 mt-1 uppercase tracking-wider">{weatherData?.condition}</div>
                        </motion.div>
                    </div>

                    {/* Enhanced Trend Card */}
                    <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex flex-col">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-[#0F172A]">Crop Health Trend</h2>
                                <p className="text-sm font-medium text-gray-500 mt-1">Average Plant Vitality Index</p>
                            </div>
                            <div className="flex items-center gap-2 relative group">
                                <span className="bg-sage-100 text-sage-800 text-sm font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                                    <ArrowUpRight className="w-4 h-4" /> +12%
                                </span>
                            </div>
                        </div>

                        <div className="flex-1 min-h-[220px] flex items-end justify-between gap-3 sm:gap-4 relative pt-6">
                            {/* Horizontal Background Grid */}
                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-7 z-0">
                                {[100, 75, 50, 25, 0].map(val => (
                                    <div key={val} className="w-full flex items-center gap-3">
                                        <span className="text-[10px] sm:text-xs font-bold text-gray-300 w-6 text-right select-none">{val}</span>
                                        <div className="flex-1 border-t border-dashed border-gray-100" />
                                    </div>
                                ))}
                            </div>

                            {/* Animated Dynamic Bar Chart */}
                            {[
                                { day: 'Mon', val: 40, label: 'Poor' },
                                { day: 'Tue', val: 60, label: 'Fair' },
                                { day: 'Wed', val: 45, label: 'Warning' },
                                { day: 'Thu', val: 80, label: 'Healthy' },
                                { day: 'Fri', val: 50, label: 'Fair' },
                                { day: 'Sat', val: 90, label: 'Excellent' },
                                { day: 'Sun', val: 85, label: 'Excellent' }
                            ].map((item, i) => {
                                let barColor = 'bg-gradient-to-t from-rose-500 to-rose-400 group-hover:from-rose-600 group-hover:to-rose-500';
                                let textColor = 'text-red-400';
                                
                                if (item.val >= 80) {
                                    barColor = 'bg-gradient-to-t from-sage-600 to-sage-400 group-hover:from-sage-700 group-hover:to-sage-500';
                                    textColor = 'text-sage-400';
                                } else if (item.val >= 50) {
                                    barColor = 'bg-gradient-to-t from-amber-500 to-amber-300 group-hover:from-amber-600 group-hover:to-amber-400';
                                    textColor = 'text-amber-400';
                                }

                                return (
                                    <div key={i} className="flex-1 h-full flex flex-col justify-end group relative z-10 cursor-pointer pb-7">
                                        {/* Hover Tooltip - Positioned above the actual bar fill dynamically */}
                                        <div
                                            className="absolute left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-gray-900 border border-gray-700 text-white text-xs font-bold py-2 px-3 rounded-xl whitespace-nowrap z-20 shadow-2xl pointer-events-none flex flex-col items-center group-hover:-translate-y-2"
                                            style={{ bottom: `calc(${item.val}% + 24px)` }}
                                        >
                                            <span className="text-white text-sm mb-0.5">{item.val}%</span>
                                            <span className={textColor}>{item.label}</span>
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                                        </div>

                                        {/* Vertical Bar Container */}
                                        <div className="w-full max-w-[48px] mx-auto bg-gray-50/50 rounded-xl relative h-[calc(100%-1.75rem)] flex items-end overflow-hidden group-hover:bg-gray-100 transition-colors">
                                            {/* Filled Bar Area */}
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${item.val}%` }}
                                                transition={{ duration: 1.2, delay: i * 0.1, type: "spring", stiffness: 45 }}
                                                className={`w-full rounded-xl transition-all duration-300 relative shadow-inner ${barColor}`}
                                            >
                                                {/* Micro-shine detail at top of bar */}
                                                <div className="absolute top-0 left-1 right-1 h-1.5 bg-white/30 rounded-full mt-1" />
                                            </motion.div>
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 text-center text-xs sm:text-sm font-bold text-gray-400 group-hover:text-gray-900 transition-colors">
                                            {item.day}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Recent Scans */}
                    <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">Recent Scans</h2>
                            <button 
                                onClick={() => setShowAllScans(!showAllScans)}
                                className="text-sage-700 font-black text-sm hover:text-sage-900 transition-colors flex items-center gap-1 bg-sage-50 px-4 py-2 rounded-full border border-sage-100 shadow-sm"
                            >
                                {showAllScans ? 'Show Recent Only' : `View All History (${recentScans.length})`} <ChevronRight className={`w-4 h-4 transition-transform ${showAllScans ? 'rotate-90' : ''}`} />
                            </button>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {(showAllScans ? recentScans : recentScans.slice(0, 3)).map((scan, idx) => (
                                <div key={scan.id || idx} onClick={() => setSelectedHistoryScan(scan)} className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-5">
                                        <div className={`p-3 rounded-2xl shadow-sm border border-gray-100 group-hover:scale-110 transition-all ${scan.isHealthy ? 'bg-green-50' : 'bg-amber-50'}`}>
                                            {scan.isHealthy ? <CheckCircle className="w-5 h-5 text-green-500" /> : <AlertTriangle className="w-5 h-5 text-amber-500" />}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                                {scan.crop}
                                                {scan.weather && (
                                                    <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded uppercase tracking-wider">
                                                        {scan.weather.temp}°C {scan.weather.condition}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-sm text-gray-500 font-medium mt-1 flex items-center gap-1.5 flex-wrap">
                                                <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {scan.date} {scan.time && `at ${scan.time}`}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right flex items-center gap-4">
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase ${scan.isHealthy ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700 border border-amber-200'}`}>
                                            {scan.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Premium: What-If Simulator */}
                    <motion.div variants={itemVariants} className="bg-gradient-to-br from-indigo-900 to-earth-900 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-0"></div>
                        <div className="relative z-10">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <span className="px-3 py-1 bg-amber-400 text-earth-900 text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm mb-4 inline-block">Premium Feature</span>
                                    <h2 className="text-2xl font-black text-white">Predictive Yield Analytics</h2>
                                    <p className="text-indigo-200 text-sm mt-2 max-w-md">Simulate fertilizer and irrigation variables to visualize ROI before planting.</p>
                                </div>
                                <div className="w-16 h-16 bg-white/10 rounded-2xl backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                                    <Activity className="w-8 h-8" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                    <div className="text-[10px] font-bold text-indigo-300 uppercase mb-2">Scenario Alpha</div>
                                    <div className="flex justify-between items-end">
                                        <div className="text-xl font-bold text-white">Expected Yield</div>
                                        <div className="text-emerald-400 text-xs font-bold">+18.5%</div>
                                    </div>
                                    <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                                        <div className="bg-emerald-400 h-full w-[85%]"></div>
                                    </div>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                    <div className="text-[10px] font-bold text-indigo-300 uppercase mb-2">ROI Forecast</div>
                                    <div className="flex justify-between items-end">
                                        <div className="text-xl font-bold text-white">₦1.2M / Acre</div>
                                        <div className="text-indigo-400 text-xs font-bold">EST.</div>
                                    </div>
                                    <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                                        <div className="bg-indigo-400 h-full w-[65%]"></div>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full py-4 bg-white text-earth-900 font-black rounded-2xl hover:bg-indigo-50 transition-all shadow-xl flex items-center justify-center gap-2 group">
                                Open What-If Simulator <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Right Column - Consultations */}
                <motion.div variants={itemVariants} className="space-y-8">
                    <div className="bg-earth-900 text-white rounded-[2.5rem] shadow-xl p-8 relative overflow-hidden">
                        {/* Decorative dark background swoosh */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-earth-800 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

                        <h2 className="text-2xl font-bold mb-8 relative z-10">Consultation History</h2>

                        <div className="space-y-4 relative z-10">
                            {consultations.map((c) => (
                                <div key={c.id} className="bg-white text-gray-900 p-5 rounded-2xl shadow-lg relative overflow-hidden transform hover:-translate-y-1 transition-transform">
                                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${c.pendingEscrow ? 'bg-amber-400' : 'bg-sage-500'}`}></div>
                                    <div className="pl-3">
                                        <div className="font-bold text-lg">{c.expert}</div>
                                        <div className="flex justify-between items-center mt-2">
                                            <div className="text-sm text-gray-500 font-medium">{c.type} &bull; {c.date}</div>
                                            <div className="text-[10px] font-bold text-sage-900 bg-sage-100 px-2 py-1 rounded tracking-wide uppercase">{c.status}</div>
                                        </div>

                                        {/* Action Area */}
                                        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-2">
                                            {c.pendingEscrow && (
                                                <div className="flex items-center justify-between bg-amber-50 p-2 rounded-lg border border-amber-100">
                                                    <span className="text-xs text-amber-700 font-bold shrink-0">Funds in Escrow</span>
                                                    <button
                                                        onClick={() => handleReleaseEscrow(c.id)}
                                                        className="text-[10px] uppercase tracking-wider bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded-md font-bold transition-colors shadow-sm"
                                                    >
                                                        Release Funds
                                                    </button>
                                                </div>
                                            )}
                                            {c.type === 'Chat' && (
                                                <button
                                                    onClick={() => handleSendbirdLaunch(c.expert)}
                                                    className="w-full text-sm bg-sage-50 border border-sage-200 hover:bg-sage-100 text-sage-800 py-2.5 rounded-xl font-bold transition-colors flex justify-center items-center gap-2"
                                                >
                                                    <MessageCircle className="w-4 h-4" /> Resume Chat Session
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Link to="/consultants" className="mt-8 block w-full text-center bg-sage-500 text-white font-bold py-4 rounded-xl hover:bg-sage-400 transition-colors shadow-lg relative z-10">
                            Book New Expert
                        </Link>
                    </div>
                </motion.div>

            </motion.div>

            {/* Scan Detail Modal */}
            <AnimatePresence>
                {selectedHistoryScan && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md"
                        onClick={() => setSelectedHistoryScan(null)}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className={`h-4 ${selectedHistoryScan.isHealthy ? 'bg-green-500' : 'bg-amber-500'}`} />
                            <div className="p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${selectedHistoryScan.isHealthy ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                            Analysis Result
                                        </span>
                                        <h3 className="text-3xl font-black text-gray-900 mt-2">{selectedHistoryScan.status}</h3>
                                        <p className="text-gray-500 font-bold mt-1 uppercase text-xs tracking-widest">{selectedHistoryScan.crop} &bull; {selectedHistoryScan.date}</p>
                                    </div>
                                    <button onClick={() => setSelectedHistoryScan(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">&times;</button>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-earth-50 p-6 rounded-3xl border border-gray-100">
                                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">AI Deep Analysis</h4>
                                        <p className="text-gray-700 font-medium leading-relaxed">
                                            {selectedHistoryScan.description || "Plants with symptoms like those observed require integrated pest management (IPM) strategies to prevent spread and maximize yield."}
                                        </p>
                                    </div>

                                    {selectedHistoryScan.recommended_action && (
                                        <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                                            <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-3">Expert Recommendation</h4>
                                            <p className="text-indigo-900 font-bold leading-relaxed">
                                                {selectedHistoryScan.recommended_action}
                                            </p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                            <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Confidence</div>
                                            <div className="text-lg font-black text-gray-900">{selectedHistoryScan.confidence ? `${Math.round(selectedHistoryScan.confidence)}%` : '85%'}</div>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                            <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Condition</div>
                                            <div className="text-lg font-black text-gray-900">{selectedHistoryScan.weather?.temp}°C {selectedHistoryScan.weather?.condition}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex gap-3">
                                    <button onClick={() => setSelectedHistoryScan(null)} className="flex-1 py-4 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-all">Close Details</button>
                                    {!selectedHistoryScan.isHealthy && (
                                        <Link to="/consultants" className="flex-[2] py-4 px-6 bg-sage-700 hover:bg-sage-800 text-white font-bold rounded-2xl transition-all shadow-lg shadow-sage-700/20 text-center flex items-center justify-center gap-2">
                                            Talk to Expert <ArrowUpRight className="w-4 h-4" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* In-App Toast Notification */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-medium text-sm border border-gray-800"
                    >
                        <CheckCircle2 className="w-5 h-5 text-sage-400" />
                        {toastMessage}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
