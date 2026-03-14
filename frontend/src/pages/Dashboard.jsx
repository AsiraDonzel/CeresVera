import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Camera, CheckCircle, Clock, AlertTriangle, ChevronRight, 
    CloudRain, MessageCircle, Activity, ArrowUpRight, CheckCircle2,
    LayoutDashboard, Database, Users, Cloud, Sparkles, Settings,
    Search, Bell, HelpCircle, LogOut, Filter, ChevronDown, Monitor
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    const [recentScans, setRecentScans] = useState([]);
    const [weatherData, setWeatherData] = useState(null);
    const [toastMessage, setToastMessage] = useState('');
    const userName = localStorage.getItem('user_name') || 'User';

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
        fetchWeather();

        const savedScans = JSON.parse(localStorage.getItem('recent_scans') || '[]');
        if (savedScans.length > 0) {
            setRecentScans(savedScans.sort((a, b) => b.id - a.id));
        } else {
            setRecentScans([
                { id: 1, date: '25.01.24', time: '10:30 AM', crop: 'Tomato Plantation', status: 'Healthy', isHealthy: true },
                { id: 2, date: '25.01.24', time: '02:15 PM', crop: 'Maize Field B', status: 'Delayed', isHealthy: false },
                { id: 3, date: '24.01.24', time: '09:00 AM', crop: 'Cassava West', status: 'At risk', isHealthy: false },
            ]);
        }
    }, []);

    const stats = [
        { label: 'Total Analyses', value: '24', change: '+12%', icon: <Monitor className="w-5 h-5" />, up: true },
        { label: 'Healthy Crops', value: '82%', change: '-10%', icon: <CheckCircle className="w-5 h-5" />, up: false, color: 'rose' },
        { label: 'Time Saved', value: '1022 /1300 Hrs', change: '+8%', icon: <Clock className="w-5 h-5" />, up: true },
        { label: 'Weather Index', value: `${weatherData?.temp || 31}°C`, change: '+2%', icon: <CloudRain className="w-5 h-5" />, up: true },
    ];

    const chartData = [
        { label: 'Mon', val: 65, status: 'Completed' },
        { label: 'Tue', val: 87, status: 'On going' },
        { label: 'Wed', val: 20, status: 'At risk' },
        { label: 'Thu', val: 35, status: 'Delayed' },
        { label: 'Fri', val: 55, status: 'On going' },
        { label: 'Sat', val: 75, status: 'Completed' },
        { label: 'Sun', val: 90, status: 'Completed' },
    ];

    return (
        <div className="p-8 space-y-8 bg-sage-50 min-h-full">
            {/* Overview Header */}
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h2 className="text-2xl font-black text-sage-900">Good morning, {userName}!</h2>
                    <p className="text-gray-500 font-medium">Here's what's happening on your farm today.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-sage-100 rounded-xl text-sm font-bold text-sage-700 shadow-sm hover:shadow-md transition-all">
                    Last 30 days <ChevronDown className="w-4 h-4" />
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2rem] border border-sage-50 shadow-sm relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-3 bg-earth-50 rounded-xl text-sage-700 group-hover:bg-sage-700 group-hover:text-white transition-all duration-300">
                                {stat.icon}
                            </div>
                            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-black tracking-tight ${stat.up ? 'bg-sage-50 text-sage-700' : 'bg-rose-50 text-rose-600'}`}>
                                <ArrowUpRight className={`w-3 h-3 ${stat.up ? '' : 'rotate-90'}`} /> {stat.change}
                            </div>
                        </div>
                        <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</div>
                        <div className="text-3xl font-black text-sage-900 tracking-tight">{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Project Summary Table */}
                <div className="lg:col-span-2 bg-white rounded-[2rem] border border-sage-50 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-sage-50 flex justify-between items-center bg-white">
                        <h3 className="text-lg font-black text-sage-900">Crop Health Analysis</h3>
                        <Link to="/scan" className="text-sm font-bold text-sage-700 hover:scale-105 transition-transform flex items-center gap-1">
                            New Analysis <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-earth-50 text-sage-600 text-[10px] font-black uppercase tracking-widest">
                                <tr>
                                    <th className="px-8 py-4">Crop Name</th>
                                    <th className="px-8 py-4">Date</th>
                                    <th className="px-8 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sage-50">
                                {recentScans.map((scan, i) => (
                                    <tr key={i} className="group hover:bg-earth-50 transition-colors cursor-pointer">
                                        <td className="px-8 py-5">
                                            <div className="font-bold text-sage-900 group-hover:text-sage-700 transition-colors">{scan.crop}</div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="text-sm font-bold text-gray-500">{scan.date}</div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${
                                                scan.status === 'Healthy' ? 'bg-sage-100 text-sage-700' : 
                                                scan.status === 'Delayed' ? 'bg-earth-100 text-earth-600' : 
                                                'bg-rose-100 text-rose-600'
                                            }`}>
                                                {scan.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Overall Progress Chart */}
                <div className="bg-white rounded-[2rem] border border-sage-50 shadow-sm p-8 flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-black text-sage-900">Health Index</h3>
                        <button className="text-xs font-bold text-sage-500 flex items-center gap-1">Weekly <ChevronDown className="w-3 h-3" /></button>
                    </div>

                    <div className="flex-1 min-h-[250px] flex items-end justify-between gap-2 px-2">
                        {chartData.map((d, i) => (
                            <div key={i} className="flex-1 h-full flex flex-col justify-end group cursor-pointer relative">
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-sage-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                    {d.val}%
                                </div>
                                <div className="relative w-full bg-earth-50 rounded-xl h-full flex items-end overflow-hidden border border-sage-50 group-hover:border-sage-100">
                                    <motion.div 
                                        initial={{ height: 0 }}
                                        animate={{ height: `${d.val}%` }}
                                        transition={{ duration: 1, delay: i * 0.1, type: 'spring' }}
                                        className={`w-full ${d.val > 70 ? 'bg-sage-600' : d.val > 40 ? 'bg-sage-400' : 'bg-earth-400'} group-hover:bg-sage-700 transition-colors shadow-inner`}
                                    />
                                </div>
                                <div className="text-[10px] font-black text-gray-400 text-center mt-3 group-hover:text-sage-700 transition-colors uppercase tracking-tight">{d.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Float Action for Mobile */}
            <Link to="/scan" className="fixed bottom-8 right-8 lg:hidden w-16 h-16 bg-sage-700 text-white rounded-2xl shadow-2xl flex items-center justify-center z-50 transform hover:scale-110 hover:-rotate-6 transition-all active:scale-95 group">
                <Camera className="w-7 h-7 group-hover:scale-110 transition-transform" />
            </Link>

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
