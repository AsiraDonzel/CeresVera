import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, CheckCircle, ArrowLeft, Lock, BadgeCheck, Video, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Checkout() {
    const { consultantId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Mock expert data based on ID routing
    const expertsDb = {
        '1': { name: 'Dr. Amina Okafor', rate: 5000, img: 'https://i.pravatar.cc/150?u=amina' },
        '2': { name: 'Mr. Tunde Lawal', rate: 4500, img: 'https://i.pravatar.cc/150?u=tunde' },
        '3': { name: 'Prof. S. Mensah', rate: 7000, img: 'https://i.pravatar.cc/150?u=mensah' },
        '4': { name: 'Dr. John Doe', rate: 6000, img: 'https://i.pravatar.cc/150?u=johndoe' },
        '5': { name: 'Jane Smith', rate: 4000, img: 'https://i.pravatar.cc/150?u=janesmith' },
    };

    const expert = expertsDb[consultantId] || expertsDb['1'];

    const handlePaymentMock = (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate Interswitch external payment processing
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
        }, 3000);
    };

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
                                        <img src={expert.img} alt={expert.name} className="w-16 h-16 rounded-full border-2 border-sage-200" />
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
                                        <div className="text-3xl font-black text-gray-900">₦{expert.rate.toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Pane - Interswitch Payment Gateway Mockup */}
                            <div className="lg:w-3/5 p-8 lg:p-12 bg-white relative">
                                <div className="flex justify-between items-center mb-10">
                                    <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
                                    <div className="flex gap-1.5 opacity-60">
                                        {/* Mock credit card network icons */}
                                        <div className="w-10 h-6 bg-blue-900 rounded flex items-center justify-center text-[10px] text-white font-bold italic">VISA</div>
                                        <div className="w-10 h-6 bg-red-600 rounded flex items-center justify-center text-[10px] text-white font-bold">MASTER</div>
                                        <div className="w-10 h-6 bg-gray-900 rounded flex items-center justify-center text-[10px] text-white font-bold tracking-tighter">VERVE</div>
                                    </div>
                                </div>

                                <form onSubmit={handlePaymentMock} className="space-y-6 max-w-md mx-auto">
                                    {/* Realistic Card Input Fields */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Cardholder Name</label>
                                            <input required type="text" placeholder="e.g. OLUWAKEMI ADEBAYO" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow bg-gray-50" />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Card Number</label>
                                            <div className="relative">
                                                <input required type="text" maxLength="19" placeholder="0000 0000 0000 0000" className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow bg-gray-50 font-mono text-lg" />
                                                <CreditCard className="w-6 h-6 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Expiry Date</label>
                                                <input required type="text" maxLength="5" placeholder="MM/YY" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow bg-gray-50 font-mono" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">CVV</label>
                                                <input required type="password" maxLength="3" placeholder="•••" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow bg-gray-50 font-mono text-center tracking-[0.3em]" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-[#00428F] text-white font-bold py-4 rounded-xl shadow-[0_8px_20px_-4px_rgba(0,66,143,0.5)] hover:bg-[#00306A] transition-all flex items-center justify-center gap-3 active:scale-[0.98] relative overflow-hidden group"
                                        >
                                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                                            {loading ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Authenticating...
                                                </div>
                                            ) : (
                                                <>
                                                    <span className="font-medium">Pay ₦{expert.rate.toLocaleString()} via</span>
                                                    <img src="/interswitch.png" alt="Interswitch" className="h-5 object-contain brightness-0 invert" />
                                                </>
                                            )}
                                        </button>
                                        <div className="text-center mt-6 flex flex-col items-center justify-center gap-2 text-xs text-gray-400 font-medium">
                                            <div className="flex items-center gap-1">
                                                <ShieldCheck className="w-4 h-4 text-green-500" /> Secure 256-bit SSL Encryption
                                            </div>
                                            <div>Merchant ID: MX153376</div>
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
                                    <span className="font-bold text-gray-900">₦{expert.rate.toLocaleString()}</span>
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
