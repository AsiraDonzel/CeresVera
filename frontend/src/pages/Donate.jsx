import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, CreditCard, CheckCircle, X, Lock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Donate() {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [donationAmount, setDonationAmount] = useState(10000);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handlePaymentMock = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
        }, 3000);
    };

    return (
        <div className="bg-[#FAF9F6] dark:bg-[#09090b] min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-5xl mx-auto">

                {/* Header Row */}
                <div className="mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-sage-700 dark:hover:text-sage-400 font-bold transition-all group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16 pb-8 border-b border-gray-300 dark:border-[#27272a] gap-6">
                    <div>
                        <h1 className="text-4xl sm:text-6xl font-black text-[#0F172A] dark:text-gray-50 tracking-tight mb-2">
                            Support the Vision
                        </h1>
                        <p className="text-xl text-sage-700 dark:text-sage-400 font-bold uppercase tracking-widest">
                            From Prototype to Providence
                        </p>
                    </div>
                    <button onClick={() => { setDonationAmount(50000); setIsModalOpen(true); }} className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-[#0F172A] font-bold py-4 px-8 rounded-full transition-all shadow-lg hover:shadow-xl flex items-center gap-3">
                        Donate via
                        <img src="/interswitch.png" alt="Interswitch" className="h-4 object-contain brightness-0" />
                    </button>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-12 gap-16">

                    {/* Left Column - Narrative */}
                    <div className="lg:col-span-7 space-y-12">
                        <section>
                            <h2 className="text-3xl font-bold text-[#0F172A] dark:text-gray-50 mb-6">Join Our Journey</h2>
                            <p className="text-lg text-gray-800 dark:text-gray-300 font-medium leading-relaxed mb-6">
                                CeresVera began as a vision shared by five students during the Interswitch Pan-African Discovery Series. We saw a modern world where technology often moves faster than our ability to care for the earth, and where the "Truth of the Harvest" is often lost in noise and complexity.
                            </p>
                            <p className="text-lg text-gray-800 dark:text-gray-300 font-medium leading-relaxed">
                                As a group of five developers, designers, and strategists, we didn't just want to build another app—we wanted to build a movement of digital stewardship.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-3xl font-bold text-[#0F172A] dark:text-gray-50 mb-6">Why Your Support Matters</h2>
                            <p className="text-lg text-gray-800 dark:text-gray-300 font-medium leading-relaxed mb-8">
                                While CeresVera is currently a hackathon project, our aspirations are far larger. We are building a platform that provides farmers with immediate, AI-driven truth about their crops while creating <strong className="text-sage-800 dark:text-sage-400">a sustainable livelihood for agricultural experts</strong> through the Interswitch-powered marketplace.
                            </p>

                            <div className="bg-white dark:bg-[#121214] p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-[#27272a] space-y-6">
                                <p className="text-base text-gray-900 dark:text-gray-50 font-bold mb-4">Your contribution helps us transition from a functional prototype to a real-world solution that can:</p>

                                <div className="flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0 mt-1">
                                        <div className="w-3 h-3 bg-amber-500 rounded-full" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-gray-50 text-lg">Refine our AI Models</h3>
                                        <p className="text-gray-600 dark:text-gray-400 mt-1">Ensuring our "Truth Engine" is accurate across more crop varieties and local climates.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded-full bg-sage-100 dark:bg-sage-900/30 flex items-center justify-center shrink-0 mt-1">
                                        <div className="w-3 h-3 bg-sage-500 rounded-full" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-gray-50 text-lg">Empower Experts</h3>
                                        <p className="text-gray-600 dark:text-gray-400 mt-1">Helping us vet and onboard certified agronomists to provide high-quality human support.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 mt-1">
                                        <div className="w-3 h-3 bg-blue-500 rounded-full" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-gray-50 text-lg">Scale for Impact</h3>
                                        <p className="text-gray-600 dark:text-gray-400 mt-1">Moving our infrastructure to production-grade servers to support smallholder farmers across the continent.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-3xl font-bold text-[#0F172A] dark:text-gray-50 mb-6">Our Commitment to Stewardship</h2>
                            <p className="text-lg text-gray-800 dark:text-gray-300 font-medium leading-relaxed">
                                Following the principles of being "Good Stewards" of the resources we are given, every donation is handled with transparency. We aren't just building code; we are building a more food-secure and honest future.
                            </p>
                        </section>
                    </div>

                    {/* Right Column - Donation Tiers & Verse */}
                    <div className="lg:col-span-5 space-y-8 relative">
                        {/* Sticky Container for desktop */}
                        <div className="lg:sticky lg:top-24 space-y-8">

                            {/* Callout Quote Box */}
                            <div className="bg-gradient-to-br from-earth-900 to-sage-900 p-8 rounded-3xl shadow-xl relative overflow-hidden text-white">
                                <svg className="absolute -right-4 -top-4 w-40 h-40 text-white/5 transform rotate-12 pointer-events-none" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.714 4.026-6.59 4.524-6.658l.582-.081V3h-3.41c-3.144 0-4.992 1.956-4.992 4.604v2.005H7V13.31h3.72V21h3.297z" /></svg>

                                <p className="italic text-lg relative z-10 leading-relaxed font-medium mb-6">
                                    "He who supplies seed to the sower and bread for food will also supply and increase your store of seed and will enlarge the harvest of your righteousness."
                                </p>
                                <p className="text-sm font-bold text-amber-400 uppercase tracking-widest relative z-10">— 2 Corinthians 9:10</p>
                            </div>

                            {/* Donation Tiers */}
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-4 px-2">Ways to Support</h3>
                                <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">

                                    <motion.div onClick={() => { setDonationAmount(5000); setIsModalOpen(true); }} variants={item} className="group bg-white dark:bg-[#18181b] border border-gray-200 dark:border-[#27272a] p-6 rounded-2xl hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-md transition-all cursor-pointer relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-100 dark:from-amber-900/30 to-transparent opacity-50 group-hover:opacity-100 transition-opacity rounded-bl-full pointer-events-none" />
                                        <h4 className="text-xl font-black text-[#0F172A] dark:text-gray-50 mb-2 group-hover:text-amber-600 transition-colors">The Seed Gift</h4>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">Helps cover critical server and infrastructure costs for our OpenWeather integrations and local AI model hosting.</p>
                                        <div className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-amber-500 group-hover:text-amber-600">
                                            Donate ₦5,000 <span className="ml-2">→</span>
                                        </div>
                                    </motion.div>

                                    <motion.div onClick={() => { setDonationAmount(15000); setIsModalOpen(true); }} variants={item} className="group bg-white dark:bg-[#18181b] border border-gray-200 dark:border-[#27272a] p-6 rounded-2xl hover:border-sage-400 dark:hover:border-sage-600 hover:shadow-md transition-all cursor-pointer relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-sage-100 dark:from-sage-900/30 to-transparent opacity-50 group-hover:opacity-100 transition-opacity rounded-bl-full pointer-events-none" />
                                        <h4 className="text-xl font-black text-[#0F172A] dark:text-gray-50 mb-2 group-hover:text-sage-600 transition-colors">The Growth Gift</h4>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">Supports the physical server infrastructure needed to run our extensive PlantVillage computer vision models.</p>
                                        <div className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-sage-600 group-hover:text-sage-700">
                                            Donate ₦15,000 <span className="ml-2">→</span>
                                        </div>
                                    </motion.div>

                                    <motion.div onClick={() => { setDonationAmount(50000); setIsModalOpen(true); }} variants={item} className="group bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] p-6 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                        <h4 className="text-xl font-black text-amber-400 dark:text-amber-600 mb-2">The Harvest Gift</h4>
                                        <p className="text-gray-300 dark:text-gray-600 text-sm leading-relaxed mb-4">Funds the direct expansion of our Expert Marketplace, connecting vulnerable smallholder farmers to paid, native professional advice.</p>
                                        <div className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-amber-500 dark:text-amber-600 group-hover:text-amber-400 dark:group-hover:text-amber-700">
                                            Donate Custom Amount <span className="ml-2">→</span>
                                        </div>
                                    </motion.div>

                                </motion.div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Premium Interswitch Payment Overlay */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white dark:bg-[#121214] w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-2xl relative border border-white dark:border-[#27272a]"
                        >
                            {!success ? (
                                <>
                                    {/* Modal Header */}
                                    <div className="px-8 py-6 border-b border-gray-100 dark:border-[#27272a] flex justify-between items-center bg-gradient-to-r from-gray-50 dark:from-[#18181b] to-white dark:to-[#121214]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner">
                                                <ShieldCheck className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-50 leading-tight">Secure Donation</h2>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Powered by Interswitch</p>
                                            </div>
                                        </div>
                                        <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#27272a] hover:bg-gray-200 dark:hover:bg-[#3f3f46] text-gray-500 dark:text-gray-400 flex items-center justify-center transition-colors">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Modal Body */}
                                    <div className="p-8">
                                        <div className="mb-6">
                                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Donation Amount (NGN)</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-bold text-lg">₦</span>
                                                <input 
                                                    type="number" 
                                                    value={donationAmount} 
                                                    onChange={(e) => setDonationAmount(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-4 rounded-xl border border-gray-300 dark:border-[#27272a] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow bg-gray-50 dark:bg-[#18181b] text-xl font-bold text-gray-900 dark:text-gray-50" 
                                                />
                                            </div>
                                        </div>

                                        <form onSubmit={handlePaymentMock} className="space-y-5">
                                            {/* Realistic Card Input Fields */}
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Cardholder Name</label>
                                                <input required type="text" placeholder="e.g. JOHN DOE" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-[#27272a] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow bg-gray-50 dark:bg-[#18181b] text-gray-900 dark:text-gray-50" />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Card Number</label>
                                                <div className="relative">
                                                    <input required type="text" maxLength="19" placeholder="0000 0000 0000 0000" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-[#27272a] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow bg-gray-50 dark:bg-[#18181b] font-mono text-lg text-gray-900 dark:text-gray-50" />
                                                    <CreditCard className="w-6 h-6 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Expiry Date</label>
                                                    <input required type="text" maxLength="5" placeholder="MM/YY" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-[#27272a] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow bg-gray-50 dark:bg-[#18181b] font-mono text-gray-900 dark:text-gray-50" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">CVV</label>
                                                    <input required type="password" maxLength="3" placeholder="•••" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-[#27272a] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow bg-gray-50 dark:bg-[#18181b] font-mono text-center tracking-[0.3em] text-gray-900 dark:text-gray-50" />
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
                                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <span className="font-medium">Donate ₦{Number(donationAmount).toLocaleString()} using</span>
                                                            <img src="/interswitch.png" alt="Interswitch" className="h-5 object-contain brightness-0 invert" />
                                                        </>
                                                    )}
                                                </button>
                                                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400 font-medium">
                                                    <Lock className="w-3 h-3" /> End-to-end encrypted by Interswitch
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </>
                            ) : (
                                /* Success State */
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                    className="p-12 text-center flex flex-col items-center"
                                >
                                    <div className="w-24 h-24 bg-sage-100 rounded-full flex items-center justify-center mb-6">
                                        <CheckCircle className="w-12 h-12 text-sage-600" />
                                    </div>
                                    <h3 className="text-3xl font-black text-gray-900 dark:text-gray-50 mb-2">Thank You!</h3>
                                    <p className="text-gray-500 dark:text-gray-400 font-medium mb-8 text-lg">Your generous donation of ₦{Number(donationAmount).toLocaleString()} has been received.</p>
                                    <button
                                        onClick={() => { setSuccess(false); setIsModalOpen(false); }}
                                        className="bg-sage-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-sage-700 transition-colors shadow-md"
                                    >
                                        Close Window
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
