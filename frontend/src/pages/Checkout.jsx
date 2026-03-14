import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, CheckCircle, ArrowLeft, Lock, BadgeCheck, Video, MessageCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerPayment } from '../services/PaymentService';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function Checkout() {
    const { consultantId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [expert, setExpert] = useState(null);

    // Form Local State
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cardType, setCardType] = useState('unknown');

    useEffect(() => {
        fetchExpert();
    }, [consultantId]);

    const fetchExpert = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/consultants/`);
            const expertData = res.data.find(e => e.id.toString() === consultantId);
            setExpert(expertData);
        } catch (err) {
            console.error('Failed to fetch expert:', err);
        }
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
        if (value.length > 16) value = value.slice(0, 16);
        const formatted = value.match(/.{1,4}/g)?.join(' ') || '';
        setCardNumber(formatted);
        setCardType(detectCardType(value));
    };

    const handleExpiryChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 4) value = value.slice(0, 4);
        if (value.length >= 2) value = value.slice(0, 2) + '/' + value.slice(2);
        setExpiryDate(value);
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.post(`${API_URL}/api/payment/initiate/`, {
                consultant_id: consultantId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const paymentData = response.data;

            await triggerPayment(paymentData, async (iswResponse) => {
                if (iswResponse.resp === "00" || iswResponse.desc === "Approved") {
                    await axios.post(`${API_URL}/api/payment/callback/`, {
                        txn_ref: paymentData.txn_ref,
                        response_code: iswResponse.resp,
                        status: 'SUCCESS'
                    });
                    setSuccess(true);
                    setLoading(false);
                } else {
                    setLoading(false);
                    alert("Payment was not successful. Please try again.");
                }
            });
        } catch (error) {
            console.error("Payment initiation failed:", error);
            setLoading(false);
            alert("Failed to initiate payment. Please verify you are logged in and try again.");
        }
    };

    if (!expert) return (
        <div className="min-h-[85vh] flex items-center justify-center bg-earth-100">
            <div className="w-12 h-12 border-4 border-sage-200 border-t-sage-600 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 bg-earth-100">
            <div className="max-w-5xl w-full">
                <button onClick={() => navigate(-1)} className="mb-6 text-gray-600 hover:text-gray-900 flex items-center gap-2 font-medium transition-colors w-fit">
                    <ArrowLeft className="w-5 h-5" /> Back to Experts
                </button>

                <AnimatePresence mode="wait">
                    {!success ? (
                        <motion.div
                            key="checkout"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="bg-white rounded-[2rem] shadow-xl shadow-earth-900/5 border border-earth-300 overflow-hidden flex flex-col lg:flex-row"
                        >
                            {/* Left Pane - Order Summary */}
                            <div className="bg-sage-50 lg:w-2/5 p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-sage-200 flex flex-col justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-8">Order Summary</h2>

                                    <div className="flex items-center gap-4 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-sage-100">
                                        <img src={expert.profile_pic_url || `https://i.pravatar.cc/150?u=${expert.id}`} alt={expert.name} className="w-16 h-16 rounded-full border-2 border-sage-200 object-cover" />
                                        <div>
                                            <div className="font-bold text-gray-900 text-lg">{expert.name}</div>
                                            <div className="text-sage-700 text-sm font-medium">1x Expert Consultation</div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-center gap-3 text-gray-700">
                                            <div className="bg-white p-2 rounded-lg shadow-sm"><Video className="w-5 h-5 text-sage-600" /></div>
                                            <span>Secure Video Call</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-700">
                                            <div className="bg-white p-2 rounded-lg shadow-sm"><MessageCircle className="w-5 h-5 text-sage-600" /></div>
                                            <span>1-Week Priority Chat</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-700">
                                            <div className="bg-white p-2 rounded-lg shadow-sm"><BadgeCheck className="w-5 h-5 text-sage-600" /></div>
                                            <span>Crop Disease Diagnosis</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-900 text-sm mb-6 shadow-sm">
                                        <Lock className="w-8 h-8 text-amber-600 shrink-0" />
                                        <div>
                                            <p className="font-bold mb-1">Escrow Protection Active</p>
                                            <p className="opacity-90 leading-tight">Your funds are held securely. The expert only gets paid after you confirm service. Settlement takes 3-5 days for standard experts.</p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-end border-t border-sage-200 pt-6">
                                        <div className="text-gray-500 font-medium">Total Amount</div>
                                        <div className="text-3xl font-black text-gray-900">₦{parseFloat(expert.rate).toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Pane - Interswitch Payment Gateway */}
                            <div className="lg:w-3/5 p-8 lg:p-12 bg-white relative">
                                <div className="flex justify-between items-center mb-10">
                                    <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
                                    <div className="flex gap-2 opacity-40 grayscale hover:grayscale-0 transition-all">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-2" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-2" />
                                        <img src="https://interswitchgroup.com/assets/images/verve-logo.png" alt="Verve" className="h-2 px-1 bg-blue-900 rounded-[2px]" />
                                    </div>
                                </div>

                                <form onSubmit={handlePayment} className="space-y-6 max-w-md mx-auto">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Card Information</label>
                                            <div className="relative group">
                                                <input 
                                                    required 
                                                    type="text" 
                                                    value={cardNumber}
                                                    onChange={handleCardNumberChange}
                                                    placeholder="0000 0000 0000 0000" 
                                                    className="w-full pl-4 pr-12 py-4 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-gray-50/50 font-mono text-lg placeholder:opacity-30" 
                                                />
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
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

                                    <div className="pt-6">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-[#00428F] text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-900/20 hover:bg-[#00306A] transition-all flex items-center justify-center gap-3 active:scale-[0.98] group relative overflow-hidden"
                                        >
                                            {loading ? (
                                                <div className="flex items-center gap-2">
                                                    <Loader2 className="w-6 h-6 animate-spin" /> Verifying...
                                                </div>
                                            ) : (
                                                <>
                                                    <span className="tracking-tight">Authorize ₦{parseFloat(expert.rate).toLocaleString()} via</span>
                                                    <img src="/interswitch.png" alt="Interswitch" className="h-5 object-contain brightness-0 invert" />
                                                </>
                                            )}
                                        </button>
                                        <div className="text-center mt-6 flex flex-col items-center justify-center gap-2 text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none">
                                            <div className="flex items-center gap-1">
                                                <ShieldCheck className="w-3 h-3 text-green-500" /> Secure Interswitch Gateway
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="bg-white rounded-[2rem] p-10 lg:p-16 shadow-2xl border border-green-100 text-center max-w-lg mx-auto relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-400 to-sage-600"></div>

                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", delay: 0.2, bounce: 0.5 }}
                                className="bg-green-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 relative"
                            >
                                <div className="absolute inset-0 bg-green-400/20 rounded-full animate-ping"></div>
                                <CheckCircle className="w-12 h-12 text-green-500 relative z-10" />
                            </motion.div>

                            <h2 className="text-3xl font-black text-gray-900 mb-3">Payment Successful!</h2>
                            <p className="text-gray-600 mb-8 text-lg">Consultation uniquely unlocked. The escrow vault is loaded.</p>

                            <div className="bg-gray-50 rounded-2xl p-6 mb-10 text-left border border-gray-100">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-gray-500 text-sm">Reference</span>
                                    <span className="font-mono font-medium text-gray-900 text-sm">ISW-{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 text-sm">Amount Paid</span>
                                    <span className="font-bold text-gray-900">₦{parseFloat(expert.rate).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <button className="w-full bg-sage-700 text-white font-bold py-4 rounded-xl hover:bg-sage-900 transition-colors shadow-lg shadow-sage-700/30 flex justify-center items-center gap-2">
                                    <Video className="w-5 h-5" /> Enter Waiting Room
                                </button>
                                <button onClick={() => navigate('/dashboard')} className="w-full text-sage-700 font-bold py-4 rounded-xl hover:bg-sage-50 transition-colors border-2 border-sage-200">
                                    Return to Dashboard
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
