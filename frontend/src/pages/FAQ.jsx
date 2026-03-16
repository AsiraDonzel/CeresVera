import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, Leaf, Star, ShieldCheck, Zap, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqs = [
    {
        icon: Leaf,
        q: "Is CeresVera free to use?",
        a: "Yes, the core platform, including AI crop scans, localized weather forecasts, and the CeraAI Assistant, is free for farmers. Premium features are primarily focused on expert-level data tools and marketplace transactions.",
        color: "forest"
    },
    {
        icon: Star,
        q: "What is the \"Gold Veritas\" badge?",
        a: "It is our highest level of expert verification. It signifies that a consultant has undergone rigorous certificate verification and is eligible for lower platform fees and instant payment settlements.",
        color: "harvest"
    },
    {
        icon: ShieldCheck,
        q: "How does the Escrow system protect me?",
        a: "When a farmer pays for a consultation, the money is not sent directly to the expert. It is held securely by our payment partner, Interswitch. The funds are only released once the farmer is satisfied and marks the request as \"Successful\".",
        color: "blue"
    },
    {
        icon: Zap,
        q: "How accurate are the AI crop scans?",
        a: "We utilize state-of-the-art models (Llama-3.3 and Groq) to analyze your crops. For the best results, ensure your photos are clear and taken in good lighting.",
        color: "sage"
    },
    {
        icon: UserPlus,
        q: "Can I change my role from Farmer to Expert?",
        a: "Roles are assigned during the onboarding process to ensure proper data management. If you need to change your role, please visit the \"Settings\" page to update your profile and provide necessary certifications.",
        color: "gray"
    }
];

export default function FAQ() {
    const [activeIndex, setActiveIndex] = useState(null);

    return (
        <div className="min-h-screen bg-white dark:bg-[#09090b] py-20 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-3xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-forest-50 text-forest-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <HelpCircle className="w-10 h-10" />
                    </div>
                    <h1 className="text-5xl font-black text-gray-900 dark:text-gray-50 tracking-tight italic">
                        The Truth <span className="text-forest-500">of the Harvest</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Common questions about the CeresVera ecosystem.</p>
                </div>

                {/* FAQ List */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`rounded-3xl border-2 transition-all p-2 ${activeIndex === index ? 'bg-gray-50 dark:bg-[#121214] border-forest-100 dark:border-forest-900/50' : 'bg-white dark:bg-[#18181b] border-gray-50 dark:border-[#27272a]'}`}
                        >
                            <button
                                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                                className="w-full text-left p-6 flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-6">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-white dark:bg-[#27272a] shadow-sm border border-gray-100 dark:border-[#27272a] group-hover:scale-110 transition-transform`}>
                                        <faq.icon className={`w-6 h-6 text-${faq.color}-500`} />
                                    </div>
                                    <span className="text-lg font-black text-gray-800 dark:text-gray-50">{faq.q}</span>
                                </div>
                                <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform ${activeIndex === index ? 'rotate-180' : ''}`} />
                            </button>
                            <AnimatePresence>
                                {activeIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <p className="px-24 pb-8 text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                                            {faq.a}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                {/* Direct Support Callout */}
                <div className="p-10 bg-forest-500 rounded-[3rem] text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                    <div className="relative z-10 space-y-4">
                        <h3 className="text-2xl font-black tracking-tight">Still have questions?</h3>
                        <p className="text-forest-100 font-medium">Our stewardship team is ready to assist you 24/7.</p>
                        <Link to="/contact" className="inline-block px-8 py-4 bg-white text-forest-600 font-black rounded-2xl hover:scale-105 transition-transform">
                            Contact Support
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
