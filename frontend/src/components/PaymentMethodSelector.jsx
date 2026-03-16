import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    CreditCard, ChevronRight, ArrowLeft, Lock, Loader2,
    Building2, Smartphone, QrCode, Hash, Wallet
} from 'lucide-react';

/**
 * PaymentMethodSelector — Interswitch-style multi-method payment selector.
 * 
 * Props:
 * - amount: number (in naira)
 * - fee: number (processing fee, default 0.45% of amount)
 * - merchantName: string (e.g. "CeresVera")
 * - onPayment: async (method, formData) => void
 * - loading: boolean
 */
export default function PaymentMethodSelector({ amount, fee, merchantName = 'CeresVera', onPayment, loading }) {
    const [selectedMethod, setSelectedMethod] = useState(null);
    
    // Card form state
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardType, setCardType] = useState('unknown');

    // Transfer state
    const [transferCountdown, setTransferCountdown] = useState(1800); // 30 min
    const [transferCopied, setTransferCopied] = useState(false);

    // USSD state
    const [selectedBank, setSelectedBank] = useState('');

    // OPay state
    const [opayPhone, setOpayPhone] = useState('');

    const computedFee = fee ?? Math.round(amount * 0.015);
    const totalAmount = amount + computedFee;

    const detectCardType = (number) => {
        const clean = number.replace(/\D/g, '');
        if (clean.startsWith('4')) return 'visa';
        if (/^5[1-5]/.test(clean)) return 'mastercard';
        if (/^(506|507|650)/.test(clean)) return 'verve';
        return 'unknown';
    };

    const handleCardNumberChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 19) value = value.slice(0, 19);
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

    const generatedAccount = '0123456789';
    const generatedBank = 'Providus Bank';

    const ussdBanks = [
        { name: 'GTBank', code: '*737*' },
        { name: 'First Bank', code: '*894*' },
        { name: 'UBA', code: '*919*' },
        { name: 'FCMB', code: '*329*' },
        { name: 'Access Bank', code: '*901*' },
        { name: 'Zenith Bank', code: '*966*' },
        { name: 'Stanbic IBTC', code: '*909*' },
        { name: 'Sterling Bank', code: '*822*' },
        { name: 'Fidelity Bank', code: '*770*' },
        { name: 'Unity Bank', code: '*7799*' },
        { name: 'Wema Bank', code: '*945*' },
        { name: 'Heritage Bank', code: '*745*' },
        { name: 'Polaris Bank', code: '*833*' },
        { name: 'Keystone Bank', code: '*7111*' },
        { name: 'Ecobank', code: '*326*' },
        { name: 'Union Bank', code: '*826*' },
        { name: 'Jaiz Bank', code: '*389*' },
    ];

    const paymentMethods = [
        {
            id: 'card',
            icon: <CreditCard className="w-5 h-5" />,
            iconBg: 'bg-blue-50 text-blue-600',
            title: 'Pay with Card',
            desc: 'Verve, Visa, Mastercard, Discover and Amex are all accepted',
        },
        {
            id: 'transfer',
            icon: <Building2 className="w-5 h-5" />,
            iconBg: 'bg-cyan-50 text-cyan-600',
            title: 'Pay with Transfer',
            desc: 'Make a transfer directly from your bank account to complete a transaction',
            badge: 'Top choice',
        },
        {
            id: 'opay',
            icon: <div className="w-5 h-5 rounded-full bg-[#1DCF9F] flex items-center justify-center"><span className="text-white text-[10px] font-black">O</span></div>,
            iconBg: 'bg-[#E8FAF5]',
            title: 'Pay with OPay',
            desc: 'Complete transaction with OPay',
        },
        {
            id: 'quickteller',
            icon: <Wallet className="w-5 h-5" />,
            iconBg: 'bg-purple-50 text-purple-600',
            title: 'Pay with Quickteller',
            desc: 'Login to your Quickteller wallet to get access to your saved cards',
        },
        {
            id: 'qr',
            icon: <QrCode className="w-5 h-5" />,
            iconBg: 'bg-rose-50 text-rose-600',
            title: 'Pay with QR',
            desc: 'Generate a QR code you can scan with your bank app to pay',
        },
        {
            id: 'ussd',
            icon: <Hash className="w-5 h-5" />,
            iconBg: 'bg-indigo-50 text-indigo-600',
            title: 'Pay with USSD',
            desc: 'Dial a USSD string from any of 17+ banks to complete a transaction',
        },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onPayment) {
            onPayment(selectedMethod, { cardNumber, expiryDate, cvv, selectedBank, opayPhone });
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setTransferCopied(true);
        setTimeout(() => setTransferCopied(false), 2000);
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    // Method selection list
    if (!selectedMethod) {
        return (
            <div className="space-y-0">
                {/* Amount Header */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                        <img src="/interswitch.png" alt="ISW" className="w-6 h-6 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-medium">You're paying</p>
                        <p className="text-xl font-black text-gray-900">NGN {amount?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Fee: NGN {computedFee?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="divide-y divide-gray-100">
                    {paymentMethods.map((method) => (
                        <button
                            key={method.id}
                            onClick={() => setSelectedMethod(method.id)}
                            className="w-full flex items-center gap-4 py-4 px-2 hover:bg-gray-50 transition-colors text-left group rounded-xl"
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${method.iconBg}`}>
                                {method.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-gray-900 text-sm">{method.title}</span>
                                    {method.badge && (
                                        <span className="bg-[#F0C800] text-[10px] font-black px-2 py-0.5 rounded-md text-gray-900 flex items-center gap-1">
                                            <span>⭐</span> {method.badge}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 font-medium mt-0.5 leading-snug">{method.desc}</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 shrink-0 transition-colors" />
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    // Back button + selected method content
    return (
        <div className="space-y-6">
            {/* Amount Header with Back */}
            <div className="pb-4 border-b border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                        <img src="/interswitch.png" alt="ISW" className="w-6 h-6 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-medium">You're paying</p>
                        <p className="text-xl font-black text-gray-900">NGN {amount?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Fee: NGN {computedFee?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                    </div>
                </div>
                <button
                    onClick={() => setSelectedMethod(null)}
                    className="text-[#00428F] text-sm font-bold flex items-center gap-1.5 hover:gap-2.5 transition-all"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Change payment method
                </button>
            </div>

            <AnimatePresence mode="wait">
                {/* ===== CARD FORM ===== */}
                {selectedMethod === 'card' && (
                    <motion.form
                        key="card"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >
                        <h3 className="text-lg font-black text-gray-900">Pay with card</h3>
                        <p className="text-sm text-gray-500 font-medium -mt-3">Enter your card details below</p>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Card Number</label>
                            <div className="relative">
                                <input
                                    required
                                    type="text"
                                    value={cardNumber}
                                    onChange={handleCardNumberChange}
                                    placeholder="0000 0000 0000 0000"
                                    className="w-full pl-4 pr-14 py-4 rounded-xl border border-gray-200 focus:ring-4 focus:ring-[#00428F]/10 focus:border-[#00428F] outline-none transition-all bg-gray-50/50 font-mono text-lg placeholder:opacity-30"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                                    {cardType === 'visa' && <img src="/visa.png" alt="Visa" className="h-6" />}
                                    {cardType === 'mastercard' && <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />}
                                    {cardType === 'verve' && <img src="/verve.png" alt="Verve" className="h-6" />}
                                    {cardType === 'unknown' && <CreditCard className="w-6 h-6 text-gray-300" />}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Expiry</label>
                                <input
                                    required
                                    type="text"
                                    value={expiryDate}
                                    onChange={handleExpiryChange}
                                    placeholder="MM / YY"
                                    className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:ring-4 focus:ring-[#00428F]/10 focus:border-[#00428F] outline-none transition-all bg-gray-50/50 font-mono text-center placeholder:opacity-30"
                                />
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">CVV</label>
                                    <span className="text-[10px] text-gray-400 font-medium cursor-help" title="3-digit security code on the back of your card">What's this?</span>
                                </div>
                                <input
                                    required
                                    type="password"
                                    maxLength="3"
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                                    placeholder="123"
                                    className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:ring-4 focus:ring-[#00428F]/10 focus:border-[#00428F] outline-none transition-all bg-gray-50/50 font-mono text-center tracking-[0.3em] placeholder:opacity-30"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#00B8D9] hover:bg-[#00A3C0] text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98] mt-2"
                        >
                            {loading ? (
                                <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                            ) : (
                                <>Pay NGN {totalAmount?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</>
                            )}
                        </button>

                        <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-2">
                            <Lock className="w-3 h-3" /> Secured by Interswitch
                        </div>
                    </motion.form>
                )}

                {/* ===== TRANSFER ===== */}
                {selectedMethod === 'transfer' && (
                    <motion.div
                        key="transfer"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-5"
                    >
                        <h3 className="text-lg font-black text-gray-900">Pay with Transfer</h3>
                        <p className="text-sm text-gray-500 font-medium -mt-3">Transfer the exact amount to the account below</p>

                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 space-y-5">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</span>
                                <span className="text-xl font-black text-gray-900">₦{totalAmount?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                            </div>
                            <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Account Number</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-lg font-black text-gray-900">{generatedAccount}</span>
                                    <button
                                        type="button"
                                        onClick={() => copyToClipboard(generatedAccount)}
                                        className="text-[10px] font-black uppercase px-2.5 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
                                    >
                                        {transferCopied ? '✓ Copied' : 'Copy'}
                                    </button>
                                </div>
                            </div>
                            <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Bank Name</span>
                                <span className="font-bold text-gray-900">{generatedBank}</span>
                            </div>
                            <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Beneficiary</span>
                                <span className="font-bold text-gray-900">{merchantName}</span>
                            </div>
                        </div>

                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-sm font-medium">
                            <p>⏳ This account is temporary and will expire in <strong>30:00 minutes</strong>. Please use your banking app to complete the transfer.</p>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full bg-[#00B8D9] hover:bg-[#00A3C0] text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                        >
                            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Confirming...</> : "I've sent the money"}
                        </button>

                        <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                            <Lock className="w-3 h-3" /> Secured by Interswitch
                        </div>
                    </motion.div>
                )}

                {/* ===== OPAY ===== */}
                {selectedMethod === 'opay' && (
                    <motion.form
                        key="opay"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >
                        <h3 className="text-lg font-black text-gray-900">Pay with OPay</h3>
                        <p className="text-sm text-gray-500 font-medium -mt-3">Enter your OPay phone number to proceed</p>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">OPay Phone Number</label>
                            <input
                                required
                                type="tel"
                                value={opayPhone}
                                onChange={(e) => setOpayPhone(e.target.value)}
                                placeholder="080 1234 5678"
                                className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:ring-4 focus:ring-[#1DCF9F]/20 focus:border-[#1DCF9F] outline-none transition-all bg-gray-50/50 font-mono text-lg placeholder:opacity-30"
                            />
                        </div>

                        <p className="text-xs text-gray-400 font-medium">You'll receive a push notification on your OPay app to authorize the payment of <strong className="text-gray-700">₦{totalAmount?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong>.</p>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#1DCF9F] hover:bg-[#17B88D] text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                        >
                            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : <>Pay with OPay — ₦{totalAmount?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</>}
                        </button>

                        <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                            <Lock className="w-3 h-3" /> Secured by Interswitch
                        </div>
                    </motion.form>
                )}

                {/* ===== QUICKTELLER ===== */}
                {selectedMethod === 'quickteller' && (
                    <motion.div
                        key="quickteller"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-5"
                    >
                        <h3 className="text-lg font-black text-gray-900">Pay with Quickteller</h3>
                        <p className="text-sm text-gray-500 font-medium -mt-3">Access your Quickteller wallet and saved cards</p>

                        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                    <Wallet className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">Quickteller Wallet</p>
                                    <p className="text-xs text-gray-500">Login to access saved payment methods</p>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 font-medium leading-relaxed">You'll be redirected to the Quickteller portal to authenticate and complete your payment of <strong className="text-gray-800">₦{totalAmount?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong>.</p>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full bg-[#5B2C8E] hover:bg-[#4A2375] text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                        >
                            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Redirecting...</> : 'Continue to Quickteller'}
                        </button>

                        <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                            <Lock className="w-3 h-3" /> Secured by Interswitch
                        </div>
                    </motion.div>
                )}

                {/* ===== QR CODE ===== */}
                {selectedMethod === 'qr' && (
                    <motion.div
                        key="qr"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-5"
                    >
                        <h3 className="text-lg font-black text-gray-900">Pay with QR Code</h3>
                        <p className="text-sm text-gray-500 font-medium -mt-3">Scan this code with your bank's mobile app</p>

                        <div className="flex flex-col items-center py-6">
                            {/* SVG QR Code Placeholder */}
                            <div className="w-48 h-48 bg-white border-2 border-gray-200 rounded-2xl flex items-center justify-center p-4 shadow-inner">
                                <svg viewBox="0 0 100 100" className="w-full h-full">
                                    {/* QR pattern */}
                                    <rect x="0" y="0" width="30" height="30" rx="3" fill="#111" />
                                    <rect x="4" y="4" width="22" height="22" rx="2" fill="white" />
                                    <rect x="8" y="8" width="14" height="14" rx="1" fill="#111" />
                                    
                                    <rect x="70" y="0" width="30" height="30" rx="3" fill="#111" />
                                    <rect x="74" y="4" width="22" height="22" rx="2" fill="white" />
                                    <rect x="78" y="8" width="14" height="14" rx="1" fill="#111" />
                                    
                                    <rect x="0" y="70" width="30" height="30" rx="3" fill="#111" />
                                    <rect x="4" y="74" width="22" height="22" rx="2" fill="white" />
                                    <rect x="8" y="78" width="14" height="14" rx="1" fill="#111" />
                                    
                                    {/* Random data cells */}
                                    {[35,40,45,50,55,60].map(x => 
                                        [5,15,25,35,45,55,65,75,85].map(y => (
                                            Math.random() > 0.4 && <rect key={`${x}-${y}`} x={x} y={y} width="4" height="4" rx="0.5" fill="#111" />
                                        ))
                                    )}
                                    {[5,15,25,35,45,55,60,65].map(x => 
                                        [35,40,45,50,55,60].map(y => (
                                            Math.random() > 0.4 && <rect key={`b${x}-${y}`} x={x} y={y} width="4" height="4" rx="0.5" fill="#111" />
                                        ))
                                    )}
                                    {[75,80,85,90].map(x => 
                                        [40,50,60,70,80,90].map(y => (
                                            Math.random() > 0.35 && <rect key={`c${x}-${y}`} x={x} y={y} width="4" height="4" rx="0.5" fill="#111" />
                                        ))
                                    )}
                                </svg>
                            </div>
                            <p className="text-xs text-gray-400 font-bold mt-4 uppercase tracking-wider">Amount: ₦{totalAmount?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <p className="text-xs text-gray-500 font-medium text-center">Open your bank's mobile app → Select <strong>QR Scan</strong> → Point your camera at this code</p>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full bg-[#00B8D9] hover:bg-[#00A3C0] text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                        >
                            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Verifying...</> : "I've completed the scan"}
                        </button>

                        <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                            <Lock className="w-3 h-3" /> Secured by Interswitch
                        </div>
                    </motion.div>
                )}

                {/* ===== USSD ===== */}
                {selectedMethod === 'ussd' && (
                    <motion.div
                        key="ussd"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-5"
                    >
                        <h3 className="text-lg font-black text-gray-900">Pay with USSD</h3>
                        <p className="text-sm text-gray-500 font-medium -mt-3">Select your bank and dial the USSD code</p>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Select Your Bank</label>
                            <select
                                value={selectedBank}
                                onChange={(e) => setSelectedBank(e.target.value)}
                                className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:ring-4 focus:ring-[#00428F]/10 focus:border-[#00428F] outline-none transition-all bg-gray-50/50 text-gray-900 font-medium appearance-none cursor-pointer"
                            >
                                <option value="">Choose a bank...</option>
                                {ussdBanks.map((bank) => (
                                    <option key={bank.name} value={bank.name}>{bank.name}</option>
                                ))}
                            </select>
                        </div>

                        {selectedBank && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6 text-center space-y-3"
                            >
                                <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider">Dial this code on your phone</p>
                                <p className="text-2xl font-mono font-black text-gray-900">
                                    {ussdBanks.find(b => b.name === selectedBank)?.code}{Math.floor(Math.random() * 900 + 100)}*{Math.floor(totalAmount)}#
                                </p>
                                <p className="text-xs text-gray-500 font-medium">Follow the prompts to authorize the payment</p>
                            </motion.div>
                        )}

                        <button
                            onClick={handleSubmit}
                            disabled={loading || !selectedBank}
                            className={`w-full font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${
                                selectedBank 
                                    ? 'bg-[#00B8D9] hover:bg-[#00A3C0] text-white' 
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Verifying...</> : "I've completed the USSD payment"}
                        </button>

                        <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                            <Lock className="w-3 h-3" /> Secured by Interswitch
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
