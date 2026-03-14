import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Camera, ShieldCheck, Stethoscope, ArrowRight, LayoutDashboard } from 'lucide-react';

export default function LandingPage() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    const userRole = localStorage.getItem('user_role') || 'farmer';

    return (
        <div className="w-full relative overflow-hidden">
            {/* Hero Section */}
            <section className="relative px-4 py-24 sm:py-32 lg:px-8 bg-gradient-to-b from-white to-sage-100 flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl mx-auto space-y-8"
                >
                    <span className="inline-block py-1 px-4 rounded-full bg-sage-100 text-sage-800 border border-sage-200 text-sm font-semibold tracking-wide">
                        The Truth of the Harvest
                    </span>
                    <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-gray-900">
                        Intelligent Care for <span className="text-sage-700 block mt-2">Sustainable Farming.</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-gray-600 leading-relaxed">
                        CeresVera provides absolute clarity on crop health. Detect diseases instantly using AI and connect with certified agronomy experts for real truth you can trust.
                    </p>
                    <div className="flex justify-center flex-col sm:flex-row gap-4 mt-8">
                        {userRole === 'expert' ? (
                            <Link
                                to="/expert-dashboard"
                                className="inline-flex items-center justify-center gap-2 px-12 py-4 text-base font-black text-white bg-sage-700 bg-gradient-to-tr from-sage-900 to-sage-700 rounded-full shadow-lg shadow-sage-700/30 hover:scale-105 transition-transform"
                            >
                                <LayoutDashboard className="w-5 h-5" />
                                View Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/scan"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-sage-700 bg-gradient-to-tr from-sage-900 to-sage-700 rounded-full shadow-lg shadow-sage-700/30 hover:scale-105 transition-transform"
                                >
                                    <Camera className="w-5 h-5" />
                                    Scan Now
                                </Link>
                                <Link
                                    to="/consultants"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-gray-800 bg-white border-2 border-sage-300 rounded-full hover:bg-sage-100 transition-colors"
                                >
                                    Find Experts
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </>
                        )}
                    </div>
                </motion.div>

                {/* Background Decorative Blur */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 max-w-[800px] aspect-square rounded-full bg-sage-300/30 blur-[100px] -z-10 pointer-events-none" />
            </section>

            {/* Features Section */}
            <section className="py-24 bg-white px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">How It Works</h2>
                        <p className="mt-4 text-lg text-gray-600">Three simple steps to healthier crops.</p>
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
                            <motion.div key={idx} variants={itemVariants} className="flex flex-col items-center text-center p-8 rounded-3xl bg-earth-100 shadow-sm border border-earth-300 hover:shadow-md transition-shadow">
                                <div className="p-4 bg-sage-100 text-sage-700 rounded-2xl mb-6 shadow-inner">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
