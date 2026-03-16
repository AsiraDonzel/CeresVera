import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Lock, BadgeCheck, Video, MessageCircle, CreditCard, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerPayment } from '../services/PaymentService';
import api from '../services/api';

export default function Checkout() {
    const { consultantId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [expert, setExpert] = useState(null);

    useEffect(() => {
        fetchExpert();
    }, [consultantId]);

    const fetchExpert = async () => {
        try {
            const res = await api.get(`/api/consultants/`);
            const expertData = res.data.find(e => e.id.toString() === consultantId);
            setExpert(expertData);
        } catch (err) {
            console.error('Failed to fetch expert:', err);
        }
    };

    const handlePay = async () => {
        setLoading(true);

        try {
            const response = await api.post(`/api/payment/initiate/`, {
                consultant_id: consultantId,
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
        <div className="min-h-[85vh] flex items-center justify-center py-8 sm:py-12 px-4 bg-earth-100">
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
                            <div className="bg-sage-50 lg:w-2/5 p-6 sm:p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-sage-200 flex flex-col justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-6 sm:mb-8">Order Summary</h2>

                                    <div className="flex items-center gap-4 mb-6 sm:mb-8 bg-white p-4 rounded-2xl shadow-sm border border-sage-100">
                                        <img src={expert.profile_pic_url || `https://i.pravatar.cc/150?u=${expert.id}`} alt={expert.name} className="w-14 sm:w-16 h-14 sm:h-16 rounded-full border-2 border-sage-200 object-cover" />
                                        <div>
                                            <div className="font-bold text-gray-900 text-base sm:text-lg">{expert.name}</div>
                                            <div className="text-sage-700 text-sm font-medium">1x Expert Consultation</div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-6 sm:mb-8">
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

                                <div className="mt-6 sm:mt-8">
                                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-900 text-sm mb-6 shadow-sm">
                                        <Lock className="w-8 h-8 text-amber-600 shrink-0" />
                                        <div>
                                            <p className="font-bold mb-1">Escrow Protection Active</p>
                                            <p className="opacity-90 leading-tight">Your funds are held securely. The expert only gets paid after you confirm service.</p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-end border-t border-sage-200 pt-6">
                                        <div className="text-gray-500 font-medium">Total Amount</div>
                                        <div className="text-2xl sm:text-3xl font-black text-gray-900">₦{parseFloat(expert.rate).toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Pane - Pay button */}
                            <div className="lg:w-3/5 p-6 sm:p-8 lg:p-12 bg-white relative flex flex-col justify-center">
                                <div className="max-w-md mx-auto w-full">
                                    <div className="text-center mb-8">
                                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Ready to Pay</h2>
                                        <p className="text-sm text-gray-500 font-medium">You'll be taken to Interswitch's secure checkout to complete your payment.</p>
                                    </div>

                                    {/* Amount Display */}
                                    <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100 text-center">
                                        <div className="text-sm text-gray-500 font-medium mb-1">You're paying</div>
                                        <div className="text-3xl font-black text-gray-900">₦{parseFloat(expert.rate).toLocaleString()}</div>
                                        <div className="text-xs text-gray-400 mt-1">to {expert.name}</div>
                                    </div>

                                    {/* Pay Button — opens Interswitch directly */}
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

                                    <div className="flex items-center justify-center gap-2 mt-5 text-gray-400">
                                        <Lock className="w-3 h-3" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Secured by Interswitch</span>
                                    </div>

                                    {/* Payment methods info */}
                                    <div className="mt-8 text-center">
                                        <p className="text-xs text-gray-400 font-medium mb-3">Accepted payment methods</p>
                                        <div className="flex items-center justify-center gap-3 flex-wrap">
                                            {['Card', 'Transfer', 'OPay', 'QR', 'USSD'].map(m => (
                                                <span key={m} className="bg-gray-50 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-gray-500 border border-gray-100">{m}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
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
                            <p className="text-gray-600 mb-8 text-lg">Consultation unlocked. The escrow vault is loaded.</p>

                            <div className="bg-gray-50 rounded-2xl p-6 mb-10 text-left border border-gray-100">
                                <div className="flex justify-between items-center mb-3">
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
