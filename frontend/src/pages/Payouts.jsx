import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, ArrowUpRight, ArrowDownRight, ShieldCheck, DownloadCloud, Loader2, CheckCircle2, Trash2 } from 'lucide-react';

export default function Payouts() {
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const isPremium = localStorage.getItem('is_premium') === 'true';
    const commission = isPremium ? 5 : 15;
    
    // Initial Mock Ledger Data
    const defaultLedger = [
        { id: 1, title: 'Withdrawal to GTBank', date: 'Oct 02, 2026', amount: 50000, type: 'debit', status: 'Completed', ref: 'INT-7392-WD' },
        { id: 2, title: 'Escrow Released: Ibrahim Musa', date: 'Oct 01, 2026', amount: 5000, type: 'credit', status: 'Completed', ref: 'ESC-443-CR' },
        { id: 3, title: 'Escrow Released: Oluwaseun Farms', date: 'Sep 29, 2026', amount: 7500, type: 'credit', status: 'Completed', ref: 'ESC-442-CR' },
        { id: 4, title: 'Escrow Pending: Chidi Okonkwo', date: 'Oct 15, 2026', amount: 4000, type: 'credit', status: 'Pending', ref: 'ESC-450-PD' },
        { id: 5, title: 'Subscription Fee', date: 'Sep 25, 2026', amount: 2500, type: 'debit', status: 'Completed', ref: 'SUB-101-DB' },
    ];

    // Persist ledger in LocalStorage
    const [ledger, setLedger] = useState(() => {
        const saved = localStorage.getItem('expert_payout_ledger');
        if (saved) return JSON.parse(saved);
        return defaultLedger;
    });

    useEffect(() => {
        localStorage.setItem('expert_payout_ledger', JSON.stringify(ledger));
    }, [ledger]);

    const handleWithdraw = () => {
        setIsWithdrawing(true);
        setTimeout(() => {
            setIsWithdrawing(false);
            
            // Add withdrawal to ledger
            const newWithdrawal = {
                id: Date.now(),
                title: 'Withdrawal to Bank Account',
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                amount: 145000,
                type: 'debit',
                status: 'Completed',
                ref: `INT-${Math.floor(Math.random() * 9000) + 1000}-WD`
            };
            
            setLedger([newWithdrawal, ...ledger]);
            setShowSuccessModal(true);
            setTimeout(() => setShowSuccessModal(false), 3000);
        }, 1500);
    };

    const handleClearHistory = () => {
        const confirmed = window.confirm("Are you sure you want to clear your entire transaction history? This cannot be undone.");
        if (confirmed) {
            setLedger([]);
        }
    };

    const handleExportCSV = () => {
        if (ledger.length === 0) {
            alert("No transactions to export.");
            return;
        }

        // CSV Header
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Date,Transaction Title,Reference,Type,Status,Amount (NGN)\n";

        // Append rows
        ledger.forEach(row => {
            const amountEscaped = row.type === 'debit' ? `-${row.amount}` : `+${row.amount}`;
            // Surround string fields built with commas with quotes
            const rowStr = `"${row.date}","${row.title}","${row.ref}","${row.type}","${row.status}","${amountEscaped}"`;
            csvContent += rowStr + "\n";
        });

        // Create download link
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `CeresVera_Payouts_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Derived Statistics
    const availableBalance = ledger.length > 0 ? 145000 : 0; // Mock derived logic for UI
    const totalEarned = ledger.filter(t => t.type === 'credit' && t.status === 'Completed').reduce((sum, t) => sum + t.amount, 0) + 850000;
    const pendingEscrow = ledger.filter(t => t.status === 'Pending').reduce((sum, t) => sum + t.amount, 0) + 28500;

    return (
        <div className="min-h-screen bg-earth-50 pt-24 pb-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Earnings & Payouts</h1>
                        <p className="text-gray-600 mt-1">Track your Interswitch escrow releases and bank withdrawals.</p>
                    </div>
                    <div className="flex gap-3 text-sm">
                        <button 
                            onClick={handleClearHistory}
                            className="bg-white hover:bg-red-50 text-red-600 border border-red-200 px-4 py-2 font-bold rounded-xl transition-colors shadow-sm flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" /> Clear History
                        </button>
                        <button 
                            onClick={handleExportCSV}
                            className="bg-white hover:bg-gray-50 text-sage-900 border border-sage-200 px-4 py-2 font-bold rounded-xl transition-colors shadow-sm flex items-center gap-2"
                        >
                            <DownloadCloud className="w-4 h-4" /> Export CSV
                        </button>
                    </div>
                </div>

                {/* Premium Notice Alert */}
                <div className={`mb-8 p-4 rounded-2xl border flex items-center gap-4 ${isPremium ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
                    <div className={`p-2 rounded-xl ${isPremium ? 'bg-amber-100' : 'bg-blue-100'}`}>
                        {isPremium ? <ShieldCheck className="w-5 h-5 text-amber-600" /> : <Loader2 className="w-5 h-5 text-blue-600" />}
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-sm">{isPremium ? 'Premium Instant Settlement Active' : 'Standard Payout Speed (3-5 Days)'}</h4>
                        <p className="text-xs opacity-80 font-medium">
                            {isPremium 
                                ? 'Your funds are settled immediately via Interswitch Instant Settlement. Commission reduced to 5%.' 
                                : 'Standard accounts are subject to 3-5 business days clearing time and 15% commission. Upgrade to Premium for 5% fees and instant payout.'}
                        </p>
                    </div>
                    {!isPremium && (
                        <button className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Upgrade
                        </button>
                    )}
                </div>

                {/* Financial Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-sage-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden group">
                        {/* Note: Removed the blur opacity layer over the withdraw button box to fix UI inconsistency */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
                        <h3 className="text-sage-100 font-medium text-sm mb-2 flex items-center gap-2"><DollarSign className="w-4 h-4" /> Available Balance</h3>
                        <div className="text-4xl font-black mb-1 tracking-tight">₦{availableBalance.toLocaleString()}</div>
                        <p className="text-[10px] text-sage-200 font-bold mb-4 flex items-center gap-1 opacity-80 uppercase tracking-widest">
                            After {commission}% platform commission
                        </p>
                        <button
                            onClick={handleWithdraw}
                            disabled={isWithdrawing || availableBalance === 0}
                            className="w-full bg-white text-sage-900 font-bold py-3 rounded-xl transition-transform hover:-translate-y-0.5 active:scale-95 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed relative z-10"
                        >
                            {isWithdrawing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowUpRight className="w-5 h-5" />}
                            {isWithdrawing ? 'Processing...' : 'Withdraw to Bank'}
                        </button>
                    </div>

                    <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute top-4 right-4 text-emerald-100"><ShieldCheck className="w-16 h-16 opacity-50" /></div>
                        <div>
                            <h3 className="text-gray-500 font-medium text-sm mb-2">Locked in Escrow</h3>
                            <div className="text-4xl font-black text-gray-900 mb-2 tracking-tight">₦{pendingEscrow.toLocaleString()}</div>
                        </div>
                        <div className="mt-4">
                            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
                                Pending Completion
                            </span>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm relative flex flex-col justify-between">
                        <div>
                            <h3 className="text-gray-500 font-medium text-sm mb-2">Total Earned (All Time)</h3>
                            <div className="text-4xl font-black text-gray-900 mb-2 tracking-tight">₦{totalEarned.toLocaleString()}</div>
                        </div>
                        <div className="mt-4">
                            <span className="text-xs font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100 flex items-center gap-1 w-max">
                                <ArrowUpRight className="w-3 h-3" /> +14% this month
                            </span>
                        </div>
                    </div>
                </div>

                {/* Ledger & History */}
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <div>
                            <h2 className="text-xl font-black text-gray-900">Transaction Ledger</h2>
                            <p className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-wider">{ledger.length} Records Found</p>
                        </div>
                    </div>

                    <div className="divide-y divide-gray-100">
                        <AnimatePresence>
                            {ledger.length === 0 ? (
                                <motion.div 
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="p-12 text-center"
                                >
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <DollarSign className="w-8 h-8 text-gray-300" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">No Transactions Found</h3>
                                    <p className="text-gray-500 text-sm">Your payout history is currently empty.</p>
                                </motion.div>
                            ) : (
                                ledger.map((tx) => (
                                    <motion.div 
                                        key={tx.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-gray-50/80 transition-colors group"
                                    >
                                        <div className="flex items-center gap-5 w-full sm:w-auto mb-4 sm:mb-0">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border shadow-sm ${
                                                tx.status === 'Pending' 
                                                    ? 'bg-amber-50 text-amber-600 border-amber-100' 
                                                    : tx.type === 'credit' 
                                                        ? 'bg-sage-50 text-sage-600 border-sage-100' 
                                                        : 'bg-white text-gray-600 border-gray-200'
                                            }`}>
                                                {tx.status === 'Pending' ? <ShieldCheck className="w-6 h-6" /> : tx.type === 'credit' ? <ArrowDownRight className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 text-lg group-hover:text-sage-700 transition-colors">{tx.title}</div>
                                                <div className="flex items-center gap-2 text-xs text-gray-500 font-bold mt-1">
                                                    <span>{tx.date}</span>
                                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                    <span className="text-gray-400 uppercase tracking-wider font-medium">Ref: {tx.ref}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex justify-between w-full sm:w-auto items-center sm:text-right gap-8">
                                            <div className="flex items-center gap-3">
                                                <span className={`text-[10px] uppercase tracking-widest font-black px-3 py-1 rounded-full border ${
                                                    tx.status === 'Completed' 
                                                        ? 'bg-green-50 text-green-700 border-green-200' 
                                                        : 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                                                }`}>
                                                    {tx.status}
                                                </span>
                                            </div>
                                            <div className={`text-2xl font-black tracking-tight ${
                                                tx.status === 'Pending' 
                                                    ? 'text-amber-600'
                                                    : tx.type === 'credit' 
                                                        ? 'text-sage-600' 
                                                        : 'text-gray-900'
                                            }`}>
                                                {tx.type === 'credit' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </div>

            </div>

            {/* Success Toast Modal */}
            <AnimatePresence>
                {showSuccessModal && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl border border-gray-800"
                    >
                        <CheckCircle2 className="w-6 h-6 text-green-400" />
                        <div>
                            <h4 className="font-bold text-sm">Withdrawal Initiated!</h4>
                            <p className="text-xs text-gray-400">Funds will arrive in your GTBank account shortly.</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
