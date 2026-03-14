import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, CreditCard, CheckCircle, X, Lock, Loader2 } from 'lucide-react';
import { triggerPayment } from '../services/PaymentService';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function PremiumPaymentOverlay({ isOpen, onClose, onPaymentSuccess }) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('monthly'); // 'monthly' | 'annual'
    
    // UI Local State for Formatting
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cardType, setCardType] = useState('unknown'); // 'visa' | 'mastercard' | 'verve' | 'unknown'

    const plans = {
        monthly: { name: 'Monthly Plan', price: 2500, label: '₦2,500/mo' },
        annual: { name: 'Annual Plan', price: 25000, label: '₦25,000/yr', savings: 'Save ₦5,000' }
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
                        className="bg-white w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-2xl relative border border-white"
                    >
                        {!success ? (
                            <>
                                {/* Modal Header */}
                                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 shadow-inner">
                                            <ShieldCheck className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold text-gray-900 leading-tight">Farmer Premium Upgrade</h2>
                                            <p className="text-xs text-gray-500 font-medium">Secure Payment via Interswitch</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={onClose} 
                                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Modal Body */}
                                <div className="p-8">
                                    {/* Plan Selection */}
                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        {Object.entries(plans).map(([key, plan]) => (
                                            <button
                                                key={key}
                                                type="button"
                                                onClick={() => setSelectedPlan(key)}
                                                className={`p-4 rounded-2xl border-2 transition-all text-left relative overflow-hidden ${
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

                                    <div className="mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-center">
                                        <div>
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Total to Pay</span>
                                            <span className="text-2xl font-black text-gray-900">₦{plans[selectedPlan].price.toLocaleString()}</span>
                                        </div>
                                        <div className="text-right flex flex-col items-end gap-1">
                                            <span className="text-[10px] font-black text-sage-600 bg-sage-100 px-2 py-1 rounded-full uppercase tracking-tighter">Priority Access</span>
                                            <div className="flex gap-1 opacity-60">
                                                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-2" />
                                                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-2" />
                                                <img src="https://interswitchgroup.com/assets/images/verve-logo.png" alt="Verve" className="h-2 px-1 bg-blue-900 rounded-[2px]" />
                                            </div>
                                        </div>
                                    </div>

                                    <form onSubmit={handlePayment} className="space-y-5">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Cardholder Name</label>
                                            <input 
                                                required 
                                                type="text" 
                                                placeholder="e.g. OLUWAKEMI ADEBAYO" 
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow bg-gray-50 placeholder:opacity-30" 
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Card Number</label>
                                            <div className="relative">
                                                <input 
                                                    required 
                                                    type="text" 
                                                    value={cardNumber}
                                                    onChange={handleCardNumberChange}
                                                    placeholder="0000 0000 0000 0000" 
                                                    className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow bg-gray-50 font-mono text-lg placeholder:opacity-30" 
                                                />
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                                                    {cardType === 'visa' && <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />}
                                                    {cardType === 'mastercard' && <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4" />}
                                                    {cardType === 'verve' && <img src="https://interswitchgroup.com/assets/images/verve-logo.png" alt="Verve" className="h-4 px-1 bg-blue-900 rounded-sm" />}
                                                    {cardType === 'unknown' && <CreditCard className="w-6 h-6 text-gray-300" />}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Expiry Date</label>
                                                <input 
                                                    required 
                                                    type="text" 
                                                    value={expiryDate}
                                                    onChange={handleExpiryChange}
                                                    placeholder="MM/YY" 
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow bg-gray-50 font-mono placeholder:opacity-30" 
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">CVV</label>
                                                <input required type="password" maxLength="3" placeholder="•••" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow bg-gray-50 font-mono text-center tracking-[0.3em] placeholder:opacity-30" />
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full bg-[#00428F] text-white font-bold py-4 rounded-xl shadow-lg hover:bg-[#00306A] transition-all flex items-center justify-center gap-3 active:scale-[0.98] group relative overflow-hidden"
                                            >
                                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                                                {loading ? (
                                                    <div className="flex items-center gap-2">
                                                        <Loader2 className="w-5 h-5 animate-spin" /> Authenticating...
                                                    </div>
                                                ) : (
                                                    <>
                                                        <span className="font-medium">Pay ₦{plans[selectedPlan].price.toLocaleString()} using</span>
                                                        <img src="/interswitch.png" alt="Interswitch" className="h-5 object-contain brightness-0 invert" />
                                                    </>
                                                )}
                                            </button>
                                            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-gray-400 font-medium uppercase tracking-widest">
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
                                className="p-12 text-center flex flex-col items-center"
                            >
                                <div className="w-24 h-24 bg-sage-100 rounded-full flex items-center justify-center mb-6 relative">
                                    <div className="absolute inset-0 bg-sage-400/20 rounded-full animate-ping"></div>
                                    <CheckCircle className="w-12 h-12 text-sage-600 relative z-10" />
                                </div>
                                <h2 className="text-3xl font-black text-gray-900 mb-2">Upgrade Successful!</h2>
                                <p className="text-gray-500 font-medium mb-8 text-lg">Welcome to CeresVera Premium. Your harvest just got smarter.</p>
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
