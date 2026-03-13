import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    CheckCircle, 
    ChevronRight, 
    MapPin, 
    Phone, 
    Briefcase, 
    FileText, 
    Linkedin, 
    Star, 
    ShieldCheck, 
    Zap, 
    CreditCard, 
    ArrowRight,
    Trophy,
    Target
} from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function OnboardingOverlay({ onClose }) {
    const [step, setStep] = useState(1);
    const [role, setRole] = useState(localStorage.getItem('user_role') || 'farmer');
    const [loading, setLoading] = useState(false);
    
    // Form States
    const [formData, setFormData] = useState({
        // Common
        phone_number: localStorage.getItem('user_phone') || '',
        
        // Farmer specific
        farm_name: '',
        address_line: '',
        state: '',
        country: 'Nigeria',
        primary_crop: '',
        
        // Expert specific
        bio: '',
        experience_years: '',
        linkedin_url: '',
        certificates: '' // Will split by comma
    });

    const [subscription, setSubscription] = useState('monthly'); // 'monthly' | 'yearly'

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSaveProfile = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            
            // Prepare data for API
            let dataToSend = { ...formData };
            
            // Handle Custom Crop
            if (dataToSend.primary_crop === 'Other') {
                dataToSend.primary_crop = dataToSend.custom_crop || 'Other';
            }
            
            // Expert specific sanitization
            if (role === 'agronomist') {
                // Number conversion
                dataToSend.experience_years = parseInt(dataToSend.experience_years) || 0;
                
                // URL formatting - ensure http/https
                if (dataToSend.linkedin_url && !dataToSend.linkedin_url.startsWith('http')) {
                    dataToSend.linkedin_url = `https://${dataToSend.linkedin_url}`;
                }
                
                // Certificates splitting
                if (dataToSend.certificates && typeof dataToSend.certificates === 'string') {
                    dataToSend.certificates = dataToSend.certificates.split(',').map(s => s.trim()).filter(Boolean);
                } else if (!dataToSend.certificates) {
                    dataToSend.certificates = [];
                }
            } else {
                // Farmer specific sanitization if any
                // Ensure no expert fields are sent if farmer? partial=True should be fine, but let's be clean.
                delete dataToSend.bio;
                delete dataToSend.experience_years;
                delete dataToSend.linkedin_url;
                delete dataToSend.certificates;
            }

            const response = await axios.post(`${API_URL}/api/auth/profile/`, dataToSend, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Sync localStorage
            Object.entries(dataToSend).forEach(([key, value]) => {
                if (typeof value === 'object') {
                    localStorage.setItem(key, JSON.stringify(value));
                } else {
                    localStorage.setItem(key, value);
                }
            });
            
            setStep(2); // Move to Premium Upgrade
        } catch (error) {
            console.error("Failed to save profile:", error);
            const errorDetail = error.response?.data?.details || error.response?.data?.error || error.message;
            const errorMessage = typeof errorDetail === 'object' 
                ? Object.entries(errorDetail).map(([k, v]) => `${k}: ${v}`).join(', ')
                : errorDetail;
            alert(`Failed to save profile: ${errorMessage}`);
        }
 finally {
            setLoading(false);
        }
    };

    const handlePremiumPayment = async (plan) => {
        setLoading(true);
        // Simulate Interswitch Payment
        setTimeout(async () => {
            try {
                const token = localStorage.getItem('access_token');
                await axios.post(`${API_URL}/api/auth/profile/`, { 
                    is_premium: true,
                    subscription_type: subscription
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                localStorage.setItem('is_premium', 'true');
                localStorage.removeItem('show_onboarding');
                onClose();
                window.location.reload(); // Refresh to apply premium perks
            } catch (error) {
                console.error("Premium activation failed:", error);
            } finally {
                setLoading(false);
            }
        }, 2000);
    };

    const skipPremium = () => {
        localStorage.removeItem('show_onboarding');
        onClose();
    };

    const farmerPrice = subscription === 'monthly' ? 13000 : 130000;
    const expertPrice = subscription === 'monthly' ? 20000 : 200000;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-md">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl relative"
            >
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-100">
                    <motion.div 
                        initial={{ width: '0%' }}
                        animate={{ width: step === 1 ? '50%' : '100%' }}
                        className="h-full bg-sage-600"
                    />
                </div>

                <div className="p-8 md:p-12">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="text-center mb-8">
                                    <h2 className="text-3xl font-black text-gray-900">Complete Your Profile</h2>
                                    <p className="text-gray-500 mt-2">Tell us more about your {role === 'agronomist' ? 'expertise' : 'farm'} to personalize your experience.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {role === 'agronomist' ? (
                                        <>
                                            <div className="col-span-2">
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Professional Bio</label>
                                                <textarea name="bio" value={formData.bio} onChange={handleChange} rows="3" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sage-500 outline-none bg-gray-50" placeholder="Tell farmers about your experience..."></textarea>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Experience (Years)</label>
                                                <input type="number" name="experience_years" value={formData.experience_years} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sage-500 outline-none bg-gray-50" placeholder="e.g. 5" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">LinkedIn URL</label>
                                                <input type="url" name="linkedin_url" value={formData.linkedin_url} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sage-500 outline-none bg-gray-50" placeholder="https://linkedin.com/in/..." />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Certificates (Comma separated)</label>
                                                <input type="text" name="certificates" value={formData.certificates} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sage-500 outline-none bg-gray-50" placeholder="B.Sc Agronomy, Certified Crop Adviser..." />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="col-span-2">
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Farm Name</label>
                                                <input type="text" name="farm_name" value={formData.farm_name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sage-500 outline-none bg-gray-50" placeholder="Green Valley Farms Ltd." />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Primary Crop Cultivated</label>
                                                <select 
                                                    name="primary_crop" 
                                                    value={formData.primary_crop} 
                                                    onChange={handleChange} 
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sage-500 outline-none bg-gray-50 font-bold"
                                                >
                                                    <option value="">Select a crop...</option>
                                                    <option value="Cocoa">Cocoa</option>
                                                    <option value="Oil Palm">Oil Palm</option>
                                                    <option value="Cassava">Cassava</option>
                                                    <option value="Maize">Maize</option>
                                                    <option value="Tomato">Tomato</option>
                                                    <option value="Yam">Yam</option>
                                                    <option value="Other">Other / Custom</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                                                <div className="relative">
                                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <input type="tel" name="phone_number" value={formData.phone_number} onChange={handleChange} className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sage-500 outline-none bg-gray-50 font-bold" placeholder="0801 234 5678" />
                                                </div>
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Farm Address</label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <input type="text" name="address_line" value={formData.address_line} onChange={handleChange} className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sage-500 outline-none bg-gray-50 font-bold" placeholder="No 12. Farm Road, Near Village Center" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">State</label>
                                                <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sage-500 outline-none bg-gray-50 font-bold" placeholder="e.g. Ogun State" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Country</label>
                                                <input type="text" name="country" value={formData.country} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sage-500 outline-none bg-gray-50 font-bold" placeholder="Nigeria" />
                                            </div>
                                            {formData.primary_crop === 'Other' && (
                                                <div className="col-span-2">
                                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Specify Custom Crop</label>
                                                    <input type="text" name="custom_crop" value={formData.custom_crop || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sage-500 outline-none bg-gray-50 font-bold" placeholder="e.g. Dragonfruit, Vanilla" />
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>

                                <button 
                                    onClick={handleSaveProfile}
                                    disabled={loading}
                                    className="w-full py-4 bg-sage-700 text-white font-black rounded-2xl hover:bg-sage-900 transition-all shadow-xl flex items-center justify-center gap-2 group mt-4"
                                >
                                    {loading ? "Saving..." : "Continue to Premium Perks"} <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <div className="text-center mb-6">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100 text-amber-700 text-xs font-black uppercase tracking-widest rounded-full mb-4">
                                        <Trophy className="w-4 h-4" /> Go Premium
                                    </div>
                                    <h2 className="text-3xl font-black text-gray-900">Unlock Full Potential</h2>
                                    <p className="text-gray-500 mt-2">Choose a plan that works best for your growth.</p>
                                </div>

                                {/* Plan Toggle */}
                                <div className="flex p-1 bg-gray-100 rounded-2xl max-w-xs mx-auto mb-8">
                                    <button onClick={() => setSubscription('monthly')} className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${subscription === 'monthly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>Monthly</button>
                                    <button onClick={() => setSubscription('yearly')} className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${subscription === 'yearly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>Yearly <span className="text-[10px] text-green-600 ml-1">SAVE 20%</span></button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    {/* Perks List */}
                                    <div className="space-y-4">
                                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                            <Zap className="w-5 h-5 text-amber-500" /> Exclusive Perks
                                        </h3>
                                        <ul className="space-y-3">
                                            {[
                                                role === 'agronomist' ? "Gold Veritas Verified Badge" : "Unlimited AI Scans & Advice",
                                                role === 'agronomist' ? "Lower Transaction Fees (5%)" : "Predictive Yield Analytics",
                                                role === 'agronomist' ? "Priority Ranking in Search" : "Instant Expert Access",
                                                role === 'agronomist' ? "Instant Payout Settlements" : "Priority Support"
                                            ].map((perk, i) => (
                                                <li key={i} className="flex items-start gap-3 text-sm text-gray-600 font-medium">
                                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" /> {perk}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Pricing Card */}
                                    <div className="bg-sage-50 rounded-3xl p-6 border border-sage-100 flex flex-col justify-between">
                                        <div>
                                            <div className="text-xs font-bold text-sage-600 uppercase tracking-widest mb-1">Premium Plan</div>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-4xl font-black text-gray-900">₦{role === 'agronomist' ? expertPrice.toLocaleString() : farmerPrice.toLocaleString()}</span>
                                                <span className="text-gray-500 text-sm">/{subscription === 'monthly' ? 'mo' : 'yr'}</span>
                                            </div>
                                        </div>
                                        <div className="mt-6 flex flex-col gap-2">
                                            <button 
                                                onClick={handlePremiumPayment}
                                                disabled={loading}
                                                className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all shadow-xl flex items-center justify-center gap-2 group"
                                            >
                                                {loading ? "Processing..." : "Pay via Interswitch"} <CreditCard className="w-5 h-5" />
                                            </button>
                                            <div className="flex items-center justify-center gap-1.5 opacity-60">
                                                <img src="/interswitch.png" alt="Interswitch" className="h-4 object-contain grayscale invert" />
                                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Powered by Interswitch</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <button onClick={skipPremium} className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors">I'll do this later, take me to dashboard</button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
