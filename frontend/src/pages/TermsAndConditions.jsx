import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Gavel, Scale, AlertTriangle, CreditCard, ShieldCheck } from 'lucide-react';

export default function TermsAndConditions() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#09090b] py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-4xl mx-auto bg-white dark:bg-[#121214] rounded-[3rem] shadow-xl overflow-hidden border border-gray-100 dark:border-[#27272a]">
                {/* Header Section */}
                <div className="bg-harvest-500 p-12 text-center text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-harvest-400 to-harvest-600 opacity-50" />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative z-10 space-y-4"
                    >
                        <Gavel className="w-16 h-16 mx-auto opacity-80" />
                        <h1 className="text-4xl font-black tracking-tight">Terms & Conditions</h1>
                        <p className="text-harvest-100 font-medium">Agreement & Platform Stewardship</p>
                    </motion.div>
                </div>

                {/* Content Section */}
                <div className="p-10 md:p-16 space-y-12">
                    <section className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Scale className="w-8 h-8 text-harvest-600" />
                            <h2 className="text-2xl font-black text-gray-900 dark:text-gray-50">1. Acceptance of Terms</h2>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                            By creating an account on CeresVera, you agree to act as a faithful steward of the platform. Users must provide accurate information, particularly regarding agricultural certifications and "Gold Veritas" status.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-4">
                            <ShieldCheck className="w-8 h-8 text-harvest-600" />
                            <h2 className="text-2xl font-black text-gray-900 dark:text-gray-50">2. User Roles & Conduct</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 bg-gray-50 dark:bg-[#18181b] rounded-2xl border border-gray-100 dark:border-[#27272a]">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50 mb-2">Farmers</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Responsible for providing accurate soil and crop data for diagnostics.</p>
                            </div>
                            <div className="p-6 bg-harvest-50 dark:bg-harvest-900/10 rounded-2xl border border-harvest-100 dark:border-harvest-800/20">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50 mb-2">Experts</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Must maintain valid certifications. Providing false information leads to immediate loss of the Gold Veritas badge.</p>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-4">
                            <CreditCard className="w-8 h-8 text-harvest-600" />
                            <h2 className="text-2xl font-black text-gray-900 dark:text-gray-50">3. Payments & Escrow</h2>
                        </div>
                        <div className="space-y-4 bg-gray-50 dark:bg-[#18181b] p-8 rounded-3xl border border-gray-100 dark:border-[#27272a]">
                            <p className="text-gray-700 dark:text-gray-300 font-bold">CeresVera uses a Secure Escrow Model.</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                                Payments made for expert consultations are held in a virtual vault until the farmer confirms a successful session.
                            </p>
                            <div className="pt-4 border-t border-gray-200 dark:border-[#27272a] grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase">Standard Experts</span>
                                    <p className="text-lg font-black text-gray-900 dark:text-gray-50">15% Fee</p>
                                </div>
                                <div>
                                    <span className="text-[10px] font-black text-harvest-600 uppercase">Gold Veritas</span>
                                    <p className="text-lg font-black text-harvest-600">5% Fee</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-4">
                            <AlertTriangle className="w-8 h-8 text-harvest-600" />
                            <h2 className="text-2xl font-black text-gray-900 dark:text-gray-50">4. AI Disclaimer</h2>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium p-6 bg-rose-50 dark:bg-rose-900/10 rounded-2xl border border-rose-100 dark:border-rose-800/20">
                            AI-generated advice (CeraAI) is intended for informational purposes and stewardship guidance. While we strive for "The Truth," users should verify critical agricultural decisions with a human Expert.
                        </p>
                    </section>
                </div>

                <div className="bg-gray-50 dark:bg-[#18181b] p-8 border-t border-gray-100 dark:border-[#27272a] text-center">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">© 2026 CeresVera Terms of Stewardship</p>
                </div>
            </div>
        </div>
    );
}
