import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, FileText, CheckCircle, X, Loader2, ArrowRight } from 'lucide-react';
import { triggerPayment } from '../services/PaymentService';
import api from '../services/api';

export default function ConsultantPaymentOverlay({ isOpen, onClose, expert }) {
    const [selectedOption, setSelectedOption] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen || !expert) return null;

    // Rates based on the expert's rate
    // Note: fallback to 15000 is also handled in backend, but keep frontend synced
    const expertRate = parseFloat(expert.rate) || 15000;
    const options = [
        {
            id: 'video',
            title: 'Live Video Consultation',
            desc: 'Face-to-face virtual meeting to discuss issues in real-time.',
            price: expertRate,
            icon: <Video className="w-6 h-6" />,
            color: 'blue'
        },
        {
            id: 'report',
            title: 'Diagnostic Report',
            desc: 'Detailed written analysis and recommendations based on your submission.',
            price: expertRate * 0.7, // 30% cheaper for a written report
            icon: <FileText className="w-6 h-6" />,
            color: 'sage'
        }
    ];

    const handleContinue = async () => {
        if (!selectedOption) return;
        setIsProcessing(true);
        const selected = options.find(o => o.id === selectedOption);

        try {
            console.log('[Payment] Initiating for expert:', expert.id, 'Amount:', selected.price);
            // Initiate payment with backend using authorized api service
            const res = await api.post(`/api/payment/initiate/`, {
                consultant_id: expert.id,
                amount: selected.price,
                site_redirect_url: window.location.href
            });

            console.log('[Payment] Initiation Success:', res.data);

            // Use the standardized triggerPayment service
            await triggerPayment(res.data, async (response) => {
                console.log('[Payment] Interswitch Response:', response);
                if (response.resp === '00' || response.desc === 'Approved by Financial Institution') {
                    // Payment Successful Verification
                    await api.post(`/api/payment/callback/`, {
                        txn_ref: response.txnref || response.txn_ref,
                        response_code: response.resp,
                        status: 'SUCCESS'
                    });
                    
                    // Save paid consultant ID so they appear in chat/dashboard
                    const paidConsultants = JSON.parse(localStorage.getItem('paid_consultants') || '[]');
                    if (!paidConsultants.includes(expert.id)) {
                        paidConsultants.push(expert.id);
                        localStorage.setItem('paid_consultants', JSON.stringify(paidConsultants));
                    }

                    setIsSuccess(true);
                    setIsProcessing(false);
                    setTimeout(() => {
                        onClose();
                        window.location.href = '/messaging';
                    }, 2000);
                } else {
                    setIsProcessing(false);
                    alert(`Payment failed: ${response.desc || 'Unknown error'}`);
                }
            });

        } catch (err) {
            console.error('Payment initiation error:', err.response?.data || err.message);
            setIsProcessing(false);
            const errorMsg = err.response?.data?.error || err.response?.data?.details || err.message;
            alert(`Failed to initiate payment: ${errorMsg}`);
        }
    };

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={onClose}
            >
                <div onClick={e => e.stopPropagation()} className="w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl relative">
                    {/* Success State */}
                    {isSuccess ? (
                        <div className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                            <motion.div 
                                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}
                                className="w-24 h-24 bg-sage-100 text-sage-600 rounded-full flex items-center justify-center mb-6"
                            >
                                <CheckCircle className="w-12 h-12" />
                            </motion.div>
                            <h2 className="text-3xl font-black text-gray-900 mb-2">Payment Successful!</h2>
                            <div className="bg-sage-50 border border-sage-100 p-6 rounded-2xl max-w-sm">
                                {selectedOption === 'video' ? (
                                    <p className="text-sage-800 font-bold leading-relaxed">
                                        Your **Live Video Session** is confirmed! Go to the chat now and wait for Dr. {expert.name.split(' ').pop()} to initiate the call.
                                    </p>
                                ) : (
                                    <p className="text-sage-800 font-bold leading-relaxed">
                                        Your **Diagnostic Report** is confirmed. Please share any photos or details in the chat; the expert will send your analysis within 24 hours.
                                    </p>
                                )}
                            </div>
                            <p className="mt-6 text-gray-500 font-medium animate-pulse">Redirecting to chat...</p>
                        </div>
                    ) : (
                        <>
                            {/* Header */}
                            <div className="bg-gradient-to-br from-gray-900 to-sage-900 p-8 text-white relative overflow-hidden">
                                <button 
                                    onClick={onClose} 
                                    className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors bg-white/10 rounded-full p-2 z-50 pointer-events-auto"
                                    type="button"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4"></div>
                                <h2 className="text-2xl font-black mb-1 relative z-10">Consult {expert.name}</h2>
                                <p className="text-sage-200 text-sm font-medium relative z-10">Select your preferred consultation method</p>
                            </div>

                            {/* Body */}
                            <div className="p-8 space-y-4">
                                {options.map(option => (
                                    <motion.button
                                        key={option.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setSelectedOption(option.id)}
                                        className={`w-full p-6 bg-gray-50 border-2 rounded-2xl flex items-start gap-4 transition-all text-left ${selectedOption === option.id ? `border-sage-500 bg-sage-50` : 'border-transparent hover:border-gray-200'}`}
                                    >
                                        <div className={`shrink-0 p-3 rounded-xl bg-white shadow-sm text-${option.color}-600`}>
                                            {option.icon}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-bold text-gray-900">{option.title}</h3>
                                                <span className="font-black text-sage-700">₦{option.price.toLocaleString()}</span>
                                            </div>
                                            <p className="text-sm text-gray-500 leading-relaxed">{option.desc}</p>
                                        </div>
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${selectedOption === option.id ? 'border-sage-500 bg-sage-500' : 'border-gray-300'}`}>
                                            {selectedOption === option.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                        </div>
                                    </motion.button>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="p-8 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                                <div className="text-left">
                                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Total Due</p>
                                    <p className="text-2xl font-black text-gray-900">
                                        {selectedOption ? `₦${options.find(o=>o.id === selectedOption).price.toLocaleString()}` : '—'}
                                    </p>
                                </div>
                                <button
                                    onClick={handleContinue}
                                    disabled={!selectedOption || isProcessing}
                                    className="px-8 py-4 bg-sage-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-sage-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-sage-200"
                                >
                                    {isProcessing ? (
                                        <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                                    ) : (
                                        <>Proceed to Pay <ArrowRight className="w-5 h-5" /></>
                                    )}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
