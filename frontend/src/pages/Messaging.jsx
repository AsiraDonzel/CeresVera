import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Search, MessageSquare, ChevronLeft, Image as ImageIcon, Phone, Video, Info, MoreVertical } from 'lucide-react';
import axios from 'axios';
import Pusher from 'pusher-js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function Messaging() {
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        const token = localStorage.getItem('access_token');
        
        if (userStr) {
            const user = JSON.parse(userStr);
            setCurrentUser(user);
            fetchConversations(user.token || token);
        } else if (token) {
            // Fallback for cases where individual keys are set but not the 'user' object
            const user = {
                token: token,
                role: localStorage.getItem('user_role'),
                username: localStorage.getItem('user_name') || 'User',
                id: parseInt(localStorage.getItem('user_id')) || 0
            };
            setCurrentUser(user);
            fetchConversations(token);
        } else {
            setLoading(false);
            // Optionally redirect to login
            // navigate('/auth');
        }

        const handlePaymentSuccess = () => {
            if (currentUser?.token || token) {
                fetchConversations(currentUser?.token || token);
            }
        };

        window.addEventListener('consultantPaid', handlePaymentSuccess);
        return () => window.removeEventListener('consultantPaid', handlePaymentSuccess);
    }, []);

    useEffect(() => {
        if (activeConversation) {
            setMessages(activeConversation.messages || []);
            scrollToBottom();
            
            // Setup Pusher
            const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY || 'local_key', {
                cluster: import.meta.env.VITE_PUSHER_CLUSTER || 'mt1',
                forceTLS: true
            });

            const channel = pusher.subscribe(`conversation_${activeConversation.id}`);
            channel.bind('new-message', (data) => {
                if (data.sender !== currentUser?.id) {
                    setMessages(prev => [...prev, data]);
                }
            });

            return () => {
                pusher.unsubscribe(`conversation_${activeConversation.id}`);
            };
        }
    }, [activeConversation]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchConversations = async (token) => {
        try {
            const res = await axios.get(`${API_URL}/api/chat/conversations/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setConversations(res.data);
            if (res.data.length > 0 && !activeConversation) {
                setActiveConversation(res.data[0]);
            }
        } catch (err) {
            console.error('Failed to fetch conversations:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConversation || !currentUser) return;

        const messageData = {
            conversation: activeConversation.id,
            content: newMessage,
        };

        // Optimistic update
        const tempId = Date.now();
        const optimisticMsg = {
            id: tempId,
            sender: currentUser.id,
            sender_name: currentUser.name || currentUser.username,
            content: newMessage,
            created_at: new Date().toISOString()
        };
        setMessages(prev => [...prev, optimisticMsg]);
        setNewMessage('');
        scrollToBottom();

        try {
            const res = await axios.post(`${API_URL}/api/chat/messages/`, messageData, {
                headers: { Authorization: `Bearer ${currentUser.token}` }
            });
            // Update the optimistic message with real data if needed
            setMessages(prev => prev.map(m => m.id === tempId ? res.data : m));
        } catch (err) {
            console.error('Failed to send message:', err);
            // Optionally remove optimistic message or show error
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-app-subtle">
                <div className="w-12 h-12 border-4 border-sage-200 border-t-sage-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-80px)] bg-app-subtle mt-20 overflow-hidden font-inter">
            {/* Conversations Sidebar */}
            <div className={`w-full md:w-80 lg:w-96 bg-app-card border-r border-app-border flex flex-col ${activeConversation ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-6 border-b border-app-border">
                    <h1 className="text-2xl font-black text-app-text tracking-tight mb-4">Messages</h1>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-app-text-muted" />
                        <input 
                            type="text" 
                            placeholder="Search chats..." 
                            className="w-full pl-10 pr-4 py-2 bg-app-subtle border border-app-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-sage-500/20"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {conversations.length === 0 ? (
                        <div className="p-8 text-center">
                            <MessageSquare className="w-12 h-12 text-app-border mx-auto mb-3" />
                            <p className="text-app-text-muted text-sm font-medium">No conversations yet.</p>
                        </div>
                    ) : (
                        conversations.map(conv => {
                            const otherParticipant = conv.participants.find(p => p.id !== currentUser?.id) || conv.participants[0];
                            const lastMsg = conv.messages[conv.messages.length - 1];
                            
                            return (
                                <button
                                    key={conv.id}
                                    onClick={() => setActiveConversation(conv)}
                                    className={`w-full p-4 flex items-center gap-4 hover:bg-app-subtle transition-colors border-b border-app-border/50 ${activeConversation?.id === conv.id ? 'bg-sage-50/50 dark:bg-sage-900/10' : ''}`}
                                >
                                    <div className="relative">
                                        <img 
                                            src={otherParticipant.profile?.profile_picture || `https://i.pravatar.cc/150?u=${otherParticipant.id}`} 
                                            className="w-12 h-12 rounded-full object-cover border-2 border-app-border"
                                            alt=""
                                        />
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-app-card"></div>
                                    </div>
                                    <div className="flex-1 text-left min-w-0">
                                        <div className="flex justify-between items-center mb-1">
                                            <h3 className="font-bold text-app-text truncate">{otherParticipant.first_name || otherParticipant.username}</h3>
                                            <span className="text-[10px] text-app-text-muted font-bold uppercase tracking-tighter">
                                                {lastMsg ? new Date(lastMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                            </span>
                                        </div>
                                        <p className="text-sm text-app-text-muted truncate">
                                            {lastMsg ? lastMsg.content : 'Start a conversation'}
                                        </p>
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 flex flex-col bg-app-subtle ${!activeConversation ? 'hidden md:flex items-center justify-center' : 'flex'}`}>
                {activeConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="h-20 bg-app-card border-b border-app-border flex items-center justify-between px-6 shrink-0">
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => setActiveConversation(null)}
                                    className="md:hidden p-2 hover:bg-app-subtle rounded-xl text-app-text-muted"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <div className="flex items-center gap-3">
                                    <img 
                                        src={activeConversation.participants.find(p => p.id !== currentUser?.id)?.profile?.profile_picture || `https://i.pravatar.cc/150?u=${activeConversation.id}`} 
                                        className="w-10 h-10 rounded-full object-cover shadow-sm border border-app-border"
                                        alt=""
                                    />
                                    <div>
                                        <h2 className="font-black text-app-text tracking-tight">
                                            {activeConversation.participants.find(p => p.id !== currentUser?.id)?.username || 'Chat'}
                                        </h2>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                            <span className="text-[10px] text-green-600 font-black uppercase tracking-widest">Online</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-3 text-app-text-muted hover:text-sage-600 hover:bg-sage-50 rounded-2xl transition-all"><Phone className="w-5 h-5" /></button>
                                <button className="p-3 text-app-text-muted hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"><Video className="w-5 h-5" /></button>
                                <button className="p-3 text-app-text-muted hover:bg-app-subtle rounded-2xl transition-all"><MoreVertical className="w-5 h-5" /></button>
                            </div>
                        </div>

                        {/* Messages List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-50/30">
                            {messages.map((msg, idx) => {
                                const isMe = msg.sender === currentUser?.id;
                                return (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        key={msg.id || idx}
                                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[75%] rounded-[1.5rem] p-4 shadow-sm ${
                                            isMe 
                                                ? 'bg-sage-700 text-white rounded-tr-none' 
                                                : 'bg-white text-app-text border border-app-border rounded-tl-none'
                                        }`}>
                                            <p className="text-sm leading-relaxed">{msg.content}</p>
                                            <div className={`text-[9px] mt-2 font-black uppercase tracking-widest opacity-60 ${isMe ? 'text-white' : 'text-app-text-muted'}`}>
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className="p-6 bg-app-card border-t border-app-border shrink-0">
                            <form 
                                onSubmit={handleSendMessage}
                                className="flex items-center gap-3 bg-app-subtle border border-app-border p-2 rounded-2xl shadow-inner focus-within:ring-2 focus-within:ring-sage-500/10 transition-all"
                            >
                                <button type="button" className="p-2 text-app-text-muted hover:text-sage-600 transition-colors"><ImageIcon className="w-5 h-5" /></button>
                                <input 
                                    type="text" 
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message here..."
                                    className="flex-1 bg-transparent border-none outline-none text-app-text text-sm p-2"
                                />
                                <button 
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="bg-sage-700 text-white p-3 rounded-xl shadow-lg shadow-sage-700/20 hover:bg-sage-800 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="text-center p-12 max-w-sm">
                        <div className="w-20 h-20 bg-sage-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <MessageSquare className="w-10 h-10 text-sage-600" />
                        </div>
                        <h2 className="text-2xl font-black text-app-text tracking-tight mb-2">Select a Conversation</h2>
                        <p className="text-app-text-muted text-sm leading-relaxed">Choose an expert or farmer from your list to start a real-time consultation.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
