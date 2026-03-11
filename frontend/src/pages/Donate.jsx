import { motion } from 'framer-motion';

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

    return (
        <div className="bg-[#FAF9F6] min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-5xl mx-auto">

                {/* Header Row */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16 pb-8 border-b border-gray-300 gap-6">
                    <div>
                        <h1 className="text-4xl sm:text-6xl font-black text-[#0F172A] tracking-tight mb-2">
                            Support the Vision
                        </h1>
                        <p className="text-xl text-sage-700 font-bold uppercase tracking-widest">
                            From Prototype to Providence
                        </p>
                    </div>
                    <button className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-[#0F172A] font-bold py-4 px-8 rounded-full transition-all shadow-lg hover:shadow-xl flex items-center gap-3">
                        Donate via
                        <img src="/interswitch.png" alt="Interswitch" className="h-4 object-contain brightness-0" />
                    </button>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-12 gap-16">

                    {/* Left Column - Narrative */}
                    <div className="lg:col-span-7 space-y-12">
                        <section>
                            <h2 className="text-3xl font-bold text-[#0F172A] mb-6">Join Our Journey</h2>
                            <p className="text-lg text-gray-800 font-medium leading-relaxed mb-6">
                                CeresVera began as a vision shared by five students during the Interswitch Pan-African Discovery Series. We saw a modern world where technology often moves faster than our ability to care for the earth, and where the "Truth of the Harvest" is often lost in noise and complexity.
                            </p>
                            <p className="text-lg text-gray-800 font-medium leading-relaxed">
                                As a group of five developers, designers, and strategists, we didn't just want to build another app—we wanted to build a movement of digital stewardship.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-3xl font-bold text-[#0F172A] mb-6">Why Your Support Matters</h2>
                            <p className="text-lg text-gray-800 font-medium leading-relaxed mb-8">
                                While CeresVera is currently a hackathon project, our aspirations are far larger. We are building a platform that provides farmers with immediate, AI-driven truth about their crops while creating <strong className="text-sage-800">a sustainable livelihood for agricultural experts</strong> through the Interswitch-powered marketplace.
                            </p>

                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                                <p className="text-base text-gray-900 font-bold mb-4">Your contribution helps us transition from a functional prototype to a real-world solution that can:</p>

                                <div className="flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-1">
                                        <div className="w-3 h-3 bg-amber-500 rounded-full" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg">Refine our AI Models</h3>
                                        <p className="text-gray-600 mt-1">Ensuring our "Truth Engine" is accurate across more crop varieties and local climates.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center shrink-0 mt-1">
                                        <div className="w-3 h-3 bg-sage-500 rounded-full" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg">Empower Experts</h3>
                                        <p className="text-gray-600 mt-1">Helping us vet and onboard certified agronomists to provide high-quality human support.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-1">
                                        <div className="w-3 h-3 bg-blue-500 rounded-full" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg">Scale for Impact</h3>
                                        <p className="text-gray-600 mt-1">Moving our infrastructure to production-grade servers to support smallholder farmers across the continent.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-3xl font-bold text-[#0F172A] mb-6">Our Commitment to Stewardship</h2>
                            <p className="text-lg text-gray-800 font-medium leading-relaxed">
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
                                <h3 className="text-xl font-bold text-gray-900 mb-4 px-2">Ways to Support</h3>
                                <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">

                                    <motion.div variants={item} className="group bg-white border border-gray-200 p-6 rounded-2xl hover:border-amber-400 hover:shadow-md transition-all cursor-pointer relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-100 to-transparent opacity-50 group-hover:opacity-100 transition-opacity rounded-bl-full pointer-events-none" />
                                        <h4 className="text-xl font-black text-[#0F172A] mb-2 group-hover:text-amber-600 transition-colors">The Seed Gift</h4>
                                        <p className="text-gray-600 text-sm leading-relaxed">Helps cover critical server and infrastructure costs for our OpenWeather integrations and local AI model hosting.</p>
                                    </motion.div>

                                    <motion.div variants={item} className="group bg-white border border-gray-200 p-6 rounded-2xl hover:border-sage-400 hover:shadow-md transition-all cursor-pointer relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-sage-100 to-transparent opacity-50 group-hover:opacity-100 transition-opacity rounded-bl-full pointer-events-none" />
                                        <h4 className="text-xl font-black text-[#0F172A] mb-2 group-hover:text-sage-600 transition-colors">The Growth Gift</h4>
                                        <p className="text-gray-600 text-sm leading-relaxed">Supports the physical server infrastructure needed to run our extensive PlantVillage computer vision models.</p>
                                    </motion.div>

                                    <motion.div variants={item} className="group bg-[#0F172A] text-white p-6 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                        <h4 className="text-xl font-black text-amber-400 mb-2">The Harvest Gift</h4>
                                        <p className="text-gray-300 text-sm leading-relaxed mb-4">Funds the direct expansion of our Expert Marketplace, connecting vulnerable smallholder farmers to paid, native professional advice.</p>
                                        <div className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-amber-500 group-hover:text-amber-400">
                                            Select Tier <span className="ml-2">→</span>
                                        </div>
                                    </motion.div>

                                </motion.div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
