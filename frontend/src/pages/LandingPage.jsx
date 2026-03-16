import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Camera, ShieldCheck, Stethoscope, ArrowRight, Star, LayoutDashboard } from 'lucide-react';

export default function LandingPage() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const isLoggedIn = !!localStorage.getItem('access_token');
    const userRole = localStorage.getItem('user_role') || 'farmer';

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="w-full relative overflow-hidden bg-app-bg dark:bg-[#09090b] text-app-text dark:text-gray-50">
            {/* Hero Section */}
            <section className="relative px-4 py-24 sm:py-32 lg:px-8 bg-gradient-to-b from-app-bg dark:from-[#09090b] to-app-subtle dark:to-[#121214] flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl mx-auto space-y-8"
                >
                    <span className="inline-block py-1 px-4 rounded-full bg-app-accent-subtle text-sage-800 border border-app-border text-sm font-semibold tracking-wide">
                        The Truth of the Harvest
                    </span>
                    <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-app-text dark:text-gray-50">
                        Intelligent Care for <span className="text-sage-700 dark:text-sage-400 block mt-2">Sustainable Farming.</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-app-text-muted dark:text-gray-400 leading-relaxed">
                        CeresVera provides absolute clarity on crop health. Detect diseases instantly using AI and connect with certified agronomy experts for real truth you can trust.
                    </p>

                    {isLoggedIn && userRole !== 'farmer' ? (
                        <div className="flex justify-center mt-8">
                            <Link
                                to="/expert-dashboard"
                                className="inline-flex items-center justify-center gap-2 px-12 py-4 text-base font-black text-white bg-sage-700 bg-gradient-to-tr from-sage-900 to-sage-700 rounded-full shadow-lg shadow-sage-700/30 hover:scale-105 transition-transform"
                            >
                                <LayoutDashboard className="w-5 h-5" />
                                Go to Expert Dashboard
                            </Link>
                        </div>
                    ) : !isLoggedIn ? (
                        /* Testimonial Carousel - Only for visitors */
                        <div className="pt-12 pb-8 overflow-hidden relative group">
                            <motion.div 
                                className="flex gap-8 items-center"
                                animate={{ x: [0, -100 * 5] }}
                                transition={{ 
                                    repeat: Infinity, 
                                    duration: 30, 
                                    ease: "linear" 
                                }}
                            >
                                {[
                                    { name: "Abiola J.", role: "Rice Farmer", text: "CeresVera saved my entire harvest after detecting early blight.", color: "sage" },
                                    { name: "Dr. Amadi", role: "Agronomist", text: "The AI precision here is unmatched in the digital ag space.", color: "emerald" },
                                    { name: "Kemi O.", role: "Maize Grower", text: "Consulting an expert through the portal was seamless and vital.", color: "forest" },
                                    { name: "FarmCentral", role: "Cooperative", text: "A game changer for our diagnostic speed and accuracy.", color: "teal" },
                                    { name: "Samuel T.", role: "Vineyard Owner", text: "The truth is in the data. Highly recommend to all farmers.", color: "lime" },
                                    // Repeat for smooth loop
                                    { name: "Abiola J.", role: "Rice Farmer", text: "CeresVera saved my entire harvest after detecting early blight.", color: "sage" },
                                    { name: "Dr. Amadi", role: "Agronomist", text: "The AI precision here is unmatched in the digital ag space.", color: "emerald" },
                                ].map((t, i) => (
                                    <div key={i} className={`flex-shrink-0 w-80 p-6 rounded-2xl bg-app-card dark:bg-[#18181b] border border-app-border dark:border-[#27272a] shadow-sm text-left transition-all hover:shadow-lg`}>
                                        <div className="flex items-center gap-1 mb-3 text-amber-500">
                                            {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                                        </div>
                                        <p className="text-sm font-medium text-app-text-muted dark:text-gray-400 italic mb-4 leading-relaxed line-clamp-2">"{t.text}"</p>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full bg-app-accent-subtle dark:bg-[#064e3b15] flex items-center justify-center font-black text-sage-700 dark:text-sage-400 text-xs`}>{t.name.charAt(0)}</div>
                                            <div>
                                                <h4 className="text-xs font-black text-app-text dark:text-gray-50 tracking-tight">{t.name}</h4>
                                                <p className="text-[10px] text-app-text-muted dark:text-gray-400 font-bold uppercase tracking-widest">{t.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                    ) : (
                        /* Logged in Farmers see their specialized dashboard link too */
                        <div className="flex justify-center mt-8">
                            <Link
                                to="/dashboard"
                                className="inline-flex items-center justify-center gap-2 px-12 py-4 text-base font-black text-white bg-sage-700 bg-gradient-to-tr from-sage-900 to-sage-700 rounded-full shadow-lg shadow-sage-700/30 hover:scale-105 transition-transform"
                            >
                                <LayoutDashboard className="w-5 h-5" />
                                Go to Farmer Dashboard
                            </Link>
                        </div>
                    )}
                </motion.div>

                {/* Background Decorative Blur */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 max-w-[800px] aspect-square rounded-full bg-sage-300/30 blur-[100px] -z-10 pointer-events-none" />
            </section>

            {/* Features Section */}
            <section className="py-24 bg-app-bg dark:bg-[#09090b] px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-app-text dark:text-gray-50 sm:text-4xl">How It Works</h2>
                        <p className="mt-4 text-lg text-app-text-muted dark:text-gray-400">Three simple steps to healthier crops.</p>
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid sm:grid-cols-3 gap-12"
                    >
                        {[
                            { icon: <Camera />, title: "1. Scan Image", desc: "Upload or take a picture of your plant showing signs of distress." },
                            { icon: <ShieldCheck />, title: "2. AI Analysis", desc: "Our neural network instantly detects diseases with high precision." },
                            { icon: <Stethoscope />, title: "3. Expert Consult", desc: "Unlock premium agronomy advice using Interswitch payments." }
                        ].map((feature, idx) => (
                            <motion.div key={idx} variants={itemVariants} className="flex flex-col items-center text-center p-8 rounded-3xl bg-app-card dark:bg-[#18181b] shadow-sm border border-app-card-border dark:border-[#27272a] hover:shadow-md transition-shadow">
                                <div className="p-4 bg-app-accent-subtle dark:bg-[#064e3b15] text-sage-700 dark:text-sage-400 rounded-2xl mb-6 shadow-inner border border-app-border dark:border-transparent">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-app-text dark:text-gray-50 mb-3">{feature.title}</h3>
                                <p className="text-app-text-muted dark:text-gray-400 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
