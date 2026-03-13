import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Sprout, Droplets, Wind, Sparkles, Sliders, ChevronRight, Lock, ShieldCheck, Loader2, ArrowUpRight } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function PredictiveAnalytics() {
    const isPremium = localStorage.getItem('is_premium') === 'true';
    const [loading, setLoading] = useState(false);
    const [prediction, setPrediction] = useState(null);
    
    const [params, setParams] = useState({
        crop: 'Cocoa',
        fertilizer: 50,
        irrigation: 70,
        soilPh: 6.5
    });

    const handleSimulate = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            const res = await axios.post(`${API_URL}/api/deepseek/`, {
                query: `Act as a harvest simulator. If I grow ${params.crop} with ${params.fertilizer}% fertilizer efficiency, ${params.irrigation}% irrigation, and soil pH of ${params.soilPh}, what is the projected harvest value increase? Give me a short paragraph and a bullet point with "Projected Yield Increase: X%". Format with markdown.`
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPrediction(res.data.response);
        } catch (err) {
            console.error('Simulation failed:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!isPremium) {
        return (
            <div className="min-h-screen bg-earth-50 pt-32 pb-12 flex items-center justify-center px-4">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-white rounded-[3rem] p-10 shadow-2xl border border-amber-100 text-center relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-2 bg-amber-400"></div>
                    <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <TrendingUp className="w-10 h-10 text-amber-600" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Predictive Yield AI</h2>
                    <p className="text-gray-600 mb-8 leading-relaxed font-medium">
                        Simulate "What If" scenarios for your farm. Access AI-driven models that project harvest value based on your variables. Update to Premium.
                    </p>
                    <button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-amber-200 transition-all active:scale-95 mb-4">
                        Unlock Yield AI
                    </button>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Powered by Deepseek AI Models</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-earth-50 pt-24 pb-12">
            <div className="max-w-6xl mx-auto px-4">
                <div className="mb-10 text-center lg:text-left">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest border border-amber-200 shadow-sm mb-3">
                        <Sparkles className="w-3 h-3" /> AI Simulation Hub
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Predictive Yield Analytics</h1>
                    <p className="text-gray-600 mt-2 font-medium">Configure your farm variables to see projected harvest outcomes.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Controls Panel */}
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 space-y-8 h-fit">
                        <div className="flex items-center gap-3 mb-2 font-black text-gray-900 uppercase tracking-widest text-xs">
                            <Sliders className="w-4 h-4 text-amber-500" /> Control Panel
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-3">Target Crop</label>
                                <select 
                                    className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl font-bold text-gray-900 outline-none focus:ring-2 focus:ring-amber-500 appearance-none"
                                    value={params.crop}
                                    onChange={(e) => setParams({...params, crop: e.target.value})}
                                >
                                    <option>Cocoa</option>
                                    <option>Oil Palm</option>
                                    <option>Cassava</option>
                                    <option>Maize</option>
                                </select>
                            </div>

                            {[
                                { id: 'fertilizer', label: 'Fertilizer Input', icon: <Sprout className="w-4 h-4" />, unit: '%' },
                                { id: 'irrigation', label: 'Water Supply', icon: <Droplets className="w-4 h-4" />, unit: '%' },
                            ].map(input => (
                                <div key={input.id}>
                                    <div className="flex justify-between mb-3 text-sm font-bold text-gray-700">
                                        <div className="flex items-center gap-2">{input.icon} {input.label}</div>
                                        <span>{params[input.id]}{input.unit}</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="0" max="100" 
                                        className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                        value={params[input.id]}
                                        onChange={(e) => setParams({...params, [input.id]: parseInt(e.target.value)})}
                                    />
                                </div>
                            ))}

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                    <Wind className="w-4 h-4" /> Soil pH Level
                                </label>
                                <input 
                                    type="number" step="0.1"
                                    className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl font-bold text-gray-900 outline-none focus:ring-2 focus:ring-amber-500"
                                    value={params.soilPh}
                                    onChange={(e) => setParams({...params, soilPh: parseFloat(e.target.value)})}
                                />
                            </div>
                        </div>

                        <button 
                            onClick={handleSimulate}
                            disabled={loading}
                            className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-black shadow-xl shadow-gray-200 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                            Run Deepseek Simulation
                        </button>
                    </div>

                    {/* Results Panel */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-[2rem] p-8 shadow-xl relative overflow-hidden group">
                                <TrendingUp className="absolute -right-6 -bottom-6 w-40 h-40 opacity-20 group-hover:scale-110 transition-transform duration-700" />
                                <div className="relative z-10">
                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-80">Projected Harvest Value</div>
                                    <div className="text-5xl font-black mb-2 tracking-tight">₦2.4M</div>
                                    <div className="flex items-center gap-2 text-sm font-bold bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-md">
                                        <ArrowUpRight className="w-4 h-4" /> +15.5% ROI
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white border-2 border-sage-100 rounded-[2rem] p-8 shadow-lg relative group">
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Simulation Risk Factor</div>
                                <div className="text-5xl font-black text-gray-900 mb-2 tracking-tight">LOW</div>
                                <div className="flex items-center gap-2 text-sm font-bold text-green-600 bg-green-50 w-fit px-3 py-1 rounded-full border border-green-100">
                                    <ShieldCheck className="w-4 h-4" /> Stabilized Yield
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-xl relative min-h-[500px] overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full blur-3xl -z-0 opacity-50"></div>
                            
                            {!prediction && !loading && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                                    <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6 text-gray-300">
                                        <Sparkles className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">Awaiting Simulation</h3>
                                    <p className="text-gray-500 font-medium max-w-sm">Use the control panel to configure your farm variables. Our AI will simulate thousands of harvest scenarios to project your ROI.</p>
                                </div>
                            )}

                            {loading && (
                                <div className="space-y-8 relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                        </div>
                                        <div>
                                            <div className="h-4 bg-gray-100 rounded-full w-48 animate-pulse mb-2"></div>
                                            <div className="h-3 bg-gray-50 rounded-full w-32 animate-pulse"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="h-4 bg-gray-100 rounded-full w-full animate-pulse"></div>
                                        <div className="h-4 bg-gray-100 rounded-full w-[90%] animate-pulse"></div>
                                        <div className="h-4 bg-gray-100 rounded-full w-[95%] animate-pulse"></div>
                                    </div>
                                    <div className="h-48 bg-gray-50 rounded-[2rem] w-full animate-pulse border border-gray-100"></div>
                                </div>
                            )}

                            {prediction && !loading && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                                    className="relative z-10"
                                >
                                    <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                                        <h3 className="text-xl font-black text-gray-900">Analysis Breakdown</h3>
                                        <div className="text-[10px] font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100 uppercase tracking-widest">Confidence: 94%</div>
                                    </div>
                                    
                                    <div className="prose prose-sage max-w-none">
                                        <div className="p-8 bg-amber-50/50 rounded-[2rem] mb-8 border border-amber-100/50 font-medium text-gray-800 leading-relaxed text-lg shadow-inner">
                                            {prediction}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Irrigation Eff.</div>
                                            <div className="text-lg font-black text-gray-900">{params.irrigation}%</div>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Nutrient Level</div>
                                            <div className="text-lg font-black text-gray-900">{params.fertilizer}%</div>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Simulation ID</div>
                                            <div className="text-lg font-black text-gray-900">#ROI-{Math.floor(Math.random()*9000)+1000}</div>
                                        </div>
                                    </div>

                                    <div className="mt-10 p-6 bg-gray-900 rounded-[2rem] text-white flex items-center justify-between shadow-2xl">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-white/10 rounded-xl">
                                                <Sparkles className="w-6 h-6 text-amber-400" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">AI Model Engine</div>
                                                <div className="text-sm font-black">Deepseek Harvest Intelligence V3</div>
                                            </div>
                                        </div>
                                        <button className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-black uppercase tracking-widest transition-colors border border-white/10">Download PDF</button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
