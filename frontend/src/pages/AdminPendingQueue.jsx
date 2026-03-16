import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, ShieldCheck, XCircle, CheckCircle, ExternalLink, 
    FileText, AlertCircle, Loader2, ArrowLeft, Search, Filter 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function AdminPendingQueue() {
    const [pendingExperts, setPendingExperts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewing, setReviewing] = useState(null); // ID of expert being reviewed
    const [rejectionReason, setRejectionReason] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPending();
    }, []);

    const fetchPending = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const res = await axios.get(`${API_URL}/api/admin/experts/pending/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPendingExperts(res.data);
        } catch (err) {
            console.error('Failed to fetch pending experts:', err);
            setError('Access Denied or Server Error');
        } finally {
            setLoading(false);
        }
    };

    const handleReview = async (id, status) => {
        try {
            const token = localStorage.getItem('access_token');
            await axios.post(`${API_URL}/api/admin/experts/review/${id}/`, {
                status,
                rejection_reason: status === 'REJECTED' ? rejectionReason : ''
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Refresh list
            setReviewing(null);
            setRejectionReason('');
            fetchPending();
        } catch (err) {
            console.error('Action failed:', err);
            alert('Action failed. Please try again.');
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-earth-50">
            <Loader2 className="w-12 h-12 text-sage-600 animate-spin" />
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-earth-50 p-6 text-center">
            <AlertCircle className="w-16 h-16 text-rose-500 mb-4" />
            <h2 className="text-2xl font-black text-gray-900 mb-2">{error}</h2>
            <p className="text-gray-500 mb-8">You must be an administrator to access this page.</p>
            <button onClick={() => navigate('/')} className="px-8 py-3 bg-sage-700 text-white font-bold rounded-xl shadow-lg">Return Home</button>
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 bg-earth-50 min-h-screen">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Expert Verification Queue</h1>
                    <p className="text-gray-500 font-medium">Review and approve agronomist applications for the Marketplace.</p>
                </div>
                <div className="bg-sage-100 text-sage-700 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                    <Users className="w-4 h-4" /> {pendingExperts.length} Pending
                </div>
            </div>

            {pendingExperts.length === 0 ? (
                <div className="bg-white rounded-[2rem] p-16 text-center border border-earth-100 shadow-sm">
                    <CheckCircle className="w-16 h-16 text-sage-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900">All caught up!</h3>
                    <p className="text-gray-500">There are no pending expert verification requests at this time.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {pendingExperts.map(expert => (
                        <motion.div 
                            key={expert.id}
                            layout
                            className="bg-white rounded-3xl p-8 border border-earth-100 shadow-sm flex flex-col lg:flex-row gap-8 items-start lg:items-center"
                        >
                            <img 
                                src={expert.profile_picture || `https://i.pravatar.cc/150?u=${expert.id}`} 
                                alt={expert.full_name} 
                                className="w-24 h-24 rounded-2xl object-cover border-4 border-earth-50 shadow-sm"
                            />

                            <div className="flex-1 space-y-4 w-full">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-xl font-black text-gray-900">{expert.full_name}</h3>
                                        <p className="text-sage-700 font-bold text-sm tracking-tight capitalize">{expert.email}</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button 
                                            onClick={() => handleReview(expert.id, 'APPROVED')}
                                            className="px-6 py-2.5 bg-sage-600 text-white font-bold rounded-xl hover:bg-sage-700 transition-all shadow-md flex items-center gap-2"
                                        >
                                            <ShieldCheck className="w-4 h-4" /> Approve
                                        </button>
                                        <button 
                                            onClick={() => setReviewing(expert.id)}
                                            className="px-6 py-2.5 bg-rose-50 text-rose-600 font-bold rounded-xl hover:bg-rose-100 transition-all border border-rose-100 flex items-center gap-2"
                                        >
                                            <XCircle className="w-4 h-4" /> Reject
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-earth-50">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Experience</p>
                                        <p className="text-sm font-bold text-gray-700">{expert.experience_years} Years</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Consultation Rate</p>
                                        <p className="text-sm font-bold text-gray-700">₦{parseFloat(expert.consultation_rate).toLocaleString()} / hr</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Credentials</p>
                                        {expert.documents_url ? (
                                            <a href={expert.documents_url} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-blue-600 flex items-center gap-1 hover:underline">
                                                <FileText className="w-4 h-4" /> View Documents <ExternalLink className="w-3 h-3" />
                                            </a>
                                        ) : (
                                            <p className="text-sm font-bold text-gray-400">No documents uploaded</p>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-earth-50 p-4 rounded-xl">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Expert Bio</p>
                                    <p className="text-sm text-gray-600 leading-relaxed font-medium">{expert.bio || "No bio provided."}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Rejection Modal */}
            <AnimatePresence>
                {reviewing && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setReviewing(null)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-[2rem] p-10 z-[60] shadow-2xl space-y-6"
                        >
                            <div className="text-center">
                                <XCircle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
                                <h3 className="text-2xl font-black text-gray-900">Confirm Rejection</h3>
                                <p className="text-gray-500 font-medium mt-1">Please provide a reason for the expert to understand why their application was denied.</p>
                            </div>

                            <textarea 
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="e.g., Certificates are blurry or expired. Please re-upload clear copies."
                                className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-rose-300 transition-colors h-32 font-medium text-sm"
                            />

                            <div className="flex gap-4">
                                <button onClick={() => setReviewing(null)} className="flex-1 py-4 font-bold text-gray-500 hover:bg-gray-100 rounded-2xl transition-colors">Cancel</button>
                                <button 
                                    onClick={() => handleReview(reviewing, 'REJECTED')}
                                    className="flex-1 py-4 bg-rose-600 text-white font-black rounded-2xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20"
                                >
                                    Confirm Reject
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
