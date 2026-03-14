import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Cloud, Sun, CloudRain, CloudSnow, Wind, Droplets,
    Thermometer, AlertTriangle, ChevronDown, Leaf,
    TrendingUp, TrendingDown, Sprout, Eye, Gauge
} from 'lucide-react';

// All 36 Nigerian States + FCT with coordinates
const NIGERIAN_STATES = [
    { name: 'Abia', lat: 5.4527, lon: 7.5248 },
    { name: 'Adamawa', lat: 9.3265, lon: 12.3984 },
    { name: 'Akwa Ibom', lat: 5.0079, lon: 7.8497 },
    { name: 'Anambra', lat: 6.2209, lon: 7.0671 },
    { name: 'Bauchi', lat: 10.3158, lon: 9.8442 },
    { name: 'Bayelsa', lat: 4.7719, lon: 6.0699 },
    { name: 'Benue', lat: 7.1906, lon: 8.1340 },
    { name: 'Borno', lat: 11.8333, lon: 13.1500 },
    { name: 'Cross River', lat: 5.8702, lon: 8.5988 },
    { name: 'Delta', lat: 5.7059, lon: 5.9339 },
    { name: 'Ebonyi', lat: 6.2649, lon: 8.0137 },
    { name: 'Edo', lat: 6.5244, lon: 5.8987 },
    { name: 'Ekiti', lat: 7.7190, lon: 5.3110 },
    { name: 'Enugu', lat: 6.4584, lon: 7.5464 },
    { name: 'FCT Abuja', lat: 9.0579, lon: 7.4951 },
    { name: 'Gombe', lat: 10.2791, lon: 11.1671 },
    { name: 'Imo', lat: 5.4922, lon: 7.0263 },
    { name: 'Jigawa', lat: 12.2280, lon: 9.5615 },
    { name: 'Kaduna', lat: 10.5105, lon: 7.4165 },
    { name: 'Kano', lat: 11.9964, lon: 8.5167 },
    { name: 'Katsina', lat: 12.9908, lon: 7.6017 },
    { name: 'Kebbi', lat: 12.4539, lon: 4.1975 },
    { name: 'Kogi', lat: 7.8012, lon: 6.7376 },
    { name: 'Kwara', lat: 8.9669, lon: 4.3874 },
    { name: 'Lagos', lat: 6.5244, lon: 3.3792 },
    { name: 'Nasarawa', lat: 8.5390, lon: 8.3254 },
    { name: 'Niger', lat: 9.9397, lon: 5.5986 },
    { name: 'Ogun', lat: 7.1600, lon: 3.3500 },
    { name: 'Ondo', lat: 7.2500, lon: 5.2000 },
    { name: 'Osun', lat: 7.7827, lon: 4.5418 },
    { name: 'Oyo', lat: 7.8500, lon: 3.9300 },
    { name: 'Plateau', lat: 9.2182, lon: 9.5179 },
    { name: 'Rivers', lat: 4.8156, lon: 7.0498 },
    { name: 'Sokoto', lat: 13.0059, lon: 5.2476 },
    { name: 'Taraba', lat: 7.9994, lon: 10.7744 },
    { name: 'Yobe', lat: 12.0000, lon: 11.5000 },
    { name: 'Zamfara', lat: 12.1702, lon: 6.6624 },
];

const WMO_CODES = {
    0: { label: 'Clear Sky', Icon: Sun, color: 'text-yellow-500' },
    1: { label: 'Mainly Clear', Icon: Sun, color: 'text-yellow-400' },
    2: { label: 'Partly Cloudy', Icon: Cloud, color: 'text-gray-400' },
    3: { label: 'Overcast', Icon: Cloud, color: 'text-gray-500' },
    51: { label: 'Light Drizzle', Icon: CloudRain, color: 'text-blue-400' },
    53: { label: 'Moderate Drizzle', Icon: CloudRain, color: 'text-blue-500' },
    61: { label: 'Slight Rain', Icon: CloudRain, color: 'text-blue-400' },
    63: { label: 'Moderate Rain', Icon: CloudRain, color: 'text-blue-500' },
    65: { label: 'Heavy Rain', Icon: CloudRain, color: 'text-blue-700' },
    80: { label: 'Rain Showers', Icon: CloudRain, color: 'text-blue-500' },
    81: { label: 'Heavy Showers', Icon: CloudRain, color: 'text-blue-700' },
    95: { label: 'Thunderstorm', Icon: CloudRain, color: 'text-purple-600' },
};

const getWeatherInfo = (code) => WMO_CODES[code] || { label: 'Variable', Icon: Cloud, color: 'text-gray-400' };

const getClimateRisks = (data) => {
    if (!data) return [];
    const risks = [];
    const maxTemp = Math.max(...data.daily.temperature_2m_max);
    const totalRain = data.daily.precipitation_sum.reduce((a, b) => a + b, 0);
    const maxWind = Math.max(...data.daily.windspeed_10m_max);

    if (maxTemp > 38) risks.push({ level: 'HIGH', label: 'Heat Stress', desc: `Peak ${maxTemp.toFixed(1)}°C — protect crops with shade netting`, color: 'bg-red-100 border-red-400 text-red-800', icon: '🔥' });
    else if (maxTemp > 34) risks.push({ level: 'MEDIUM', label: 'Elevated Temperature', desc: `Up to ${maxTemp.toFixed(1)}°C — ensure adequate irrigation`, color: 'bg-orange-100 border-orange-400 text-orange-800', icon: '☀️' });

    if (totalRain > 80) risks.push({ level: 'HIGH', label: 'Flood / Waterlogging Risk', desc: `${totalRain.toFixed(0)}mm forecast — avoid planting low-lying fields`, color: 'bg-blue-100 border-blue-400 text-blue-800', icon: '🌊' });
    else if (totalRain < 5) risks.push({ level: 'MEDIUM', label: 'Drought Risk', desc: `Only ${totalRain.toFixed(0)}mm expected — irrigate vulnerable crops`, color: 'bg-yellow-100 border-yellow-400 text-yellow-800', icon: '🏜️' });

    if (maxWind > 40) risks.push({ level: 'HIGH', label: 'Strong Wind Alert', desc: `Gusts up to ${maxWind.toFixed(0)} km/h — stake tall crops`, color: 'bg-purple-100 border-purple-400 text-purple-800', icon: '💨' });

    if (risks.length === 0) risks.push({ level: 'LOW', label: 'Favourable Conditions', desc: 'Weather appears suitable for most farming activities this week.', color: 'bg-green-100 border-green-400 text-green-800', icon: '✅' });
    return risks;
};

const getCropAdvice = (data) => {
    if (!data) return [];
    const rain = data.daily.precipitation_sum.reduce((a, b) => a + b, 0);
    const avgTemp = data.daily.temperature_2m_max.reduce((a, b) => a + b, 0) / data.daily.temperature_2m_max.length;
    const advice = [];

    if (rain > 40) {
        advice.push('🌱 Good week to transplant seedlings — soil moisture is abundant.');
        advice.push('🚜 Delay fertilizer application until after heavy rain passes to prevent runoff.');
        advice.push('⚠️ Monitor crops for fungal diseases favoured by wet conditions (blight, mildew).');
    } else if (rain > 10) {
        advice.push('💧 Moderate rainfall — supplement with irrigation for water-intensive crops.');
        advice.push('✅ Ideal conditions for weeding — soil is soft and manageable.');
        advice.push('🌾 Good week for planting maize, cassava, and yam.');
    } else {
        advice.push('🚿 Low rainfall — prioritize irrigation for young crops and seedlings.');
        advice.push('🌱 Consider drought-resistant varieties (cowpea, sorghum) for new planting.');
        advice.push('🌿 Mulch fields to retain soil moisture through the dry period.');
    }

    if (avgTemp > 35) {
        advice.push('🌡️ High heat — water crops early morning or evening to reduce evaporation.');
    }
    if (avgTemp < 22) {
        advice.push('🧊 Cool temperatures — harvest leafy vegetables before they bolt.');
    }
    return advice;
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function WeatherDashboard() {
    const [selectedState, setSelectedState] = useState(NIGERIAN_STATES[14]); // Default: FCT Abuja
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const fetchWeather = useCallback(async (state) => {
        setLoading(true);
        setError(null);
        try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${state.lat}&longitude=${state.lon}` +
                `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weathercode,windspeed_10m,visibility` +
                `&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,uv_index_max` +
                `&timezone=Africa%2FLagos&forecast_days=7`;
            const res = await fetch(url);
            if (!res.ok) throw new Error('Failed to fetch weather data');
            const data = await res.json();
            setWeatherData(data);
        } catch (e) {
            setError('Unable to load weather data. Please check your connection.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWeather(selectedState);
    }, [selectedState, fetchWeather]);

    const current = weatherData?.current;
    const daily = weatherData?.daily;
    const currentInfo = current ? getWeatherInfo(current.weathercode) : null;
    const risks = getClimateRisks(weatherData);
    const advice = getCropAdvice(weatherData);

    return (
        <div className="p-8 space-y-8 bg-app-subtle min-h-full">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* State Selector */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-app-card rounded-2xl shadow-lg border border-app-border p-5 mb-6 relative z-30">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="flex-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Select State</label>
                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="w-full text-left bg-app-subtle border border-app-border rounded-xl px-4 py-3 flex items-center justify-between hover:border-sky-400 transition-colors font-medium text-app-text"
                                >
                                    <span>📍 {selectedState.name}</span>
                                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {dropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                                            className="absolute top-full mt-2 left-0 w-full bg-app-card border border-app-border rounded-xl shadow-2xl overflow-hidden z-50"
                                        >
                                            <div className="max-h-72 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-1 p-2">
                                                {NIGERIAN_STATES.map((state) => (
                                                    <button
                                                        key={state.name}
                                                        onClick={() => { setSelectedState(state); setDropdownOpen(false); }}
                                                        className={`text-left text-sm px-3 py-2 rounded-lg transition-colors ${selectedState.name === state.name ? 'bg-sky-100 dark:bg-sky-900/20 text-sky-700 font-bold' : 'hover:bg-app-subtle text-app-text'}`}
                                                    >
                                                        {state.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                        <div className="text-sm text-gray-400 text-right hidden sm:block">
                            <p>Lat {selectedState.lat.toFixed(2)}° · Lon {selectedState.lon.toFixed(2)}°</p>
                            <p className="text-xs mt-1">Data via Open-Meteo</p>
                        </div>
                    </div>
                </motion.div>

                {loading && (
                    <div className="text-center py-20">
                        <div className="w-12 h-12 border-4 border-sky-300 border-t-sky-700 rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">Loading climate data for {selectedState.name}...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-700">
                        <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                        {error}
                    </div>
                )}

                {!loading && !error && weatherData && (
                    <div className="space-y-6">
                        {/* Current Weather */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-br from-sky-500 to-teal-600 rounded-3xl p-8 text-white shadow-xl">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                <div>
                                    <p className="text-sky-200 font-medium mb-1">{selectedState.name} · Now</p>
                                    <div className="flex items-end gap-4">
                                        <span className="text-7xl font-bold">{current.temperature_2m.toFixed(0)}°</span>
                                        <div>
                                            {currentInfo && <currentInfo.Icon className="w-12 h-12 mb-1 text-white/80" />}
                                            <p className="text-sky-100 font-medium">{currentInfo?.label}</p>
                                            <p className="text-sky-200 text-sm">Feels like {current.apparent_temperature.toFixed(0)}°C</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
                                    {[
                                        { Icon: Droplets, label: 'Humidity', value: `${current.relative_humidity_2m}%` },
                                        { Icon: Wind, label: 'Wind', value: `${current.windspeed_10m} km/h` },
                                        { Icon: CloudRain, label: 'Rainfall', value: `${current.precipitation} mm` },
                                        { Icon: Eye, label: 'Visibility', value: `${(current.visibility / 1000).toFixed(0)} km` },
                                    ].map(({ Icon, label, value }) => (
                                        <div key={label} className="bg-white/20 backdrop-blur rounded-2xl p-4 text-center">
                                            <Icon className="w-5 h-5 mx-auto mb-1 text-sky-200" />
                                            <p className="text-sky-200 text-xs">{label}</p>
                                            <p className="text-white font-bold text-sm">{value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* 7-Day Forecast */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                            className="bg-app-card rounded-3xl shadow-sm border border-app-border p-6">
                            <h2 className="font-bold text-app-text text-lg mb-5 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-sky-600" /> 7-Day Forecast
                            </h2>
                            <div className="grid grid-cols-7 gap-2">
                                {daily.time.map((date, i) => {
                                    const info = getWeatherInfo(daily.weathercode[i]);
                                    const d = new Date(date);
                                    return (
                                        <motion.div key={date} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
                                            className="flex flex-col items-center bg-app-subtle rounded-2xl p-2 sm:p-3 text-center">
                                            <p className="text-xs font-bold text-app-text-muted">{i === 0 ? 'Today' : DAYS[d.getDay()]}</p>
                                            <info.Icon className={`w-6 h-6 my-2 ${info.color}`} />
                                            <p className="text-sm font-bold text-app-text">{daily.temperature_2m_max[i].toFixed(0)}°</p>
                                            <p className="text-xs text-app-text-muted">{daily.temperature_2m_min[i].toFixed(0)}°</p>
                                            {daily.precipitation_sum[i] > 1 && (
                                                <p className="text-xs text-blue-500 mt-1 font-medium">{daily.precipitation_sum[i].toFixed(0)}mm</p>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>

                        {/* Climate Risk Alerts + Crop Advice */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Climate Risks */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                                className="bg-app-card rounded-3xl shadow-sm border border-app-border p-6">
                                <h2 className="font-bold text-app-text text-lg mb-4 flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-amber-500" /> Climate Risk Assessment
                                </h2>
                                <div className="space-y-3">
                                    {risks.map((risk, i) => (
                                        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }}
                                            className={`border-l-4 rounded-r-xl px-4 py-3 ${risk.color}`}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span>{risk.icon}</span>
                                                <span className="font-bold text-sm">{risk.label}</span>
                                                <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${risk.level === 'HIGH' ? 'bg-red-200 dark:bg-red-900/40 text-red-900 dark:text-red-100' : risk.level === 'MEDIUM' ? 'bg-amber-200 dark:bg-amber-900/40 text-amber-900 dark:text-amber-100' : 'bg-green-200 dark:bg-green-900/40 text-green-900 dark:text-green-100'}`}>
                                                    {risk.level}
                                                </span>
                                            </div>
                                            <p className="text-xs opacity-80">{risk.desc}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Crop Advice */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                                className="bg-app-card rounded-3xl shadow-sm border border-app-border p-6">
                                <h2 className="font-bold text-app-text text-lg mb-4 flex items-center gap-2">
                                    <Sprout className="w-5 h-5 text-sage-600" /> Weekly Farming Advice
                                </h2>
                                <div className="space-y-3">
                                    {advice.map((tip, i) => (
                                        <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }}
                                            className="bg-app-subtle rounded-xl px-4 py-3 text-sm text-app-text-muted leading-relaxed">
                                            {tip}
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* UV & Extra Stats */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                            className="bg-app-card rounded-3xl shadow-sm border border-app-border p-6">
                            <h2 className="font-bold text-app-text text-lg mb-5 flex items-center gap-2">
                                <Gauge className="w-5 h-5 text-teal-600" /> Weekly Climate Summary
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {[
                                    {
                                        label: 'Total Rainfall', icon: '🌧️',
                                        value: `${daily.precipitation_sum.reduce((a, b) => a + b, 0).toFixed(1)} mm`,
                                        sub: '7-day accumulation'
                                    },
                                    {
                                        label: 'Peak Temperature', icon: '🌡️',
                                        value: `${Math.max(...daily.temperature_2m_max).toFixed(1)}°C`,
                                        sub: 'Highest this week'
                                    },
                                    {
                                        label: 'Peak UV Index', icon: '☀️',
                                        value: `${Math.max(...daily.uv_index_max).toFixed(0)}`,
                                        sub: daily.uv_index_max[0] > 7 ? 'Very High — use shade' : 'Moderate levels'
                                    },
                                    {
                                        label: 'Max Wind Speed', icon: '💨',
                                        value: `${Math.max(...daily.windspeed_10m_max).toFixed(0)} km/h`,
                                        sub: 'Peak gust forecast'
                                    },
                                ].map(({ label, icon, value, sub }) => (
                                    <div key={label} className="bg-app-subtle rounded-2xl p-4 text-center">
                                        <div className="text-2xl mb-1">{icon}</div>
                                        <p className="text-xs text-app-text-muted font-medium">{label}</p>
                                        <p className="text-lg font-bold text-app-text mt-1">{value}</p>
                                        <p className="text-xs text-app-text-muted/60">{sub}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Attribution */}
                        <p className="text-center text-xs text-gray-400 pb-4">
                            Weather data provided by <a href="https://open-meteo.com/" target="_blank" rel="noopener" className="text-sky-500 hover:underline">Open-Meteo</a>
                        </p>
                    </div>
                )}
                </div>
            </div>
    );
}
