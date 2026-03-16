import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, CheckCircle, X, Lock, CreditCard, Loader2, Award, Zap, TrendingUp, Star } from 'lucide-react';
import { triggerPayment } from '../services/PaymentService';
import api from '../services/api';

export default function ExpertPremiumPaymentOverlay({ isOpen, onClose, onPaymentSuccess }) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('monthly');

    const plans = {
        monthly: { name: 'Monthly Plan', price: 4500, label: '₦4,500/mo' },
        annual: { name: 'Annual Plan', price: 45000, label: '₦45,000/yr', savings: 'Save ₦9,000' }
    };

    const perks = [
        { icon: Award, title: "Gold Veritas Badge", desc: "Highest level of trust & verification" },
        { icon: Zap, title: "Lower Platform Fees", desc: "Keep 95% of your earnings (vs 90%)" },
        { icon: TrendingUp, title: "Priority Listing", desc: "Appear first in farmer search results" },
        { icon: Star, title: "Instant Payouts", desc: "Skip the 24h standard escrow delay" }
    ];

    const handlePay = async () => {
        setLoading(true);

        try {
            const response = await api.post(`/api/payment/initiate/`, {
                amount: plans[selectedPlan].price,
                site_redirect_url: window.location.href
            });

            const paymentData = response.data;

            await triggerPayment(paymentData, async (iswResponse) => {
                if (iswResponse.resp === "00" || iswResponse.desc === "Approved by Financial Institution") {
                    try {
                        await api.post(`/api/payment/callback/`, {
                            txn_ref: paymentData.txn_ref,
                            response_code: iswResponse.resp,
                            status: 'SUCCESS'
                        });
                    } catch (e) { console.warn("Callback post failed:", e); }

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
                        className="bg-white w-full max-w-4xl rounded-[2.5rem] overflow-hidden shadow-2xl relative border border-white flex flex-col md:flex-row max-h-[90vh]"
                    >
                        {!success ? (
                            <>
                                {/* Left Side: Perks & Branding */}
                                <div className="md:w-5/12 bg-earth-900 p-6 sm:p-8 text-white relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-earth-500/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="flex items-center gap-2 mb-6 sm:mb-8">
                                            <ShieldCheck className="w-8 h-8 text-harvest-400" />
                                            <span className="text-xl font-black italic tracking-tight text-harvest-50">CeresVera <span className="text-harvest-400">Veritas</span></span>
                                        </div>

                                        <div className="space-y-6 flex-grow">
                                            <h2 className="text-2xl sm:text-3xl font-black leading-tight">Elevate Your Expertise to <span className="text-harvest-400">Veritas Premium</span></h2>
                                            <p className="text-earth-200 text-sm font-medium leading-relaxed hidden sm:block">Join our elite circle of verified agronomists and unlock the full power of the CeresVera ecosystem.</p>
                                            
                                            <div className="space-y-4 pt-4 hidden md:block">
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

                                        <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between hidden md:flex">
                                            <div className="flex -space-x-2">
                                                {[1,2,3,4].map(i => (
                                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-earth-900 bg-earth-700 flex items-center justify-center text-[10px] font-bold">DR</div>
                                                ))}
                                            </div>
                                            <span className="text-[10px] font-bold text-earth-400 uppercase tracking-widest">Join 400+ Experts</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Plan Selection + Pay */}
                                <div className="md:w-7/12 p-6 sm:p-8 md:p-10 bg-white relative overflow-y-auto">
                                    <button 
                                        onClick={onClose} 
                                        className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-400 flex items-center justify-center transition-all z-20"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>

                                    <div className="mb-6 sm:mb-8 pr-12">
                                        <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">Choose Your Plan</h3>
                                        <p className="text-sm text-gray-500 font-medium">Select a plan to activate your Veritas status.</p>
                                    </div>

                                    {/* Plan Selection */}
                                    <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8">
                                        {Object.entries(plans).map(([key, plan]) => (
                                            <button
                                                key={key}
                                                type="button"
                                                onClick={() => setSelectedPlan(key)}
                                                className={`p-4 sm:p-5 rounded-2xl border-2 transition-all text-left relative ${
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
                                                <div className="text-xl sm:text-2xl font-black text-gray-900">{plan.label}</div>
                                                {plan.savings && (
                                                    <div className="text-[10px] font-bold text-harvest-600 mt-1">{plan.savings}</div>
                                                )}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Summary */}
                                    <div className="bg-gray-50 rounded-2xl p-5 mb-8 border border-gray-100">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-gray-500 font-medium">Selected Plan</span>
                                            <span className="text-sm font-bold text-gray-900">{plans[selectedPlan].name}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500 font-medium">Amount</span>
                                            <span className="text-xl font-black text-gray-900">{plans[selectedPlan].label}</span>
                                        </div>
                                    </div>

                                    {/* Pay Button — opens Interswitch directly */}
                                    <button
                                        onClick={handlePay}
                                        disabled={loading}
                                        className="w-full bg-harvest-600 hover:bg-harvest-700 disabled:bg-harvest-400 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-harvest-600/20 flex items-center justify-center gap-3 text-base"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Opening Interswitch...
                                            </>
                                        ) : (
                                            <>
                                                <CreditCard className="w-5 h-5" />
                                                Continue to Payment
                                            </>
                                        )}
                                    </button>

                                    <div className="flex items-center justify-center gap-2 mt-5 text-gray-400">
                                        <Lock className="w-3 h-3" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Secured by Interswitch</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-10 sm:p-16 text-center flex flex-col items-center w-full bg-white"
                            >
                                <div className="w-24 sm:w-32 h-24 sm:h-32 bg-harvest-50 rounded-[2.5rem] flex items-center justify-center mb-8 relative">
                                    <div className="absolute inset-0 bg-harvest-400/20 rounded-[2.5rem] animate-ping"></div>
                                    <Award className="w-12 sm:w-16 h-12 sm:h-16 text-harvest-600 relative z-10" />
                                </div>
                                <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-4 tracking-tight italic">Welcome to the Veritas Circle!</h2>
                                <p className="text-gray-500 font-medium mb-12 text-lg sm:text-xl max-w-md">Your expert credentials have been elevated. You are now a Veritas Premium Consultant.</p>
                                
                                <div className="grid sm:grid-cols-2 gap-4 w-full max-w-2xl">
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
