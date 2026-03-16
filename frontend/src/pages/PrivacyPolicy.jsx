import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Eye, Users, Database, Globe } from 'lucide-react';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#09090b] py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-4xl mx-auto bg-white dark:bg-[#121214] rounded-[3rem] shadow-xl overflow-hidden border border-gray-100 dark:border-[#27272a]">
                {/* Header Section */}
                <div className="bg-forest-500 p-12 text-center text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-forest-400 to-forest-600 opacity-50" />
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative z-10 space-y-4"
                    >
                        <ShieldCheck className="w-16 h-16 mx-auto opacity-80" />
                        <h1 className="text-4xl font-black tracking-tight">Privacy Policy</h1>
                        <p className="text-forest-100 font-medium">Digital Stewardship & Data Protection</p>
                    </motion.div>
                </div>

                {/* Content Section */}
                <div className="p-10 md:p-16 space-y-12">
                    <section className="space-y-4">
                        <p className="text-sm font-black text-forest-600 uppercase tracking-widest">Effective Date: March 14, 2026</p>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-gray-50">Introduction</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                            CeresVera is committed to the digital stewardship of your agricultural and personal data. This policy explains how we collect, use, and protect your information when you use our AI diagnostics, marketplace, and advisory services.
                        </p>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-8 bg-gray-50 dark:bg-[#18181b] rounded-3xl border border-gray-100 dark:border-[#27272a] space-y-4">
                            <div className="w-12 h-12 bg-white dark:bg-[#27272a] rounded-2xl flex items-center justify-center text-forest-500 shadow-sm">
                                <Users className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">Data We Collect</h3>
                            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400 font-medium">
                                <li className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-forest-500 mt-1.5 shrink-0" />
                                    <span><strong>Account information:</strong> Name, email, and social login data (Google/Facebook).</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-forest-500 mt-1.5 shrink-0" />
                                    <span><strong>Profile Data:</strong> Phone numbers, bios, expertise, and certifications (for Experts).</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-forest-500 mt-1.5 shrink-0" />
                                    <span><strong>Farm Data:</strong> Crop types, soil types, and farm locations (Lat/Lon).</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-forest-500 mt-1.5 shrink-0" />
                                    <span><strong>Diagnostic Data:</strong> Images of crops and plants uploaded for AI analysis.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="p-8 bg-forest-50 dark:bg-forest-900/10 rounded-3xl border border-forest-100 dark:border-forest-800/20 space-y-4">
                            <div className="w-12 h-12 bg-white dark:bg-[#27272a] rounded-2xl flex items-center justify-center text-forest-500 shadow-sm">
                                <Database className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">How We Use Your Data</h3>
                            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400 font-medium">
                                <li className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-forest-500 mt-1.5 shrink-0" />
                                    <span><strong>AI Diagnostics:</strong> To identify crop diseases using third-party models (Hugging Face, Gemini).</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-forest-500 mt-1.5 shrink-0" />
                                    <span><strong>Personalized Advice:</strong> To provide localized weather and agronomic advice.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-forest-500 mt-1.5 shrink-0" />
                                    <span><strong>Marketplace Operations:</strong> To facilitate secure payments and escrow services through Interswitch.</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <section className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Lock className="w-8 h-8 text-forest-500" />
                            <h2 className="text-2xl font-black text-gray-900 dark:text-gray-50">Data Sharing & Security</h2>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                            We do not sell your data. Information is only shared with essential third-party service providers (Interswitch for payments, Google Cloud for hosting, and AI inference engines) to fulfill platform functions. We utilize JWT (JSON Web Tokens) to ensure your session and data remain secure.
                        </p>
                    </section>
                </div>

                <div className="bg-gray-50 dark:bg-[#121214] p-8 border-t border-gray-100 dark:border-[#27272a] text-center">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">© 2026 CeresVera Stewardship Project</p>
                </div>
            </div>
        </div>
    );
}
