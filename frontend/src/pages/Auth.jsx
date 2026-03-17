import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2,
    Leaf,
    ChevronRight,
    ChevronLeft,
    User,
    Phone,
    MapPin,
    Star,
    Award,
    Mail,
    Lock,
    Eye,
    EyeOff,
    AlertCircle,
    ArrowRight,
    UserCheck,
    ShieldAlert,
    HelpCircle,
    Video,
    X,
    ChevronDown
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '');

export default function Auth() {
    const [mode, setMode] = useState('login'); // 'login' | 'register-role' | 'register-farmer' | 'register-expert' | 'forgot-email' | 'forgot-code' | 'forgot-password'
    const [role, setRole] = useState('farmer');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [expertiseCategory, setExpertiseCategory] = useState('General');
    const [recoveryCode, setRecoveryCode] = useState(['', '', '', '']);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showSupportModal, setShowSupportModal] = useState(false);
    const navigate = useNavigate();

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setLoading(true);
            try {
                const res = await axios.post(`${API_URL}/api/auth/google/`, {
                    credential: tokenResponse.access_token,
                    token_type: 'access_token'
                });
                localStorage.setItem('access_token', res.data.access);
                localStorage.setItem('refresh_token', res.data.refresh);
                localStorage.setItem('user_role', res.data.role || 'farmer');
                localStorage.setItem('user_name', res.data.name || res.data.username || 'User');
                localStorage.setItem('user_id', res.data.user_id || res.data.id);
                if (res.data.email) localStorage.setItem('user_email', res.data.email);
                localStorage.setItem('user', JSON.stringify({
                    token: res.data.access,
                    role: res.data.role || 'farmer',
                    username: res.data.username || 'User',
                    name: res.data.name || res.data.username || 'User',
                    id: res.data.user_id || res.data.id,
                    email: res.data.email || ''
                }));
                navigate(res.data.role === 'agronomist' ? '/expert-dashboard' : '/dashboard');
            } catch (err) {
                setError('Google authentication failed.');
            } finally {
                setLoading(false);
            }
        },
    });

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setError('');

        try {
            if (mode === 'login') {
                setLoading(true);
                const res = await axios.post(`${API_URL}/api/auth/login/`, {
                    username: email,
                    password: password
                });

                // Clear stale data before setting new session
                localStorage.clear();

                localStorage.setItem('access_token', res.data.access);
                localStorage.setItem('refresh_token', res.data.refresh);
                const userRole = res.data.role || 'farmer';
                localStorage.setItem('user_role', userRole);
                localStorage.setItem('user_name', res.data.name || res.data.username || 'User');
                localStorage.setItem('user_id', res.data.user_id || res.data.id);
                if (res.data.email) localStorage.setItem('user_email', res.data.email);
                if (res.data.phone_number) localStorage.setItem('user_phone', res.data.phone_number);
                if (res.data.profile_pic) localStorage.setItem('profile_picture', res.data.profile_pic);

                localStorage.setItem('user', JSON.stringify({
                    token: res.data.access,
                    role: userRole,
                    username: res.data.username || 'User',
                    name: res.data.name || res.data.username || 'User',
                    id: res.data.user_id || res.data.id,
                    email: res.data.email || ''
                }));

                // Trigger navbar refresh
                window.dispatchEvent(new Event('profilePictureUpdated'));

                navigate(userRole === 'agronomist' ? '/expert-dashboard' : '/dashboard');

            } else if (mode === 'register-farmer' || mode === 'register-expert') {
                setLoading(true);
                await axios.post(`${API_URL}/api/auth/register/`, {
                    username: email,
                    email,
                    password: password,
                    confirm_password: confirmPassword,
                    role: role,
                    name: name,
                    phone: phone,
                    expertise_category: expertiseCategory
                });

                // Auto-login after successful registration
                const loginRes = await axios.post(`${API_URL}/api/auth/login/`, {
                    username: email,
                    password: password
                });

                // Clear stale data before setting new session
                localStorage.clear();

                localStorage.setItem('access_token', loginRes.data.access);
                localStorage.setItem('refresh_token', loginRes.data.refresh);
                const userRole = loginRes.data.role || role;
                localStorage.setItem('user_role', userRole);
                localStorage.setItem('user_name', loginRes.data.name || loginRes.data.username || name);
                localStorage.setItem('user_id', loginRes.data.user_id || loginRes.data.id);
                if (loginRes.data.email) localStorage.setItem('user_email', loginRes.data.email);
                if (loginRes.data.phone_number) localStorage.setItem('user_phone', loginRes.data.phone_number);
                if (loginRes.data.profile_pic) localStorage.setItem('profile_picture', loginRes.data.profile_pic);

                localStorage.setItem('user', JSON.stringify({
                    token: loginRes.data.access,
                    role: userRole,
                    username: loginRes.data.username || email,
                    name: loginRes.data.name || loginRes.data.username || name,
                    id: loginRes.data.user_id || loginRes.data.id,
                    email: loginRes.data.email || email
                }));

                // Trigger navbar refresh
                window.dispatchEvent(new Event('profilePictureUpdated'));

                navigate(userRole === 'agronomist' ? '/expert-dashboard' : '/dashboard');
            } else if (mode === 'forgot-email') {
                setLoading(true);
                // In a real app, this calls the backend reset request
                setTimeout(() => {
                    setMode('forgot-code');
                    setLoading(false);
                }, 1000);
            } else if (mode === 'forgot-code') {
                setMode('forgot-password');
            } else if (mode === 'forgot-password') {
                setLoading(true);
                setTimeout(() => {
                    alert('Password reset successfully!');
                    setMode('login');
                    setLoading(false);
                }, 1000);
            }
        } catch (err) {
            console.error('Auth error:', err);
            if (err.response?.data) {
                const data = err.response.data;
                if (data.error) setError(data.error);
                else if (data.detail) setError(data.detail);
                else if (typeof data === 'object') {
                    // Handle DRF field errors
                    const fields = Object.keys(data);
                    if (fields.length > 0) {
                        const firstField = fields[0];
                        const fieldError = data[firstField];
                        setError(`${firstField}: ${Array.isArray(fieldError) ? fieldError[0] : fieldError}`);
                    } else {
                        setError('Execution failed. Please verify your data.');
                    }
                } else {
                    setError('Execution failed. Please verify your data.');
                }
            } else {
                console.error('Network or unknown error details:', {
                    message: err.message,
                    code: err.code,
                    config: err.config
                });
                setError(err.message === 'Network Error' 
                    ? 'Network Error: Please ensure your backend is running at http://localhost:8080'
                    : (err.message || 'Execution failed. Please verify your data.'));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#09090b] flex flex-col items-center justify-center relative overflow-hidden font-sans">
            {/* Nature Accents */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-forest-50 dark:bg-forest-900 rounded-full blur-3xl opacity-50 dark:opacity-20" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-harvest-50 dark:bg-harvest-900 rounded-full blur-3xl opacity-50 dark:opacity-20" />

            <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 z-10 py-6 sm:py-12">
                <AnimatePresence mode="wait">
                    {/* Module 1: Role Selection Interface */}
                    {mode === 'register-role' && (
                        <motion.div
                            key="role-selection"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            className="text-center space-y-6 sm:space-y-12"
                        >
                            <div className="space-y-4">
                                <button onClick={() => setMode('login')} className="text-forest-500 font-bold flex items-center gap-2 hover:translate-x-[-4px] transition-transform">
                                    <ChevronLeft className="w-5 h-5" /> Back to Sign In
                                </button>
                                <h1 className="text-4xl sm:text-5xl font-black text-forest-500 tracking-tight">Choose Your Path</h1>
                                <p className="text-gray-500 font-medium text-lg">Select how you will engage with the CeresVera ecosystem.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                                <motion.button
                                    whileHover={{ scale: 1.02, translateY: -8 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => { setRole('farmer'); setMode('register-farmer'); }}
                                    className="group p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] bg-forest-50 border-2 border-forest-100/50 text-left space-y-4 sm:space-y-6 transition-all hover:border-forest-500 hover:shadow-2xl hover:shadow-forest-500/10 relative overflow-hidden"
                                >
                                    <div className="w-14 h-14 sm:w-20 sm:h-20 bg-forest-500 rounded-2xl flex items-center justify-center shadow-lg shadow-forest-500/20 group-hover:rotate-6 transition-transform">
                                        <Leaf className="w-7 h-7 sm:w-10 sm:h-10 text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl sm:text-3xl font-black text-forest-700">Farmer</h3>
                                        <p className="text-gray-600 font-medium leading-relaxed">Manage your crops, receive AI disease detection, and monitor climate data daily.</p>
                                    </div>
                                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <CheckCircle2 className="w-8 h-8 text-forest-500" />
                                    </div>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02, translateY: -8 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => { setRole('agronomist'); setMode('register-expert'); }}
                                    className="group p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] bg-harvest-50 border-2 border-harvest-100/50 text-left space-y-4 sm:space-y-6 transition-all hover:border-harvest-500 hover:shadow-2xl hover:shadow-harvest-500/10 relative overflow-hidden"
                                >
                                    <div className="w-14 h-14 sm:w-20 sm:h-20 bg-harvest-500 rounded-2xl flex items-center justify-center shadow-lg shadow-harvest-500/20 group-hover:-rotate-6 transition-transform">
                                        <Star className="w-7 h-7 sm:w-10 sm:h-10 text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl sm:text-3xl font-black text-harvest-700">Master of Knowledge</h3>
                                        <p className="text-gray-600 font-medium leading-relaxed">Provide consultations, review scan results, and empower farmers with your expertise.</p>
                                    </div>
                                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <CheckCircle2 className="w-8 h-8 text-harvest-500" />
                                    </div>
                                </motion.button>
                            </div>

                            <button onClick={() => setMode('login')} className="text-gray-400 font-bold hover:text-forest-500 transition-colors uppercase tracking-widest text-xs">
                                Already have an account? Sign In
                            </button>
                        </motion.div>
                    )}

                    {/* Registration Portal */}
                    {(mode === 'register-farmer' || mode === 'register-expert') && (
                        <motion.div
                            key="registration"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="bg-white dark:bg-[#121214] rounded-[2rem] sm:rounded-[3rem] shadow-2xl border border-gray-100 dark:border-[#27272a] overflow-hidden flex flex-col md:flex-row min-h-[auto] sm:min-h-[700px] w-full"
                        >
                            <div className="flex-1 p-6 sm:p-12 md:p-16 space-y-6 sm:space-y-10">
                                <div>
                                    <button onClick={() => setMode('register-role')} className="text-forest-500 font-bold flex items-center gap-2 mb-8 hover:translate-x-[-4px] transition-transform">
                                        <ChevronLeft className="w-5 h-5" /> Change Role
                                    </button>
                                    <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">Create your {role === 'farmer' ? 'Farmer' : 'Expert'} Account</h2>
                                    <p className="text-gray-500 mt-2 font-medium">Join the sustainable agricultural revolution.</p>
                                </div>

                                {error && (
                                    <div className="bg-rose-50 border-2 border-rose-100 text-rose-600 px-6 py-4 rounded-2xl flex items-center gap-3 font-bold text-sm">
                                        <AlertCircle className="w-5 h-5 shrink-0" /> {error}
                                    </div>
                                )}

                                <form className="space-y-6" onSubmit={handleSubmit}>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full pl-14 sm:pl-16 pr-4 sm:pr-6 py-4 sm:py-5 bg-gray-50 border-2 border-gray-50 focus:border-forest-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-700 placeholder:opacity-20 text-sm sm:text-base" placeholder="John Doe" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                                            <div className="relative">
                                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-black text-[10px] tracking-widest">TEL</div>
                                                <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full pl-14 sm:pl-16 pr-4 sm:pr-6 py-4 sm:py-5 bg-gray-50 border-2 border-gray-50 focus:border-forest-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-700 placeholder:opacity-20 text-sm sm:text-base" placeholder="080 123 4567" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-14 sm:pl-16 pr-4 sm:pr-6 py-4 sm:py-5 bg-gray-50 border-2 border-gray-50 focus:border-forest-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-700 placeholder:opacity-20 text-sm sm:text-base" placeholder="farmer@ceresvera.com" />
                                        </div>
                                    </div>

                                    {mode === 'register-expert' && (
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Specialty Category</label>
                                            <div className="relative">
                                                <Award className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-forest-500" />
                                                <select
                                                    value={expertiseCategory}
                                                    onChange={e => setExpertiseCategory(e.target.value)}
                                                    className="w-full pl-16 pr-6 py-5 bg-forest-50 border-2 border-forest-100 focus:border-forest-500 rounded-2xl outline-none appearance-none font-bold text-forest-700 cursor-pointer"
                                                >
                                                    <option value="Agronomy">Agronomy</option>
                                                    <option value="Livestock">Livestock</option>
                                                    <option value="Soil Health">Soil Health</option>
                                                    <option value="Pest Control">Pest Control</option>
                                                    <option value="General">General Expertise</option>
                                                </select>
                                                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-forest-300 pointer-events-none" />
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input type={showPassword ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-14 sm:pl-16 pr-12 sm:pr-14 py-4 sm:py-5 bg-gray-50 border-2 border-gray-50 focus:border-forest-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-700 placeholder:opacity-20 text-sm sm:text-base" placeholder="••••••••" />
                                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2">
                                                    {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                                                </button>
                                            </div>
                                            <p className="text-[11px] text-gray-500 font-medium ml-1 mt-1 leading-tight">Must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input type={showConfirmPassword ? "text" : "password"} required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full pl-14 sm:pl-16 pr-12 sm:pr-14 py-4 sm:py-5 bg-gray-50 border-2 border-gray-50 focus:border-forest-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-700 placeholder:opacity-20 text-sm sm:text-base" placeholder="••••••••" />
                                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-6 top-1/2 -translate-y-1/2">
                                                    {showConfirmPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <button disabled={loading} type="submit" className="w-full py-5 sm:py-6 bg-forest-500 text-white font-black text-base sm:text-lg rounded-3xl hover:bg-forest-700 transition-all shadow-xl shadow-forest-500/20 active:scale-95 flex items-center justify-center gap-3">
                                        {loading ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" /> : <>Sign Up Now <ArrowRight className="w-6 h-6" /></>}
                                    </button>
                                </form>
                            </div>

                            {/* Visual Right Side */}
                            <div className="hidden md:flex flex-1 bg-forest-500 relative overflow-hidden items-center justify-center px-12">
                                <div className="absolute inset-0 bg-gradient-to-br from-forest-400 to-forest-600 opacity-50" />
                                <motion.div
                                    animate={{
                                        borderRadius: ["40% 60% 70% 30% / 40% 50% 60% 50%", "30% 60% 70% 40% / 50% 60% 30% 60%", "40% 60% 70% 30% / 40% 50% 60% 50%"],
                                        rotate: [0, 90, 180, 270, 360]
                                    }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    className="w-96 h-96 border-4 border-white/20 flex items-center justify-center relative z-10"
                                >
                                    <div className="w-64 h-64 bg-white/10 backdrop-blur-3xl rounded-[3rem] border border-white/20 flex items-center justify-center">
                                        <Leaf className="w-32 h-32 text-white opacity-80" />
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}

                    {/* Login Screen */}
                    {mode === 'login' && (
                        <motion.div
                            key="login"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="bg-white dark:bg-[#121214] rounded-[2rem] sm:rounded-[3rem] shadow-2xl border border-gray-100 dark:border-[#27272a] overflow-hidden flex flex-col md:flex-row max-w-5xl mx-auto w-full"
                        >
                            {/* Left Side Visual */}
                            <div className="hidden md:flex w-2/5 bg-forest-500 items-center justify-center relative overflow-hidden">
                                <div className="z-10 text-center space-y-6 px-12">
                                    <Leaf className="w-20 h-20 text-white mx-auto" />
                                    <div className="space-y-2 text-white">
                                        <h2 className="text-4xl font-black tracking-tight">CeresVera</h2>
                                        <p className="font-medium text-forest-100/80">Premium Agricultural Intelligence</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 p-12 md:p-16 space-y-10 relative">
                                <Link to="/" className="absolute top-8 left-8 sm:top-12 sm:left-12 flex items-center gap-2 text-forest-500 hover:text-forest-700 font-bold hover:translate-x-[-4px] transition-transform">
                                    <ChevronLeft className="w-5 h-5" /> Back to Home
                                </Link>
                                <div className="text-center md:text-left pt-6 sm:pt-4">
                                    <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">Welcome Back</h1>
                                    <p className="text-gray-500 mt-2 font-medium">Continue your farming journey.</p>
                                </div>

                                {error && (
                                    <div className="bg-rose-50 border-2 border-rose-100 text-rose-600 px-6 py-4 rounded-2xl flex items-center gap-3 font-bold text-sm">
                                        <AlertCircle className="w-5 h-5 shrink-0" /> {error}
                                    </div>
                                )}

                                <form className="space-y-6" onSubmit={handleSubmit}>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-14 sm:pl-16 pr-4 sm:pr-6 py-4 sm:py-5 bg-gray-50 border-2 border-gray-50 focus:border-forest-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-700 placeholder:opacity-20 text-sm sm:text-base" placeholder="you@ceresvera.com" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center px-1">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Password</label>
                                            <button type="button" onClick={() => setMode('forgot-email')} className="text-xs font-black text-harvest-500 uppercase tracking-widest hover:text-harvest-700">Recover</button>
                                        </div>
                                        <div className="relative">
                                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input type={showPassword ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-16 pr-14 py-5 bg-gray-50 border-2 border-gray-50 focus:border-forest-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-700 placeholder:opacity-20" placeholder="••••••••" />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2">
                                                {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                                            </button>
                                        </div>
                                    </div>

                                    <button disabled={loading} type="submit" className="w-full py-6 bg-forest-500 text-white font-black text-lg rounded-3xl hover:bg-forest-700 transition-all shadow-xl shadow-forest-500/20 active:scale-95 flex items-center justify-center gap-3">
                                        {loading ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" /> : <>Sign In <ArrowRight className="w-6 h-6" /></>}
                                    </button>
                                </form>

                                <div className="grid grid-cols-2 gap-4">
                                    <button onClick={() => googleLogin()} className="flex items-center justify-center gap-3 py-4 border-2 border-gray-50 rounded-2xl hover:bg-gray-50 transition-colors font-bold text-gray-600">
                                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" /> Google
                                    </button>
                                    <button onClick={() => alert('Social Auth Coming Soon')} className="flex items-center justify-center gap-3 py-4 border-2 border-gray-50 rounded-2xl hover:bg-gray-50 transition-colors font-bold text-gray-600">
                                        <UserCheck className="w-5 h-5 text-blue-600" /> Social
                                    </button>
                                </div>

                                <p className="text-center text-gray-400 font-medium">
                                    New to the farm? <button onClick={() => setMode('register-role')} className="text-forest-500 font-black border-b-2 border-forest-500/20 hover:border-forest-500 transition-all">Sign Up</button>
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* Secure Recovery Flow */}
                    {mode.startsWith('forgot-') && (
                        <motion.div
                            key="recovery"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white dark:bg-[#121214] rounded-[3rem] shadow-2xl overflow-hidden max-w-md mx-auto w-full border border-gray-100 dark:border-[#27272a]"
                        >
                            <div className="h-48 bg-forest-500 relative flex flex-col items-center justify-center text-white space-y-2 overflow-hidden">
                                <ShieldAlert className="w-12 h-12 relative z-10" />
                                <h3 className="text-2xl font-black relative z-10">Account Recovery</h3>
                            </div>

                            <div className="p-10 space-y-8">
                                {mode === 'forgot-email' && (
                                    <div className="space-y-6">
                                        <p className="text-gray-500 font-medium text-center">Enter your email for a verification code.</p>
                                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-8 py-5 bg-gray-50 border-2 border-gray-50 rounded-2xl outline-none font-bold placeholder:opacity-20" placeholder="Email Address" />
                                        <button onClick={handleSubmit} className="w-full py-5 bg-forest-500 text-white font-black rounded-2xl">Request Code</button>
                                    </div>
                                )}

                                {mode === 'forgot-code' && (
                                    <div className="space-y-8 text-center">
                                        <p className="text-gray-500 font-medium">Enter the 4-digit code sent to {email}.</p>
                                        <div className="flex justify-center gap-4">
                                            {recoveryCode.map((digit, i) => (
                                                <input key={i} maxLength="1" className="w-14 h-16 text-2xl font-black text-center bg-gray-50 border-2 rounded-xl" value={digit} onChange={(e) => {
                                                    const next = [...recoveryCode];
                                                    next[i] = e.target.value;
                                                    setRecoveryCode(next);
                                                }} />
                                            ))}
                                        </div>
                                        <button onClick={handleSubmit} className="w-full py-5 bg-forest-500 text-white font-black rounded-2xl">Verify</button>
                                    </div>
                                )}

                                {mode === 'forgot-password' && (
                                    <div className="space-y-6">
                                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-8 py-5 bg-gray-50 border-2 border-gray-50 rounded-2xl outline-none font-bold placeholder:opacity-20" placeholder="New Password" />
                                        <button onClick={handleSubmit} className="w-full py-5 bg-forest-500 text-white font-black rounded-2xl">Update Password</button>
                                    </div>
                                )}

                                <button onClick={() => setMode('login')} className="flex items-center justify-center gap-2 text-gray-400 font-bold text-sm w-full">
                                    <ChevronLeft className="w-4 h-4" /> Back to Login
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Direct Support & Powered by Interswitch */}
                <div className="mt-12 flex flex-col items-center gap-6">
                    <button onClick={() => setShowSupportModal(true)} className="flex items-center gap-2 text-gray-400 group">
                        <HelpCircle className="w-5 h-5 group-hover:text-harvest-500 transition-colors" />
                        <span className="text-sm font-black uppercase tracking-widest">Need Assistance? Contact Us</span>
                    </button>
                    <div className="flex flex-col items-center gap-2 opacity-40 grayscale hover:opacity-100 transition-all duration-500">
                        <img src="/interswitch.png" alt="Interswitch" className="h-4 object-contain" />
                    </div>
                </div>
            </div>

            {/* Support Modal */}
            <AnimatePresence>
                {showSupportModal && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSupportModal(false)} className="fixed inset-0 bg-forest-900/40 backdrop-blur-sm z-40" />
                        <motion.div
                            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                            className="fixed bottom-0 left-0 right-0 h-[70vh] bg-white dark:bg-[#121214] rounded-t-[4rem] z-50 p-12 shadow-2xl flex flex-col items-center justify-center space-y-8"
                        >
                            <h2 className="text-4xl font-black text-forest-500">Direct Support</h2>
                            <p className="text-gray-500 font-medium text-center max-w-md">Our team is available 24/7. Contact us at 1-800-CERES-VERA or support@ceresvera.com</p>
                            <button onClick={() => setShowSupportModal(false)} className="px-12 py-5 bg-forest-500 text-white font-black rounded-2xl">Close</button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
