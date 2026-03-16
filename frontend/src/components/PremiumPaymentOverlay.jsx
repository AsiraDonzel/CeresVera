import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, CheckCircle, X, Lock, CreditCard, Loader2 } from 'lucide-react';
import { triggerPayment } from '../services/PaymentService';
import api from '../services/api';

export default function PremiumPaymentOverlay({ isOpen, onClose, onPaymentSuccess }) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('monthly');

    const plans = {
        monthly: { name: 'Monthly Plan', price: 1500, label: '₦1,500/mo' },
        annual: { name: 'Annual Plan', price: 15000, label: '₦15,000/yr', savings: 'Save ₦3,000' }
    };

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
                        className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl relative border border-white"
                    >
                        {!success ? (
                            <>
                                {/* Header */}
                                <div className="px-6 sm:px-8 py-5 sm:py-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-sage-50 rounded-full flex items-center justify-center text-sage-600 shadow-inner">
                                            <ShieldCheck className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold text-gray-900 leading-tight">Farmer Premium</h2>
                                            <p className="text-xs text-gray-500 font-medium">Upgrade via Interswitch</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={onClose} 
                                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Body */}
                                <div className="p-6 sm:p-8">
                                    {/* Plan Selection */}
                                    <p className="text-sm font-semibold text-gray-700 mb-3">Select your plan</p>
                                    <div className="grid grid-cols-2 gap-3 mb-6">
                                        {Object.entries(plans).map(([key, plan]) => (
                                            <button
                                                key={key}
                                                type="button"
                                                onClick={() => setSelectedPlan(key)}
                                                className={`p-4 rounded-2xl border-2 transition-all text-left relative ${
                                                    selectedPlan === key 
                                                        ? 'border-sage-500 bg-sage-50 ring-2 ring-sage-500/10' 
                                                        : 'border-gray-100 bg-white hover:border-gray-200'
                                                }`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${selectedPlan === key ? 'text-sage-700' : 'text-gray-400'}`}>
                                                        {plan.name}
                                                    </span>
                                                    {plan.savings && (
                                                        <span className="bg-sage-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase">
                                                            Save 16%
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-xl font-black text-gray-900">{plan.label}</div>
                                                {plan.savings && (
                                                    <div className="text-[10px] font-bold text-sage-600 mt-1">{plan.savings}</div>
                                                )}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Summary */}
                                    <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm text-gray-500 font-medium">Plan</span>
                                            <span className="text-sm font-bold text-gray-900">{plans[selectedPlan].name}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500 font-medium">Total</span>
                                            <span className="text-lg font-black text-gray-900">{plans[selectedPlan].label}</span>
                                        </div>
                                    </div>

                                    {/* Pay Button */}
                                    <button
                                        onClick={handlePay}
                                        disabled={loading}
                                        className="w-full bg-sage-700 hover:bg-sage-800 disabled:bg-sage-400 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-sage-700/20 flex items-center justify-center gap-3 text-base"
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

                                    <div className="flex items-center justify-center gap-2 mt-4 text-gray-400">
                                        <Lock className="w-3 h-3" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Secured by Interswitch</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-12 text-center flex flex-col items-center"
                            >
                                <div className="w-24 h-24 bg-sage-100 rounded-full flex items-center justify-center mb-6 relative">
                                    <div className="absolute inset-0 bg-sage-400/20 rounded-full animate-ping"></div>
                                    <CheckCircle className="w-12 h-12 text-sage-600 relative z-10" />
                                </div>
                                <h2 className="text-3xl font-black text-gray-900 mb-2">Upgrade Successful!</h2>
                                <p className="text-gray-500 font-medium mb-8 text-lg">Welcome to CeresVera Premium.</p>
                                <div className="bg-gray-50 rounded-2xl p-6 w-full text-left border border-gray-100">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-gray-500 text-sm font-bold uppercase tracking-wider">Reference</span>
                                        <span className="font-mono font-black text-gray-900 text-sm">ISW-{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500 text-sm font-bold uppercase tracking-wider">Status</span>
                                        <span className="font-black text-sage-600 text-sm uppercase">Active</span>
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
