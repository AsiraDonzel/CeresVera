import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Sprout, ArrowLeft, Send, User, Loader2, Brain } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const TOPICS = [
    "sustainable farming", "crop rotation", "soil health", "organic farming",
    "precision agriculture", "pest management", "agricultural technology",
    "irrigation methods", "plant diseases and treatment", "farm management"
];

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function Chatbot() {
    const [activeMode, setActiveMode] = useState(null); // 'deepseek' | 'adviser' | null
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const isPremium = localStorage.getItem('is_premium') === 'true';
    const token = localStorage.getItem('access_token');

    // Adviser State
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Deepseek State
    const [deepseekMessages, setDeepseekMessages] = useState([]);
    const [deepseekInputValue, setDeepseekInputValue] = useState('');
    const [isDeepseekLoading, setIsDeepseekLoading] = useState(false);
    const deepseekMessagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const scrollDeepseekToBottom = () => {
        deepseekMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (activeMode === 'adviser') scrollToBottom();
        if (activeMode === 'deepseek') scrollDeepseekToBottom();
    }, [messages, deepseekMessages, activeMode]);

    const handleAdviserSubmit = async (e, topicOverride = null) => {
        if (e) e.preventDefault();

        const query = topicOverride ? `Tell me about ${topicOverride} in agriculture` : inputValue;
        if (!query.trim()) return;

        const newMessages = [...messages, { role: 'user', content: query }];
        setMessages(newMessages);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/adviser/`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ query: topicOverride ? '' : query, topic: topicOverride || '' })
            });

            const data = await response.json();

            if (response.status === 403 && data.requires_upgrade) {
                setShowUpgradeModal(true);
                setMessages(messages); // Revert query if needed or just stop
                setIsLoading(false);
                return;
            }

            if (response.ok) {
                setMessages([...newMessages, { role: 'assistant', content: data.response }]);
            } else {
                throw new Error(data.error || 'Failed to fetch response');
            }
        } catch (error) {
            console.error("Adviser Error:", error);
            setMessages([...newMessages, { role: 'assistant', content: "Sorry, I encountered an error connecting to the agronomy core. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeepseekSubmit = async (e) => {
        if (e) e.preventDefault();

        const query = deepseekInputValue;
        if (!query.trim()) return;

        const newMessages = [...deepseekMessages, { role: 'user', content: query }];
        setDeepseekMessages(newMessages);
        setDeepseekInputValue('');
        setIsDeepseekLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/deepseek/`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ query: query })
            });

            const data = await response.json();

            if (response.status === 403 && data.requires_upgrade) {
                setShowUpgradeModal(true);
                setIsDeepseekLoading(false);
                return;
            }

            if (response.ok) {
                setDeepseekMessages([...newMessages, { role: 'assistant', content: data.response }]);
            } else {
                throw new Error(data.error || 'Failed to fetch response');
            }
        } catch (error) {
            console.error("Deepseek Error:", error);
            setDeepseekMessages([...newMessages, { role: 'assistant', content: "Sorry, I encountered an error connecting to Cera AI. Please try again later." }]);
        } finally {
            setIsDeepseekLoading(false);
        }
    };

    // --- RENDER HELPERS ---

    const renderSelectionScreen = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 flex flex-col items-center justify-center space-y-12"
        >
            <div className="text-center space-y-4 max-w-2xl">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                    className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"
                >
                    <Sparkles className="w-8 h-8 text-sage-600" />
                </motion.div>
                <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 tracking-tight">
                    Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-sage-600 to-earth-600">Cera AI</span>
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                    Select an intelligence module below to begin. Whether you need an intelligent conversational partner or deep agronomic expertise, CeresVera is here to guide you.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8 w-full max-w-2xl">
                {/* Cera AI Card */}
                <motion.button
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveMode('deepseek')}
                    className="group relative bg-white rounded-3xl p-8 text-left border border-gray-100 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-sage-200"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-sage-100/50 to-transparent rounded-bl-full -z-10 transition-transform duration-500 group-hover:scale-110" />
                    <div className="bg-sage-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-sage-600/20 group-hover:bg-sage-700 transition-colors">
                        <Brain className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">Cera AI</h3>
                    <p className="text-xs font-medium text-sage-600 mb-3">Powered by DeepSeek</p>
                    <p className="text-gray-600 leading-relaxed mb-6">
                        Chat with Cera AI for general farming advice, crop disease guidance, operational analysis, and intelligent multi-turn conversation.
                    </p>
                    <span className="inline-flex items-center text-sm font-bold text-sage-600 group-hover:text-sage-800 transition-colors">
                        Launch Cera AI <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                    </span>
                </motion.button>
            </div>
        </motion.div>
    );

    // Using react-markdown natively to avoid manual regex parsing

    const renderDeepseekUI = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-[calc(100vh-240px)] max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6"
        >
            <div className="bg-white rounded-t-2xl border border-gray-200 p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="bg-sage-100 p-2 rounded-lg">
                        <Brain className="w-6 h-6 text-sage-600" />
                    </div>
                    <div>
                        <h2 className="font-bold text-gray-900">Cera AI</h2>
                        <p className="text-xs text-gray-500">Powered by DeepSeek</p>
                    </div>
                </div>
                <button
                    onClick={() => setActiveMode(null)}
                    className="text-sm font-medium text-gray-500 hover:text-gray-900 border border-gray-200 px-4 py-2 rounded-full transition-colors flex items-center gap-2 lg:hidden md:flex"
                >
                    <ArrowLeft className="w-4 h-4" /> Switch Mode
                </button>
            </div>

            <div className="flex-1 bg-gray-50 border-x border-gray-200 overflow-y-auto p-4 space-y-6">
                {deepseekMessages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-6 max-w-2xl mx-auto">
                        <Brain className="w-12 h-12 text-sage-300 mb-2" />
                        <h3 className="text-xl font-bold text-gray-700">Cera AI</h3>
                        <p className="text-gray-500 text-sm pb-4">Ask anything! I am Cera, your intelligent AI farming assistant powered by DeepSeek, ready to help optimize your farm processes.</p>
                    </div>
                ) : (
                    deepseekMessages.map((msg, idx) => (
                        <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'assistant' && (
                                <div className="w-8 h-8 rounded-full bg-sage-600 flex items-center justify-center flex-shrink-0 mt-1">
                                    <Brain className="w-4 h-4 text-white" />
                                </div>
                            )}

                            <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${msg.role === 'user'
                                ? 'bg-sage-600 text-white rounded-tr-sm'
                                : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm prose prose-sm prose-sage'
                                }`}>
                                {msg.role === 'assistant' ? (
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                                ) : (
                                    <p>{msg.content}</p>
                                )}
                            </div>

                            {msg.role === 'user' && (
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-1">
                                    <User className="w-4 h-4 text-gray-500" />
                                </div>
                            )}
                        </div>
                    ))
                )}
                {isDeepseekLoading && (
                    <div className="flex gap-4 justify-start">
                        <div className="w-8 h-8 rounded-full bg-sage-600 flex items-center justify-center flex-shrink-0 mt-1">
                            <Brain className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm p-4 shadow-sm flex items-center gap-2 text-gray-500">
                            <Loader2 className="w-4 h-4 animate-spin" /> Thinking...
                        </div>
                    </div>
                )}
                <div ref={deepseekMessagesEndRef} />
            </div>

            <div className="bg-white rounded-b-2xl border border-gray-200 p-4 shadow-sm">
                <form onSubmit={handleDeepseekSubmit} className="flex gap-3">
                    <input
                        type="text"
                        value={deepseekInputValue}
                        onChange={(e) => setDeepseekInputValue(e.target.value)}
                        placeholder="Message Cera AI..."
                        disabled={isDeepseekLoading}
                        className="flex-1 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={!deepseekInputValue.trim() || isDeepseekLoading}
                        className="bg-sage-600 hover:bg-sage-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl px-6 py-3 font-medium transition-colors flex items-center gap-2 shadow-sm"
                    >
                        <Send className="w-5 h-5" />
                        <span className="hidden sm:inline">Send</span>
                    </button>
                </form>
            </div>
        </motion.div>
    );

    const renderAdviserUI = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-[calc(100vh-240px)] max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6"
        >
            {/* Header */}
            <div className="bg-white rounded-t-2xl border border-gray-200 p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="bg-earth-100 p-2 rounded-lg">
                        <Sprout className="w-6 h-6 text-earth-600" />
                    </div>
                    <div>
                        <h2 className="font-bold text-gray-900">Agriculture Adviser</h2>
                        <p className="text-xs text-gray-500">Llama-3.3-70b Core</p>
                    </div>
                </div>
                <button
                    onClick={() => setActiveMode(null)}
                    className="text-sm font-medium text-gray-500 hover:text-gray-900 border border-gray-200 px-4 py-2 rounded-full transition-colors flex items-center gap-2 lg:hidden md:flex"
                >
                    <ArrowLeft className="w-4 h-4" /> Switch Mode
                </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-gray-50 border-x border-gray-200 overflow-y-auto p-4 space-y-6">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-6 max-w-2xl mx-auto">
                        <Sprout className="w-12 h-12 text-earth-300 mb-2" />
                        <h3 className="text-xl font-bold text-gray-700">How can I help your farm today?</h3>
                        <p className="text-gray-500 text-sm pb-4">Select a common topic below or type your own specific question concerning your crops, soil, or climate.</p>

                        <div className="flex flex-wrap justify-center gap-2">
                            {TOPICS.map((topic) => (
                                <button
                                    key={topic}
                                    onClick={() => handleAdviserSubmit(null, topic)}
                                    className="bg-white border border-gray-200 hover:border-earth-300 hover:bg-earth-50 text-gray-600 text-sm px-4 py-2 rounded-full transition-all duration-200 capitalize shadow-sm hover:shadow"
                                >
                                    {topic}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    messages.map((msg, idx) => (
                        <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'assistant' && (
                                <div className="w-8 h-8 rounded-full bg-earth-600 flex items-center justify-center flex-shrink-0 mt-1">
                                    <Sprout className="w-4 h-4 text-white" />
                                </div>
                            )}

                            <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${msg.role === 'user'
                                ? 'bg-sage-600 text-white rounded-tr-sm'
                                : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm prose prose-sm prose-earth'
                                }`}>
                                {/* Simple Markdown rendering for the assistant */}
                                {msg.role === 'assistant' ? (
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                                ) : (
                                    <p>{msg.content}</p>
                                )}
                            </div>

                            {msg.role === 'user' && (
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-1">
                                    <User className="w-4 h-4 text-gray-500" />
                                </div>
                            )}
                        </div>
                    ))
                )}
                {isLoading && (
                    <div className="flex gap-4 justify-start">
                        <div className="w-8 h-8 rounded-full bg-earth-600 flex items-center justify-center flex-shrink-0 mt-1">
                            <Sprout className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm p-4 shadow-sm flex items-center gap-2 text-gray-500">
                            <Loader2 className="w-4 h-4 animate-spin" /> Thinking...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white rounded-b-2xl border border-gray-200 p-4 shadow-sm">
                <form onSubmit={handleAdviserSubmit} className="flex gap-3">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask about crops, diseases, irrigation..."
                        disabled={isLoading}
                        className="flex-1 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-earth-500 focus:border-transparent transition-all disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={!inputValue.trim() || isLoading}
                        className="bg-earth-600 hover:bg-earth-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl px-6 py-3 font-medium transition-colors flex items-center gap-2 shadow-sm"
                    >
                        <Send className="w-5 h-5" />
                        <span className="hidden sm:inline">Send</span>
                    </button>
                </form>
            </div>
        </motion.div>
    );

    return (
        <div className="flex flex-col min-h-[80vh] bg-earth-50">


            {/* Dynamic Content Area */}
            <div className="flex-1 w-full relative flex flex-col">
                <AnimatePresence mode="wait">
                    {!activeMode && (
                        <motion.div key="selection" className="flex-1 flex flex-col bg-earth-50 z-10">
                            {renderSelectionScreen()}
                        </motion.div>
                    )}

                    {activeMode === 'deepseek' && (
                        <motion.div
                            key="deepseek"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex-1 w-full bg-earth-50 z-10"
                        >
                            {renderDeepseekUI()}
                        </motion.div>
                    )}

                    {activeMode === 'adviser' && (
                        <motion.div
                            key="adviser"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex-1 w-full bg-earth-50 z-10"
                        >
                            {renderAdviserUI()}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Premium Upgrade Modal */}
            <AnimatePresence>
                {showUpgradeModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white max-w-lg w-full rounded-[3rem] overflow-hidden shadow-2xl relative border border-amber-200"
                        >
                            <button 
                                onClick={() => setShowUpgradeModal(false)}
                                className="absolute top-6 right-8 text-gray-400 hover:text-gray-600 transition-colors z-10"
                            >
                                <ArrowLeft className="w-6 h-6 rotate-90" />
                            </button>

                            <div className="bg-amber-500 p-8 text-white relative overflow-hidden">
                                <Sparkles className="absolute -right-4 -bottom-4 w-32 h-32 opacity-20" />
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-widest mb-4">
                                    Premium Upgrade Required
                                </div>
                                <h3 className="text-3xl font-black tracking-tight mb-2">Unlock Unlimited AI</h3>
                                <p className="text-amber-50 text-sm font-medium opacity-90">You've reached the daily limit for free AI queries.</p>
                            </div>

                            <div className="p-8 space-y-6">
                                <div className="space-y-4">
                                    {[
                                        { title: 'Unlimited AI Queries', desc: 'No daily limits on Cera AI or Agronomy Core.' },
                                        { title: 'Gold Veritas Badge', desc: 'Verified status across the platform.' },
                                        { title: 'Priority Support', desc: 'Faster responses from the expert marketplace.' }
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                                                <div className="w-2 h-2 bg-amber-500 rounded-full" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
                                                <p className="text-gray-500 text-xs font-medium">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-black shadow-xl shadow-gray-200 transition-all active:scale-95">
                                    Upgrade to Premium - ₦2,500/mo
                                </button>
                                
                                <button 
                                    onClick={() => setShowUpgradeModal(false)}
                                    className="w-full text-center text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-widest"
                                >
                                    Maybe later
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
