import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Camera, CheckCircle, Clock, AlertTriangle, ChevronRight, 
    CloudRain, MessageCircle, Activity, ArrowUpRight, CheckCircle2,
    LayoutDashboard, Database, Users, Cloud, Sparkles, Settings,
    Search, Bell, HelpCircle, LogOut, Filter, ChevronDown, Monitor,
    X, Copy, Search
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function Dashboard() {
    const [recentScans, setRecentScans] = useState([]);
    const [weatherData, setWeatherData] = useState(null);
    const [toastMessage, setToastMessage] = useState('');
    const [selectedScan, setSelectedScan] = useState(null);
    const userName = localStorage.getItem('user_name') || 'User';
    const userEmail = localStorage.getItem('user_email') || '';
    const userPhone = localStorage.getItem('user_phone') || '';
    const farmName = localStorage.getItem('farm_name') || '';
    const farmState = localStorage.getItem('state') || localStorage.getItem('farm_location') || '';
    const primaryCrop = localStorage.getItem('primary_crop') || '';
    const farmSize = localStorage.getItem('farm_size') || '';

    const maskEmail = (email) => {
        if (!email || email.length < 5) return email;
        const [local, domain] = email.split('@');
        if (!domain) return email;
        return local.slice(0, 2) + '***@' + domain;
    };
    const maskPhone = (phone) => {
        if (!phone || phone.length < 6) return phone;
        return phone.slice(0, 4) + '****' + phone.slice(-3);
    };

    useEffect(() => {
        const openWeatherKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
        async function fetchWeather() {
            if (openWeatherKey) {
                try {
                    const savedLocation = localStorage.getItem('farm_location') || 'Abuja,ng';
                    const encodedLocation = encodeURIComponent(savedLocation);
                    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodedLocation}&units=metric&appid=${openWeatherKey}`);
                    const data = await res.json();
                    setWeatherData({
                        temp: Math.round(data.main.temp),
                        condition: data.weather[0].main,
                        humidity: data.main.humidity,
                        locationName: data.name
                    });
                } catch (error) {
                    setWeatherData({ temp: 28, condition: 'Sunny', humidity: 76, locationName: 'Local' });
                }
            } else {
                setWeatherData({ temp: 31, condition: 'Sunny', humidity: 60, locationName: 'Local' });
            }
        }

        async function fetchScans() {
            try {
                const token = localStorage.getItem('access_token');
                const res = await axios.get(`${API_URL}/api/scans/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                // Format scans for the UI
                const formatted = res.data.map(scan => ({
                    id: scan.id,
                    crop: scan.disease_name === 'Not a Plant Leaf' ? 'Invalid Sample' : (scan.disease_name || 'Unknown Crop'),
                    date: new Date(scan.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '.'),
                    time: new Date(scan.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    status: scan.confidence > 70 ? 'Healthy' : scan.confidence > 40 ? 'Delayed' : 'At risk',
                    isHealthy: scan.confidence > 70,
                    confidence: scan.confidence,
                    description: scan.description,
                    recommended_action: scan.recommended_action
                }));
                
                setRecentScans(formatted);
            } catch (error) {
                console.error("Error fetching scans:", error);
                setRecentScans([]);
            }
        }

        fetchWeather();
        fetchScans();
    }, []);

    const handleCopyReport = (scan) => {
        if (!scan) return;
        const report = `CeresVera Crop Health Analysis Report
Date: ${scan.date} ${scan.time}
Crop: ${scan.crop}
Status: ${scan.status}
Confidence: ${scan.confidence ? Math.round(scan.confidence) + '%' : 'N/A'}

Description:
${scan.description || (scan.status === 'Healthy' ? 'Your crop appears to be in optimal condition.' : 'No detailed description available.')}

Recommended Action:
${scan.recommended_action || (scan.status === 'Healthy' ? 'Continue your current care regimen.' : 'Please consult an expert for further verification.')}
`;
        navigator.clipboard.writeText(report).then(() => {
            showToast("Report copied to clipboard.");
            setSelectedScan(null);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            showToast("Failed to copy report.");
        });
    };

    const healthyScans = recentScans.filter(s => s.status === 'Healthy').length;
    const healthPercentage = recentScans.length > 0 ? Math.round((healthyScans / recentScans.length) * 100) : 0;

    const stats = [
        { label: 'Total Analyses', value: recentScans.length.toString(), change: '+0%', icon: <Monitor className="w-5 h-5" />, up: true },
        { 
            label: 'Healthy Crops', 
            value: `${healthPercentage}%`, 
            change: healthPercentage >= 70 ? '+5%' : '-2%', 
            icon: <CheckCircle className="w-5 h-5" />, 
            up: healthPercentage >= 70, 
            color: healthPercentage >= 70 ? 'sage' : 'rose' 
        },
        { label: 'Daily Activity', value: recentScans.length > 0 ? 'Active' : 'Idle', change: '+0%', icon: <Clock className="w-5 h-5" />, up: true },
        { label: 'Weather Index', value: `${weatherData?.temp || 31}°C`, change: '+2%', icon: <CloudRain className="w-5 h-5" />, up: true },
    ];

    const chartData = recentScans.length > 0 ? [
        { label: 'Mon', val: 35, status: 'Completed' },
        { label: 'Tue', val: 47, status: 'On going' },
        { label: 'Wed', val: 20, status: 'At risk' },
        { label: 'Thu', val: 35, status: 'Delayed' },
        { label: 'Fri', val: 55, status: 'On going' },
        { label: 'Sat', val: 75, status: 'Completed' },
        { label: 'Sun', val: healthPercentage, status: 'Completed' },
    ] : [
        { label: 'Mon', val: 0 }, { label: 'Tue', val: 0 }, { label: 'Wed', val: 0 },
        { label: 'Thu', val: 0 }, { label: 'Fri', val: 0 }, { label: 'Sat', val: 0 }, { label: 'Sun', val: 0 }
    ];

    return (
        <div className="p-8 space-y-8 bg-app-subtle min-h-full">
            {/* Overview Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                    <h2 className="text-2xl font-black text-app-text leading-tight">Good morning, {userName}!</h2>
                    <p className="text-app-text-muted font-medium">Here's what's happening on your farm today.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-app-card border border-app-border rounded-xl text-sm font-bold text-sage-700 shadow-sm hover:shadow-md transition-all shrink-0">
                    Last 30 days <ChevronDown className="w-4 h-4" />
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-app-card p-6 rounded-[2rem] border border-app-card-border shadow-sm relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-3 bg-app-accent-subtle rounded-xl text-sage-700 group-hover:bg-sage-700 group-hover:text-white transition-all duration-300">
                                {stat.icon}
                            </div>
                            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-black tracking-tight ${stat.up ? 'bg-sage-50 dark:bg-sage-900/20 text-sage-700' : 'bg-rose-50 text-rose-600'}`}>
                                <ArrowUpRight className={`w-3 h-3 ${stat.up ? '' : 'rotate-90'}`} /> {stat.change}
                            </div>
                        </div>
                        <div className="text-app-text-muted text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</div>
                        <div className="text-3xl font-black text-app-text tracking-tight">{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* Farm Profile Card */}
            {farmName ? (
                <div className="bg-app-card rounded-[2rem] border border-app-card-border shadow-sm p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-sage-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                    <div className="flex items-center gap-3 mb-5">
                        <div className="p-2.5 bg-sage-50 rounded-xl">
                            <Database className="w-5 h-5 text-sage-700" />
                        </div>
                        <div>
                            <h3 className="font-black text-app-text text-sm">Farm Profile</h3>
                            <p className="text-[10px] text-app-text-muted font-bold uppercase tracking-widest">Property & Crop Info</p>
                        </div>
                        <Link to="/settings" className="ml-auto text-[10px] font-black text-sage-600 hover:text-sage-800 uppercase tracking-widest transition-colors">Edit →</Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-app-subtle rounded-xl p-4 border border-app-border">
                            <div className="text-[9px] font-black text-app-text-muted uppercase tracking-widest mb-1">Farm Name</div>
                            <div className="text-base font-bold text-app-text truncate">{farmName}</div>
                        </div>
                        <div className="bg-app-subtle rounded-xl p-4 border border-app-border">
                            <div className="text-[9px] font-black text-app-text-muted uppercase tracking-widest mb-1">Crops</div>
                            <div className="text-base font-bold text-app-text truncate">{primaryCrop || '—'}</div>
                        </div>
                        <div className="bg-app-subtle rounded-xl p-4 border border-app-border">
                            <div className="text-[9px] font-black text-app-text-muted uppercase tracking-widest mb-1">Land Size</div>
                            <div className="text-base font-bold text-app-text truncate">{farmSize || '—'}</div>
                        </div>
                    </div>
                </div>
            ) : (
                <Link to="/settings" className="block bg-app-card rounded-[2rem] border border-app-card-border shadow-sm p-6 hover:shadow-md transition-all group">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-sage-50 rounded-xl group-hover:bg-sage-100 transition-colors">
                            <Database className="w-6 h-6 text-sage-600" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-app-text">Set up your farm profile</p>
                            <p className="text-xs text-app-text-muted mt-0.5">Add your farm name, crop, and land size in Settings to personalize your dashboard.</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-app-text-muted ml-auto group-hover:translate-x-1 transition-transform" />
                    </div>
                </Link>
            )}

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Project Summary Table */}
                <div className="lg:col-span-2 bg-app-card rounded-[2rem] border border-app-card-border shadow-sm overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-app-border flex justify-between items-center bg-app-card">
                        <h3 className="text-lg font-black text-app-text">Crop Health Analysis</h3>
                        <Link to="/scan" className="text-sm font-bold text-sage-700 hover:scale-105 transition-transform flex items-center gap-1">
                            New Analysis <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-app-accent-subtle text-sage-600 text-[10px] font-black uppercase tracking-widest">
                                <tr>
                                    <th className="px-8 py-4">Crop Name</th>
                                    <th className="px-8 py-4">Date</th>
                                    <th className="px-8 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sage-50">
                                {recentScans.length > 0 ? (
                                    recentScans.map((scan, i) => (
                                        <tr key={i} onClick={() => setSelectedScan(scan)} className="group hover:bg-app-accent-subtle transition-colors cursor-pointer">
                                            <td className="px-8 py-5">
                                                <div className="font-bold text-app-text group-hover:text-sage-700 transition-colors">{scan.crop}</div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="text-sm font-bold text-gray-500">{scan.date}</div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${
                                                    scan.status === 'Healthy' ? 'bg-sage-100 dark:bg-sage-900/20 text-sage-700' : 
                                                    scan.status === 'Delayed' ? 'bg-earth-100 dark:bg-earth-900/20 text-earth-600' : 
                                                    'bg-rose-100 dark:bg-rose-900/20 text-rose-600'
                                                }`}>
                                                    {scan.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="px-8 py-12 text-center">
                                            <div className="flex flex-col items-center gap-2 opacity-50">
                                                <Sparkles className="w-8 h-8 text-sage-400" />
                                                <p className="text-sm font-bold text-app-text-muted">No Analysis Yet</p>
                                                <Link to="/scan" className="text-xs font-black text-sage-600 uppercase tracking-widest hover:underline">Scan your first crop ↑</Link>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Overall Progress Chart */}
                <div className="bg-app-card rounded-[2rem] border border-app-card-border shadow-sm p-8 flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-black text-app-text">Health Index</h3>
                        <button className="text-xs font-bold text-app-text-muted flex items-center gap-1">Weekly <ChevronDown className="w-3 h-3" /></button>
                    </div>

                    <div className="flex-1 min-h-[250px] flex items-end justify-between gap-2 px-2">
                        {chartData.map((d, i) => (
                            <div key={i} className="flex-1 h-full flex flex-col justify-end group cursor-pointer relative">
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-sage-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                    {d.val}%
                                </div>
                                <div className="relative w-full bg-app-subtle rounded-xl h-full flex items-end overflow-hidden border border-app-border group-hover:border-sage-100">
                                    <motion.div 
                                        initial={{ height: 0 }}
                                        animate={{ height: `${d.val}%` }}
                                        transition={{ duration: 1, delay: i * 0.1, type: 'spring' }}
                                        className={`w-full ${d.val > 70 ? 'bg-sage-600' : d.val > 40 ? 'bg-sage-400' : 'bg-earth-400'} group-hover:bg-sage-700 transition-colors shadow-inner`}
                                    />
                                </div>
                                <div className="text-[10px] font-black text-app-text-muted text-center mt-3 group-hover:text-sage-700 transition-colors uppercase tracking-tight">{d.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Float Action for Mobile */}
            <Link to="/scan" className="fixed bottom-8 right-8 lg:hidden w-16 h-16 bg-sage-700 text-white rounded-2xl shadow-2xl flex items-center justify-center z-50 transform hover:scale-110 hover:-rotate-6 transition-all active:scale-95 group">
                <Camera className="w-7 h-7 group-hover:scale-110 transition-transform" />
            </Link>

            {/* Scan Details Modal */}
            <AnimatePresence>
                {selectedScan && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setSelectedScan(null)}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-[2rem] shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            {/* Modal Header */}
                            <div className={`p-6 border-b flex justify-between items-center ${selectedScan.isHealthy || selectedScan.status === 'Healthy' ? 'bg-sage-50 border-sage-100' : 'bg-rose-50 border-rose-100'}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`p-3 rounded-2xl ${selectedScan.isHealthy || selectedScan.status === 'Healthy' ? 'bg-sage-200 text-sage-700' : 'bg-rose-200 text-rose-700'}`}>
                                        {selectedScan.isHealthy || selectedScan.status === 'Healthy' ? <CheckCircle className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-gray-900">Analysis Report</h3>
                                        <p className="text-sm font-medium text-gray-500">{selectedScan.date} at {selectedScan.time}</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedScan(null)} className="p-2 bg-white/50 hover:bg-white rounded-full transition-colors text-gray-500">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div>
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Detected Subject</div>
                                        <div className="text-lg font-bold text-gray-900">{selectedScan.crop}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Health Status</div>
                                        <div className={`inline-flex px-3 py-1 rounded-full text-xs font-black uppercase tracking-tight ${selectedScan.isHealthy || selectedScan.status === 'Healthy' ? 'bg-sage-100 text-sage-700' : 'bg-rose-100 text-rose-700'}`}>
                                            {selectedScan.status}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Confidence Score</div>
                                        {selectedScan.confidence && <div className="text-xs font-black text-sage-600">{Math.round(selectedScan.confidence)}%</div>}
                                    </div>
                                    <p className="text-sm text-gray-700 font-medium leading-relaxed">
                                        {selectedScan.description || (selectedScan.status === 'Healthy' ? 'Your crop appears to be in optimal condition. No immediate threats detected.' : 'No detailed description available for this scan.')}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-black text-gray-900 mb-3 flex items-center gap-2">
                                        <Activity className="w-4 h-4 text-sage-600" /> Recommended Action
                                    </h4>
                                    <div className="bg-sage-50/50 rounded-2xl p-5 border border-sage-100">
                                        <p className="text-sm text-gray-700 font-medium leading-relaxed">
                                            {selectedScan.recommended_action || (selectedScan.status === 'Healthy' ? 'Continue with your current care regimen. Maintain regular watering schedules and monitor for changes.' : 'Please consult with a professional agronomist for a detailed treatment plan.')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row items-center gap-3">
                                <Link to="/consultants" className="w-full sm:w-auto px-6 py-3 bg-white border border-sage-200 text-sage-700 hover:bg-sage-50 rounded-xl font-bold transition-all text-center">
                                    Find an Expert
                                </Link>
                                <button 
                                    onClick={() => handleCopyReport(selectedScan)}
                                    className="w-full sm:w-auto sm:ml-auto px-6 py-3 bg-sage-700 hover:bg-sage-800 text-white rounded-xl font-bold shadow-lg shadow-sage-700/20 transition-all flex items-center justify-center gap-2"
                                >
                                    <Copy className="w-4 h-4" /> Copy Report
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toast */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-sage-900 text-earth-50 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm border border-sage-700"
                    >
                        <CheckCircle2 className="w-5 h-5 text-sage-400" />
                        {toastMessage}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
