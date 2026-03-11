import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, ArrowUpRight, ArrowDownRight, CreditCard, Building, ShieldCheck, DownloadCloud, Loader2, CheckCircle2 } from 'lucide-react';

export default function Payouts() {
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleWithdraw = () => {
        setIsWithdrawing(true);
        setTimeout(() => {
            setIsWithdrawing(false);
            setShowSuccessModal(true);
            setTimeout(() => setShowSuccessModal(false), 3000);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-earth-50 pt-24 pb-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Earnings & Payouts</h1>
                        <p className="text-gray-600 mt-1">Track your Interswitch escrow releases and bank withdrawals.</p>
                    </div>
                </div>

                {/* Financial Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-sage-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-sage-500 rounded-full blur-[60px] opacity-30 group-hover:opacity-50 transition-opacity"></div>
                        <h3 className="text-sage-100 font-medium text-sm mb-2 flex items-center gap-2"><DollarSign className="w-4 h-4" /> Available Balance</h3>
                        <div className="text-4xl font-black mb-4 tracking-tight">₦145,000</div>
                        <button
                            onClick={handleWithdraw}
                            disabled={isWithdrawing}
                            className="w-full bg-white text-sage-900 font-bold py-3 rounded-xl transition-transform hover:-translate-y-0.5 active:scale-95 shadow-lg flex items-center justify-center gap-2 disabled:opacity-80 disabled:hover:translate-y-0"
                        >
                            {isWithdrawing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowUpRight className="w-5 h-5" />}
                            {isWithdrawing ? 'Processing...' : 'Withdraw to Bank'}
                        </button>
                    </div>

                    <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm relative overflow-hidden">
                        <div className="absolute top-4 right-4 text-emerald-100"><ShieldCheck className="w-16 h-16" /></div>
                        <h3 className="text-gray-500 font-medium text-sm mb-2">Locked in Escrow</h3>
                        <div className="text-4xl font-black text-gray-900 mb-2 tracking-tight">₦32,500</div>
                        <div className="text-sm font-bold text-amber-600 bg-amber-50 inline-block px-2 py-0.5 rounded-md">Pending completion of 5 calls</div>
                    </div>

                    <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm relative">
                        <h3 className="text-gray-500 font-medium text-sm mb-2">Total Earned (All Time)</h3>
                        <div className="text-4xl font-black text-gray-900 mb-2 tracking-tight">₦850,000</div>
                        <div className="text-sm font-medium text-green-600 flex items-center gap-1"><ArrowUpRight className="w-4 h-4" /> +14% this month</div>
                    </div>
                </div>

                {/* Ledger & History */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <h2 className="text-lg font-bold text-gray-900">Transaction Ledger</h2>
                        <button className="text-sm font-bold text-sage-700 flex items-center gap-2 hover:bg-sage-50 px-3 py-1.5 rounded-lg transition-colors">
                            <DownloadCloud className="w-4 h-4" /> Export CSV
                        </button>
                    </div>

                    <div className="divide-y divide-gray-50">
                        {[
                            { title: 'Withdrawal to GTBank', date: 'Oct 02, 2026', amount: '-₦50,000', type: 'debit', status: 'Completed', ref: 'INT-7392-WD' },
                            { title: 'Escrow Released: Ibrahim Musa', date: 'Oct 01, 2026', amount: '+₦5,000', type: 'credit', status: 'Completed', ref: 'ESC-443-CR' },
                            { title: 'Escrow Released: Oluwaseun Farms', date: 'Sep 29, 2026', amount: '+₦7,500', type: 'credit', status: 'Completed', ref: 'ESC-442-CR' },
                            { title: 'Escrow Released: Chidi Okonkwo', date: 'Sep 28, 2026', amount: '+₦4,000', type: 'credit', status: 'Completed', ref: 'ESC-441-CR' },
                            { title: 'Subscription Fee', date: 'Sep 25, 2026', amount: '-₦2,500', type: 'debit', status: 'Completed', ref: 'SUB-101-DB' },
                        ].map((tx, i) => (
                            <div key={i} className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between hover:bg-gray-50/50 transition-colors">
                                <div className="flex items-center gap-4 w-full sm:w-auto mb-4 sm:mb-0">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${tx.type === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                        {tx.type === 'credit' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900">{tx.title}</div>
                                        <div className="text-xs text-gray-500 font-medium">{tx.date} • Ref: {tx.ref}</div>
                                    </div>
                                </div>
                                <div className="flex justify-between w-full sm:w-auto items-center sm:text-right gap-6">
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600`}>{tx.status}</span>
                                    <div className={`text-lg font-black tracking-tight ${tx.type === 'credit' ? 'text-emerald-600' : 'text-gray-900'}`}>
                                        {tx.amount}
                                    </div>
                                </div>
                            </div>
                        ))}
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
