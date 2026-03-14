import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, CreditCard, CheckCircle, X, Lock, Loader2, Award, Zap, TrendingUp, Star } from 'lucide-react';
import { triggerPayment } from '../services/PaymentService';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function ExpertPremiumPaymentOverlay({ isOpen, onClose, onPaymentSuccess }) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('monthly'); // 'monthly' | 'annual'

    // UI Local State for Formatting
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cardType, setCardType] = useState('unknown'); // 'visa' | 'mastercard' | 'verve' | 'unknown'

    const plans = {
        monthly: { name: 'Monthly Plan', price: 4500, label: '₦4,500/mo' },
        annual: { name: 'Annual Plan', price: 45000, label: '₦45,000/yr', savings: 'Save ₦9,000' }
    };

    const detectCardType = (number) => {
        const cleanNumber = number.replace(/\D/g, '');
        if (cleanNumber.startsWith('4')) return 'visa';
        if (/^5[1-5]/.test(cleanNumber)) return 'mastercard';
        if (/^(506|507|650)/.test(cleanNumber)) return 'verve';
        return 'unknown';
    };

    const handleCardNumberChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 19) value = value.slice(0, 19);
        
        // Format with spaces
        const formatted = value.match(/.{1,4}/g)?.join(' ') || '';
        setCardNumber(formatted);
        setCardType(detectCardType(value));
    };

    const handleExpiryChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 4) value = value.slice(0, 4);
        
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }
        setExpiryDate(value);
    };

    const perks = [
        { icon: Award, title: "Gold Veritas Badge", desc: "Highest level of trust & verification" },
        { icon: Zap, title: "Lower Platform Fees", desc: "Keep 95% of your earnings (vs 90%)" },
        { icon: TrendingUp, title: "Priority Listing", desc: "Appear first in farmer search results" },
        { icon: Star, title: "Instant Payouts", desc: "Skip the 24h standard escrow delay" }
    ];

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.post(`${API_URL}/api/payment/initiate/`, {
                amount: plans[selectedPlan].price
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const paymentData = response.data;

            await triggerPayment(paymentData, async (iswResponse) => {
                if (iswResponse.resp === "00" || iswResponse.desc === "Approved") {
                    // Call backend callback to verify and update status
                    await axios.post(`${API_URL}/api/payment/callback/`, {
                        txn_ref: paymentData.txn_ref,
                        response_code: iswResponse.resp,
                        status: 'SUCCESS'
                    });

                    localStorage.setItem('is_premium', 'true');
                    window.dispatchEvent(new Event('premiumStatusChanged'));
                    setSuccess(true);
                    setLoading(false);

                    setTimeout(() => {
                        if (onPaymentSuccess) onPaymentSuccess();
                        onClose();
                        setSuccess(false);
                    }, 2500);
                } else {
                    setLoading(false);
                    alert("Payment was not successful. Please try again.");
                }
            });
        } catch (error) {
            console.error("Payment initiation failed:", error);
            setLoading(false);
            alert("Failed to initiate payment. Please try again.");
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white w-full max-w-4xl rounded-[2.5rem] overflow-hidden shadow-2xl relative border border-white flex flex-col md:flex-row"
                    >
                        {!success ? (
                            <>
                                {/* Left Side: Perks & Branding */}
                                <div className="md:w-5/12 bg-earth-900 p-8 text-white relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-earth-500/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="flex items-center gap-2 mb-8">
                                            <ShieldCheck className="w-8 h-8 text-harvest-400" />
                                            <span className="text-xl font-black italic tracking-tight text-harvest-50">CeresVera <span className="text-harvest-400">Veritas</span></span>
                                        </div>

                                        <div className="space-y-6 flex-grow">
                                            <h2 className="text-3xl font-black leading-tight">Elevate Your Expertise to <span className="text-harvest-400">Veritas Premium</span></h2>
                                            <p className="text-earth-200 text-sm font-medium leading-relaxed">Join our elite circle of verified agronomists and unlock the full power of the CeresVera ecosystem.</p>
                                            
                                            <div className="space-y-4 pt-4">
                                                {perks.map((perk, i) => (
                                                    <div key={i} className="flex gap-4">
                                                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0 border border-white/10">
                                                            <perk.icon className="w-5 h-5 text-harvest-300" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-sm text-white">{perk.title}</h4>
                                                            <p className="text-[10px] text-earth-300 font-medium">{perk.desc}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                                            <div className="flex -space-x-2">
                                                {[1,2,3,4].map(i => (
                                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-earth-900 bg-earth-700 flex items-center justify-center text-[10px] font-bold">DR</div>
                                                ))}
                                            </div>
                                            <span className="text-[10px] font-bold text-earth-400 uppercase tracking-widest">Join 400+ Experts</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Payment Form */}
                                <div className="md:w-7/12 p-8 md:p-12 bg-white relative">
                                    <button 
                                        onClick={onClose} 
                                        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-400 flex items-center justify-center transition-all z-20"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>

                                    <div className="mb-8">
                                        <h3 className="text-2xl font-black text-gray-900 mb-2">Secure Checkout</h3>
                                        <p className="text-sm text-gray-500 font-medium">Select a plan to activate your Veritas status.</p>
                                    </div>

                                    {/* Plan Selection */}
                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        {Object.entries(plans).map(([key, plan]) => (
                                            <button
                                                key={key}
                                                type="button"
                                                onClick={() => setSelectedPlan(key)}
                                                className={`p-5 rounded-2xl border-2 transition-all text-left relative overflow-hidden ${
                                                    selectedPlan === key 
                                                        ? 'border-harvest-500 bg-harvest-50 ring-4 ring-harvest-500/10' 
                                                        : 'border-gray-100 bg-white hover:border-gray-200'
                                                }`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${selectedPlan === key ? 'text-harvest-700' : 'text-gray-400'}`}>
                                                        {plan.name}
                                                    </span>
                                                    {plan.savings && (
                                                        <span className="bg-harvest-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase">
                                                            Save 16%
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-2xl font-black text-gray-900">{plan.label}</div>
                                                {plan.savings && (
                                                    <div className="text-[10px] font-bold text-harvest-600 mt-1">{plan.savings}</div>
                                                )}
                                            </button>
                                        ))}
                                    </div>

                                    <form onSubmit={handlePayment} className="space-y-6">
                                        <div className="grid grid-cols-1 gap-6">
                                            <div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">Card Information</label>
                                                    <div className="flex gap-1 opacity-40 grayscale hover:grayscale-0 transition-all">
                                                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-2" />
                                                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-2" />
                                                        <img src="https://interswitchgroup.com/assets/images/verve-logo.png" alt="Verve" className="h-2 px-1 bg-blue-900 rounded-[2px]" />
                                                    </div>
                                                </div>
                                                <div className="relative group">
                                                    <input 
                                                        required 
                                                        type="text" 
                                                        value={cardNumber}
                                                        onChange={handleCardNumberChange}
                                                        placeholder="0000 0000 0000 0000" 
                                                        className="w-full pl-4 pr-12 py-4 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-gray-50/50 font-mono text-lg placeholder:opacity-30" 
                                                    />
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                                                        {cardType === 'visa' && <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />}
                                                        {cardType === 'mastercard' && <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4" />}
                                                        {cardType === 'verve' && <img src="https://interswitchgroup.com/assets/images/verve-logo.png" alt="Verve" className="h-4 px-1 bg-blue-900 rounded-sm" />}
                                                        {cardType === 'unknown' && <CreditCard className="w-6 h-6 text-gray-300 group-focus-within:text-blue-500 transition-colors" />}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Expiry</label>
                                                    <input 
                                                        required 
                                                        type="text" 
                                                        value={expiryDate}
                                                        onChange={handleExpiryChange}
                                                        placeholder="MM/YY" 
                                                        className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-gray-50/50 font-mono text-center placeholder:opacity-30" 
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">CVV</label>
                                                    <input required type="password" maxLength="3" placeholder="•••" className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-gray-50/50 font-mono text-center tracking-[0.3em] placeholder:opacity-30" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full bg-[#00428F] text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-900/20 hover:bg-[#00306A] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 active:scale-[0.98] group relative overflow-hidden"
                                            >
                                                {loading ? (
                                                    <div className="flex items-center gap-2">
                                                        <Loader2 className="w-6 h-6 animate-spin" /> Verifying with Interswitch...
                                                    </div>
                                                ) : (
                                                    <>
                                                        <span className="tracking-tight">Authorize Payment — ₦{plans[selectedPlan].price.toLocaleString()}</span>
                                                        <div className="h-6 w-px bg-white/20 mx-1"></div>
                                                        <img src="/interswitch.png" alt="Interswitch" className="h-5 object-contain brightness-0 invert" />
                                                    </>
                                                )}
                                            </button>
                                            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-gray-400 font-black uppercase tracking-widest">
                                                <Lock className="w-3 h-3" /> Secure Interswitch Gateway
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-16 text-center flex flex-col items-center w-full bg-white"
                            >
                                <div className="w-32 h-32 bg-harvest-50 rounded-[2.5rem] flex items-center justify-center mb-8 relative">
                                    <div className="absolute inset-0 bg-harvest-400/20 rounded-[2.5rem] animate-ping"></div>
                                    <Award className="w-16 h-16 text-harvest-600 relative z-10" />
                                </div>
                                <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight italic">Welcome to the Veritas Circle!</h2>
                                <p className="text-gray-500 font-medium mb-12 text-xl max-w-md">Your expert credentials have been elevated. You are now a Veritas Premium Consultant.</p>
                                
                                <div className="grid md:grid-cols-2 gap-4 w-full max-w-2xl">
                                    <div className="bg-gray-50 rounded-2xl p-6 text-left border border-gray-100">
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Transaction Ref</div>
                                        <div className="font-mono font-black text-gray-900">VER-ISW-{Math.random().toString(36).substring(2, 10).toUpperCase()}</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-2xl p-6 text-left border border-gray-100">
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Premium Status</div>
                                        <div className="font-black text-harvest-600 uppercase">Active • Gold Veritas</div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
