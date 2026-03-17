import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const teamMembers = [
    { name: "Asira Donzel", role: "Team Leader/Backend Engineer", img: "/Asira.jpg" },
    { name: "Okoye McPaul", role: "Frontend Engineer", img: "/MC.jpg" },
    { name: "Frances Ugwu", role: "AI/ML Specialist", img: "/Frances.jpg" },
    { name: "Odunayo Aluko", role: "Project Designer", img: "/Odun.jpg" },
    { name: "Nisan Awa", role: "Business Lead", img: "/Nisan.jpg" },
    { name: "Nduoma Iraounsi", role: "Honorary Member", img: "/Nduoma.jpg" }
];

export default function About() {
    const [activeTab, setActiveTab] = useState('about');

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
        <div className="bg-[#FAF9F6] dark:bg-[#09090b] min-h-screen font-sans">

            {/* Hero Image Section with Desaturated Field and Gold Overlay */}
            <div className="relative h-[40vh] w-full overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-[#b89547]/40 z-10 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F6] to-transparent z-20" />
                <img
                    src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop"
                    alt="Lush agricultural field"
                    className="absolute inset-0 w-full h-full object-cover filter grayscale-[50%] contrast-[1.1]"
                />
                <Link to="/" className="absolute top-8 left-8 z-30 flex items-center gap-2 text-white/80 hover:text-white font-bold transition-all group">
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>
                <h1 className="relative z-30 text-5xl md:text-7xl font-bold text-white tracking-tight drop-shadow-lg text-center px-4">
                    About CeresVera
                </h1>
            </div>

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 py-16 px-4 sm:px-6 lg:px-8 relative z-30 -mt-16">

                {/* Left Sidebar Navigation */}
                <div className="lg:w-1/4 shrink-0 space-y-3 pt-4">
                    <button
                        onClick={() => setActiveTab('about')}
                        className={`w-full text-left px-5 py-3 rounded-lg text-sm font-bold transition-all shadow-sm ${activeTab === 'about' ? 'bg-white dark:bg-[#18181b] border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-400' : 'bg-transparent border border-transparent text-gray-700 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-[#18181b]/50 hover:text-amber-700 dark:hover:text-amber-400'
                            }`}
                    >
                        About Us
                    </button>
                    <button
                        onClick={() => setActiveTab('team')}
                        className={`w-full text-left px-5 py-3 rounded-lg text-sm font-bold transition-all shadow-sm ${activeTab === 'team' ? 'bg-white dark:bg-[#18181b] border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-400' : 'bg-transparent border border-transparent text-gray-700 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-[#18181b]/50 hover:text-amber-700 dark:hover:text-amber-400'
                            }`}
                    >
                        Team Members
                    </button>
                    <button
                        onClick={() => setActiveTab('partners')}
                        className={`w-full text-left px-5 py-3 rounded-lg text-sm font-bold transition-all shadow-sm ${activeTab === 'partners' ? 'bg-white dark:bg-[#18181b] border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-400' : 'bg-transparent border border-transparent text-gray-700 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-[#18181b]/50 hover:text-amber-700 dark:hover:text-amber-400'
                            }`}
                    >
                        Partners
                    </button>
                </div>

                {/* Right Content Area */}
                <div className="lg:w-3/4 bg-white/60 dark:bg-[#121214]/60 backdrop-blur-md rounded-2xl p-8 sm:p-12 shadow-sm border border-sage-100 dark:border-[#27272a]">
                    <AnimatePresence mode="wait">

                        {/* TAB: ABOUT US */}
                        {activeTab === 'about' && (
                            <motion.div
                                key="about"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-12"
                            >
                                <div>
                                    <h2 className="text-3xl font-black text-[#0F172A] dark:text-gray-50 mb-6">The Truth of the Harvest.</h2>
                                    <p className="text-lg text-gray-800 dark:text-gray-300 font-medium leading-relaxed mb-6">
                                        In a modern world characterized by rapid acceleration and superficial solutions, the essential connection between the earth and those who tend it has become clouded. We live in an era of information overload, yet farmers often struggle to find the simple, biological truth about the health of their crops.
                                    </p>
                                    <p className="text-lg text-gray-800 dark:text-gray-300 font-medium leading-relaxed mb-6">
                                        CeresVera was born from a vision to restore clarity to agriculture. Our name combines "Ceres", the ancient symbol of the harvest's abundance, with "Vera" —the Latin word for Truth.
                                    </p>
                                    <p className="text-lg text-gray-800 dark:text-gray-300 font-medium leading-relaxed">
                                        We believe that true stewardship requires both cutting-edge intelligence and human wisdom. While the modern world often looks down on those who follow a principled, traditional path, we believe that integrating the timeless values of the Bible with the most advanced technology is the only way to secure our future.
                                    </p>
                                </div>

                                {/* Callout Quote Box */}
                                <div className="bg-gradient-to-r from-amber-50 dark:from-amber-900/20 to-sage-50 dark:to-sage-900/20 border-l-4 border-amber-500 p-8 rounded-r-2xl shadow-inner relative overflow-hidden">
                                    <svg className="absolute -right-4 -top-4 w-32 h-32 text-amber-200/50 dark:text-amber-900/30 transform rotate-12" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.714 4.026-6.59 4.524-6.658l.582-.081V3h-3.41c-3.144 0-4.992 1.956-4.992 4.604v2.005H7V13.31h3.72V21h3.297z" /></svg>
                                    <h3 className="text-xl font-bold text-sage-900 dark:text-sage-400 mb-3 relative z-10">The "Outlier" Stewardship</h3>
                                    <p className="italic text-gray-700 dark:text-gray-300 text-lg relative z-10 mb-4">
                                        "The Lord God took the man and put him in the Garden of Eden to work it and take care of it."
                                    </p>
                                    <p className="text-sm font-bold text-amber-700 dark:text-amber-500 uppercase tracking-wider relative z-10">— Genesis 2:15</p>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold text-[#0F172A] dark:text-gray-50 mb-4">What We Do</h3>
                                    <p className="text-lg text-gray-800 dark:text-gray-300 leading-relaxed mb-8">
                                        CeresVera is a premium agri-tech marketplace that empowers farmers to see what is hidden. Using a sophisticated local AI computer vision engine trained on the world-renowned PlantVillage dataset, we provide instant, accurate diagnostics for crop diseases and nutrient deficiencies.
                                    </p>

                                    <div className="flex flex-col sm:flex-row gap-8 items-start">
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-bold text-[#0F172A] dark:text-gray-50 mb-4">Why We Are Different</h3>
                                            <p className="text-lg text-gray-800 dark:text-gray-300 leading-relaxed mb-6">
                                                We don't just provide a diagnosis; we provide a community. Through our integration with the Interswitch Payment Gateway, we have created a sustainable gig economy for certified agronomists. When a farmer seeks deeper guidance, they are instantly connected to a human expert who provides professional accountability and personalized care.
                                            </p>
                                        </div>
                                        {/* Interswitch Badge */}
                                        <div className="sm:w-64 shrink-0 bg-white dark:bg-[#18181b] p-6 rounded-xl border border-gray-100 dark:border-[#27272a] shadow-md flex flex-col items-center justify-center space-y-3">
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Escrow Security</span>
                                            <img src="/interswitch.png" alt="Powered by Interswitch" className="h-8 object-contain opacity-90 grayscale hover:grayscale-0 transition-all duration-300" />
                                            <span className="text-[10px] text-gray-500 text-center leading-tight">Instant Escrow Release & Expert Payouts</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold text-[#0F172A] dark:text-gray-50 mb-4">Our Mission</h3>
                                    <p className="text-lg text-gray-800 dark:text-gray-300 leading-relaxed">
                                        To bridge the gap between technology and providence. We are here to help the "Outliers"—the farmers and stewards who seek a higher way of working. By providing the tools to identify the truth of the harvest, we ensure that abundance is not just a hope, but a reality.
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* TAB: TEAM MEMBERS */}
                        {activeTab === 'team' && (
                            <motion.div
                                key="team"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h2 className="text-3xl font-black text-[#0F172A] dark:text-gray-50 mb-4">Team Members</h2>
                                <p className="text-lg text-gray-700 dark:text-gray-300 mb-10 leading-relaxed">
                                    Our Team is made up of people who come from different departments and have different skills—all sharing the same philosophy that the knowledge required to grow food should be available to every farmer in the world.
                                </p>
                                <motion.div
                                    variants={container}
                                    initial="hidden"
                                    animate="show"
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
                                >
                                    {teamMembers.map((member, idx) => (
                                        <motion.div key={idx} variants={item} className="group">
                                            <div className="aspect-[4/5] bg-gray-200 dark:bg-gray-800 overflow-hidden mb-4 relative rounded-xl shadow-sm">
                                                <div className="absolute inset-0 bg-gray-900/10 group-hover:bg-transparent transition-colors z-10" />
                                                <img
                                                    src={member.img}
                                                    alt={member.name}
                                                    className="w-full h-full object-cover filter saturate-[0.85] group-hover:saturate-100 group-hover:scale-105 transition-all duration-500 ease-out"
                                                />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50 group-hover:text-amber-600 transition-colors">{member.name}</h3>
                                            <p className="text-sm font-medium text-sage-600 dark:text-sage-400 mt-1 uppercase tracking-wide">{member.role}</p>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </motion.div>
                        )}

                        {/* TAB: PARTNERS */}
                        {activeTab === 'partners' && (
                            <motion.div
                                key="partners"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="w-full"
                            >
                                <div className="text-center mb-16">
                                    <h2 className="text-4xl font-black text-[#0F172A] dark:text-gray-50 tracking-tight mb-4">CeresVera: Our Partnership Ecosystem</h2>
                                    <p className="text-xl text-sage-700 dark:text-sage-400 font-bold uppercase tracking-widest">Built on Trust. Growing through Collaboration.</p>
                                </div>

                                <div className="max-w-4xl mx-auto space-y-16">
                                    {/* Foundational Partner: Interswitch */}
                                    <div className="bg-white dark:bg-[#18181b] rounded-[2.5rem] shadow-xl p-8 md:p-12 border border-gray-100 dark:border-[#27272a] flex flex-col items-center text-center">
                                        <div className="mb-6">
                                            <span className="bg-sage-100 dark:bg-sage-900/30 text-sage-800 dark:text-sage-400 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4 inline-block">Foundational Partner</span>
                                            <img src="/interswitch.png" alt="Interswitch Group" className="h-12 object-contain mx-auto mt-2" />
                                        </div>
                                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                                            As our primary strategic partner, Interswitch provides the financial "heart" of CeresVera. By integrating Interswitch's secure payment APIs, we've built a marketplace where farmers can trust that their transactions are safe, and experts can rely on a seamless payment experience. Their commitment to African innovation is the bedrock upon which CeresVera is built.
                                        </p>
                                    </div>

                                    {/* Introduction to the Movement */}
                                    <div className="text-center">
                                        <p className="text-xl text-gray-800 dark:text-gray-300 leading-relaxed mb-6 font-medium">
                                            At CeresVera, we believe that restoring the "Truth of the Harvest" requires a united front. We are actively seeking visionary partners to join us in scaling this mission across the continent.
                                        </p>
                                        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-12">
                                            We are a dedicated team of five innovators on a mission to bridge the gap between AI technology and agricultural stewardship. We are currently seeking partners in the following areas:
                                        </p>
                                    </div>

                                    {/* Partner Categories Grid */}
                                    <div className="grid md:grid-cols-2 gap-8 mb-16">

                                        {/* Box 1 */}
                                        <div className="bg-gray-50/50 dark:bg-[#18181b]/50 p-8 rounded-3xl border border-gray-200 dark:border-[#27272a]">
                                            <div className="w-12 h-12 bg-sage-100 text-sage-600 rounded-xl flex items-center justify-center mb-6">
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-3">Agricultural Institutions & NGOs</h3>
                                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                                Are you working with smallholder farmers? We are looking for partners to help us field-test our AI "Truth Engine" and ensure our diagnostics meet the specific needs of local soil and crop varieties.
                                            </p>
                                        </div>

                                        {/* Box 2 */}
                                        <div className="bg-gray-50/50 dark:bg-[#18181b]/50 p-8 rounded-3xl border border-gray-200 dark:border-[#27272a]">
                                            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-3">Certified Agronomists & Experts</h3>
                                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                                We are building a premium gig economy for agricultural wisdom. If you are a certified professional looking to reach a wider audience and provide accountable, paid advice, we want to hear from you.
                                            </p>
                                        </div>

                                        {/* Box 3 */}
                                        <div className="bg-gray-50/50 dark:bg-[#18181b]/50 p-8 rounded-3xl border border-gray-200 dark:border-[#27272a]">
                                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-3">Faith-Based Organizations</h3>
                                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                                Consistent with our focus on stewardship and the modern church, we seek partners interested in promoting sustainable, ethical farming practices within their communities.
                                            </p>
                                        </div>

                                        {/* Box 4 */}
                                        <div className="bg-gray-50/50 dark:bg-[#18181b]/50 p-8 rounded-3xl border border-gray-200 dark:border-[#27272a]">
                                            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-3">Technology & Data Providers</h3>
                                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                                We are looking to expand our multimodal capabilities. If you provide localized weather data, satellite imagery, or soil sensor technology, let's explore how we can integrate your "truth" into our platform.
                                            </p>
                                        </div>

                                    </div>

                                    {/* Call to Action & Verse */}
                                    <div className="flex flex-col items-center text-center pb-12">
                                        <div className="bg-sage-50 dark:bg-sage-900/10 border border-sage-200 dark:border-sage-800/30 p-8 rounded-3xl max-w-2xl mx-auto mb-10 relative overflow-hidden">
                                            <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
                                                <svg width="150" height="150" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22h20L12 2zm0 4.5l7.5 14h-15L12 6.5z" /></svg>
                                            </div>
                                            <h3 className="text-2xl font-black text-[#0F172A] dark:text-gray-50 mb-4 relative z-10">"Ready to Cultivate the Future?"</h3>
                                            <p className="italic text-gray-800 dark:text-gray-300 text-lg relative z-10 leading-relaxed font-medium mb-6">
                                                "Two are better than one, because they have a good return for their labor: If either of them falls down, one can help the other up."
                                            </p>
                                            <p className="text-sm font-bold text-sage-700 dark:text-sage-500 uppercase tracking-widest relative z-10 mb-8">— Ecclesiastes 4:9-10</p>

                                            <p className="text-gray-600 dark:text-gray-400 mb-8 relative z-10 text-lg">
                                                Whether you are a corporate giant, a research body, or an independent expert, there is a place for you in the CeresVera ecosystem.
                                            </p>

                                            <Link to="/contact" className="inline-block bg-[#0F172A] dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 active:scale-95 text-white dark:text-[#0F172A] font-bold text-lg py-4 px-12 rounded-full transition-all shadow-lg shadow-gray-900/30 dark:shadow-white/10 relative z-10">
                                                Contact the Founders to Partner
                                            </Link>
                                        </div>

                                        {/* Pitch Badge */}
                                        <div className="mt-8 bg-gray-900 text-gray-300 text-xs font-bold px-6 py-2.5 rounded-full uppercase tracking-wider flex items-center gap-2 shadow-sm border border-gray-700">
                                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                                            A Project by the CeresVera 5 — Built for the Interswitch Pan-African Discovery Series
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </div>
        </div >
    );
}
