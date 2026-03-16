import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Sprout, 
    User, 
    Phone, 
    FileText, 
    ChevronRight, 
    ChevronLeft, 
    Check, 
    MapPin, 
    Award,
    Clock,
    Shield,
    X
} from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function OnboardingWizard({ role = 'farmer', onComplete }) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        bio: '',
        phone: '',
        location: '',
        farm_size: '',
        main_crop: '',
        expertise: '',
        certifications: []
    });

    const isFarmer = role === 'farmer';

    const steps = [
        { id: 1, name: 'Welcome', icon: Sprout },
        { id: 2, name: isFarmer ? 'Farm Details' : 'Expertise', icon: isFarmer ? MapPin : Award },
        { id: 3, name: 'Identity', icon: Shield },
        { id: 4, name: 'Finish', icon: Check }
    ];

    const handleNext = () => step < steps.length && setStep(step + 1);
    const handleBack = () => step > 1 && setStep(step - 1);

    const handleComplete = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            await axios.post(`${API_URL}/api/auth/profile/update/`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            localStorage.removeItem('show_onboarding');
            onComplete();
        } catch (err) {
            console.error('Onboarding update failed', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-forest-900/40 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white w-full max-w-4xl rounded-[4rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[85vh] md:h-[700px]"
            >
                {/* Left Sidebar Progress */}
                <div className="md:w-72 bg-forest-500 p-12 text-white flex flex-col justify-between relative overflow-hidden shrink-0">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-forest-400 rounded-full -translate-y-1/2 translate-x-1/2 opacity-20 blur-2xl" />
                    
                    <div className="relative z-10 space-y-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                <Sprout className="w-6 h-6" />
                            </div>
                            <span className="font-black tracking-tight text-xl">CeresVera</span>
                        </div>

                        <div className="space-y-6">
                            {steps.map((s, i) => (
                                <div key={s.id} className="flex items-center gap-4 group">
                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black transition-all border-2 ${
                                        step === s.id ? 'bg-white text-forest-500 border-white scale-110' :
                                        step > s.id ? 'bg-forest-400 text-white border-forest-400' :
                                        'bg-transparent text-forest-200 border-forest-400/30'
                                    }`}>
                                        {step > s.id ? <Check className="w-5 h-5" /> : s.id}
                                    </div>
                                    <div className={`transition-all ${step === s.id ? 'opacity-100 translate-x-2' : 'opacity-40'}`}>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-0.5">Step 0{s.id}</p>
                                        <p className="font-bold text-sm whitespace-nowrap">{s.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative z-10 p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 space-y-2">
                        <div className="flex items-center gap-2 text-harvest-500">
                            <Clock className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Setup Time</span>
                        </div>
                        <p className="text-xs font-bold text-forest-50">Estimated: 3 Minutes</p>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-10 md:p-16 flex flex-col">
                    <div className="flex-1">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div 
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="space-y-4">
                                        <h2 className="text-5xl font-black text-forest-500 tracking-tight leading-[1.1]">The Seeds of<br />Transformation</h2>
                                        <p className="text-gray-500 font-medium text-lg leading-relaxed">Welcome, {isFarmer ? 'Steward' : 'Master'}. Let's personalize your digital harvest experience.</p>
                                    </div>
                                    
                                    <div className="p-8 bg-forest-50 rounded-[3rem] border-2 border-forest-100/50 flex items-center gap-8">
                                        <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center shrink-0">
                                            <Sprout className="w-12 h-12 text-forest-500" />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="font-black text-forest-700 text-xl tracking-tight">Your Bio</h4>
                                            <p className="text-gray-500 text-sm font-medium">Tell the community about your agricultural philosophy.</p>
                                        </div>
                                    </div>

                                    <textarea 
                                        value={formData.bio}
                                        onChange={e => setFormData({...formData, bio: e.target.value})}
                                        className="w-full p-8 bg-gray-50 border-2 border-gray-50 focus:border-forest-500 focus:bg-white rounded-[2rem] outline-none font-bold text-gray-700 h-40 resize-none transition-all"
                                        placeholder="I have been farming in the South-Western region for over 15 years..."
                                    />
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div 
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-10"
                                >
                                    <div className="space-y-2">
                                        <h2 className="text-4xl font-black text-forest-500 tracking-tight">{isFarmer ? 'Farm Characteristics' : 'Field of Expertise'}</h2>
                                        <p className="text-gray-500 font-medium leading-relaxed">Precision data for precision outcomes.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">{isFarmer ? 'Main Crop' : 'Primary Sector'}</label>
                                            <div className="relative">
                                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-forest-500 font-black text-[10px] tracking-widest">CROP</div>
                                                <input 
                                                    type="text" 
                                                    value={isFarmer ? formData.main_crop : formData.expertise}
                                                    onChange={e => setFormData({...formData, [isFarmer? 'main_crop':'expertise']: e.target.value})}
                                                    className="w-full pl-20 pr-6 py-5 bg-gray-50 border-2 border-gray-50 focus:border-forest-500 rounded-2xl outline-none font-bold text-gray-700" 
                                                    placeholder={isFarmer ? "Maize, Cocoa, etc." : "Plant Pathology"} 
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">{isFarmer ? 'Farm Size (Hectares)' : 'Years of Practice'}</label>
                                            <div className="relative">
                                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-harvest-500 font-black text-[10px] tracking-widest">SIZE</div>
                                                <input 
                                                    type="text" 
                                                    value={formData.farm_size}
                                                    onChange={e => setFormData({...formData, farm_size: e.target.value})}
                                                    className="w-full pl-20 pr-6 py-5 bg-gray-50 border-2 border-gray-50 focus:border-forest-500 rounded-2xl outline-none font-bold text-gray-700" 
                                                    placeholder="5.0" 
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-8 bg-harvest-50 rounded-[3rem] border border-harvest-100 flex items-center gap-6">
                                        <MapPin className="w-8 h-8 text-harvest-500" />
                                        <div className="flex-1">
                                            <h4 className="font-black text-harvest-700">Geographic Location</h4>
                                            <input 
                                                type="text"
                                                value={formData.location}
                                                onChange={e => setFormData({...formData, location: e.target.value})}
                                                className="w-full bg-transparent border-none outline-none font-bold text-gray-600 p-0 mt-1 placeholder:text-gray-400"
                                                placeholder="Lagos, Nigeria"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div 
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="space-y-4 text-center">
                                        <div className="w-20 h-20 bg-forest-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-forest-500/20">
                                            <Shield className="w-10 h-10 text-white" />
                                        </div>
                                        <h2 className="text-4xl font-black text-forest-500 tracking-tight">Trust & Verification</h2>
                                        <p className="text-gray-500 font-medium">Secure your reputation on the CeresVera network.</p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="group p-8 rounded-[3rem] border-2 border-gray-100 hover:border-forest-500 hover:bg-forest-50 transition-all cursor-pointer flex items-center gap-8 relative overflow-hidden">
                                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                                <FileText className="w-8 h-8 text-forest-500" />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-gray-900">Upload ID or Certificate</h4>
                                                <p className="text-gray-400 font-medium text-sm">PDF, JPG or PNG (Max 5MB)</p>
                                            </div>
                                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                                        </div>
                                    </div>
                                    
                                    <div className="text-center">
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Encrypted • Secure • Private</p>
                                    </div>
                                </motion.div>
                            )}

                            {step === 4 && (
                                <motion.div 
                                    key="step4"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center h-full text-center space-y-10"
                                >
                                    <div className="relative">
                                        <motion.div 
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="w-40 h-40 bg-harvest-50 rounded-full flex items-center justify-center"
                                        >
                                            <Check className="w-20 h-20 text-harvest-500" />
                                        </motion.div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <h2 className="text-5xl font-black text-forest-500 tracking-tight leading-tight">Your Journey<br />Begins Now</h2>
                                        <p className="text-gray-500 font-medium text-lg max-w-sm mx-auto">Your profile is calibrated and ready. Step into your specialized dashboard.</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between pt-10 border-t border-gray-100">
                        <button 
                            onClick={handleBack} 
                            disabled={step === 1 || loading}
                            className={`flex items-center gap-2 font-black uppercase tracking-widest text-xs transition-colors ${step === 1 || loading ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-forest-500'}`}
                        >
                            <ChevronLeft className="w-4 h-4" /> Back
                        </button>
                        
                        <div className="flex gap-2">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className={`w-2 h-2 rounded-full transition-all duration-500 ${step === i ? 'w-8 bg-forest-500' : 'bg-gray-200'}`} />
                            ))}
                        </div>

                        {step < 4 ? (
                            <button 
                                onClick={handleNext} 
                                className="flex items-center gap-4 py-5 px-10 bg-forest-500 text-white font-black rounded-[2rem] hover:bg-forest-700 transition-all shadow-xl shadow-forest-500/20 active:scale-95"
                            >
                                Continue <ChevronRight className="w-5 h-5" />
                            </button>
                        ) : (
                            <button 
                                onClick={handleComplete} 
                                disabled={loading}
                                className="flex items-center gap-4 py-5 px-12 bg-harvest-500 text-white font-black rounded-[2rem] hover:bg-harvest-700 transition-all shadow-xl shadow-harvest-500/20 active:scale-95"
                            >
                                {loading ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" /> : "Enter Dashboard"}
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
