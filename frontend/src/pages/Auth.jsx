import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Mail, Lock, User, ArrowRight, UserCheck, Star, AlertCircle, Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Password strength criteria checks
const passwordCriteria = [
    { label: 'At least 8 characters', test: (p) => p.length >= 8 },
    { label: 'Uppercase letter (A-Z)', test: (p) => /[A-Z]/.test(p) },
    { label: 'Lowercase letter (a-z)', test: (p) => /[a-z]/.test(p) },
    { label: 'Number (0-9)', test: (p) => /\d/.test(p) },
    { label: 'Special character (!@#$%...)', test: (p) => /[!@#$%^&*(),.?":{}|<>_\-]/.test(p) },
];

export default function Auth() {
    const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot'
    const [role, setRole] = useState('farmer');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleGoogleSuccess = async (tokenResponse) => {
        setLoading(true);
        setError('');
        try {
            // tokenResponse.access_token is a Google access token, not an ID token
            // We use it to fetch user info and then verify on backend
            const res = await axios.post(`${API_URL}/api/auth/google/`, {
                credential: tokenResponse.access_token,
                token_type: 'access_token',
            });
            localStorage.setItem('access_token', res.data.access);
            localStorage.setItem('refresh_token', res.data.refresh);
            localStorage.setItem('user_role', role);
            navigate(role === 'agronomist' ? '/expert-dashboard' : '/dashboard');
        } catch (err) {
            setError('Google sign-in failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: handleGoogleSuccess,
        onError: () => setError('Google sign-in was cancelled or failed.'),
    });

    const resetForm = () => {
        setEmail(''); setPassword(''); setConfirmPassword(''); setName('');
        setError(''); setShowPassword(false); setShowConfirmPassword(false);
    };

    const switchMode = (newMode) => {
        resetForm();
        setMode(newMode);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Frontend email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address (e.g. name@domain.com).');
            return;
        }

        // Frontend password confirmation check
        if (mode === 'register' && password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        // Frontend password strength check
        if (mode === 'register') {
            const failed = passwordCriteria.find(c => !c.test(password));
            if (failed) {
                setError(`Weak password: ${failed.label}`);
                return;
            }
        }

        setLoading(true);

        // Hash passwords before sending
        const hashedPassword = CryptoJS.SHA256(password).toString();
        const hashedConfirmPassword = mode === 'register' ? CryptoJS.SHA256(confirmPassword).toString() : '';

        try {
            if (mode === 'login') {
                const response = await axios.post(`${API_URL}/api/auth/login/`, {
                    username: email,
                    password: hashedPassword
                });
                localStorage.setItem('access_token', response.data.access);
                localStorage.setItem('refresh_token', response.data.refresh);
                localStorage.setItem('user_role', role);
                navigate(role === 'agronomist' ? '/expert-dashboard' : '/dashboard');

            } else if (mode === 'register') {
                await axios.post(`${API_URL}/api/auth/register/`, {
                    username: email,
                    email,
                    password: hashedPassword,
                    confirm_password: hashedConfirmPassword,
                });
                // Auto-login after registration
                const loginRes = await axios.post(`${API_URL}/api/auth/login/`, {
                    username: email,
                    password: hashedPassword
                });
                localStorage.setItem('access_token', loginRes.data.access);
                localStorage.setItem('refresh_token', loginRes.data.refresh);
                localStorage.setItem('user_role', role);
                navigate(role === 'agronomist' ? '/expert-dashboard' : '/dashboard');

            } else {
                // Forgot password (mock)
                setTimeout(() => {
                    alert('Password reset link sent to ' + email);
                    switchMode('login');
                    setLoading(false);
                }, 1000);
                return;
            }
        } catch (err) {
            const data = err.response?.data;
            if (data) {
                // Handle both array and object error response formats from DRF
                if (typeof data === 'string') {
                    setError(data);
                } else if (data.detail) {
                    setError(data.detail);
                } else {
                    // Flatten DRF field errors
                    const firstKey = Object.keys(data)[0];
                    const firstError = Array.isArray(data[firstKey]) ? data[firstKey][0] : data[firstKey];
                    setError(firstError || 'Something went wrong. Please try again.');
                }
            } else {
                setError('Could not connect to the server. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const variants = {
        enter: { opacity: 0, x: 20 },
        center: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    const passwordStrengthCount = passwordCriteria.filter(c => c.test(password)).length;
    const strengthColors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-lime-400', 'bg-green-500'];
    const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

    return (
        <div className="min-h-screen bg-earth-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute top-0 left-1/4 w-[40rem] h-[40rem] bg-sage-200/50 rounded-full blur-[100px] -z-10 mix-blend-multiply"></div>
            <div className="absolute bottom-0 right-1/4 w-[40rem] h-[40rem] bg-sage-300/30 rounded-full blur-[100px] -z-10 mix-blend-multiply"></div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md mt-8">
                <div className="flex justify-center mb-6">
                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-sage-100">
                        <Leaf className="w-10 h-10 text-sage-700" />
                    </div>
                </div>
                <h2 className="text-center text-3xl font-black text-gray-900 tracking-tight">
                    {mode === 'login' ? 'Welcome back' : mode === 'register' ? 'Create an account' : 'Reset password'}
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    {mode === 'login' && (
                        <>Don't have an account? <button onClick={() => switchMode('register')} className="font-bold text-sage-700 hover:text-sage-900 transition-colors">Sign up</button></>
                    )}
                    {mode === 'register' && (
                        <>Already have an account? <button onClick={() => switchMode('login')} className="font-bold text-sage-700 hover:text-sage-900 transition-colors">Log in</button></>
                    )}
                    {mode === 'forgot' && (
                        <>Remembered? <button onClick={() => switchMode('login')} className="font-bold text-sage-700 hover:text-sage-900 transition-colors">Log in</button></>
                    )}
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-[2.5rem] sm:px-10 border border-white">

                    {/* Role Toggle */}
                    <AnimatePresence>
                        {mode !== 'forgot' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-6"
                            >
                                <div className="text-sm font-bold text-gray-700 mb-3 text-center">
                                    {mode === 'register' ? 'I am joining as a...' : 'I am logging in as a...'}
                                </div>
                                <div className="flex p-1 bg-gray-100 rounded-2xl">
                                    <button onClick={() => setRole('farmer')} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${role === 'farmer' ? 'bg-white text-sage-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                                        <UserCheck className="w-4 h-4" /> Farmer
                                    </button>
                                    <button onClick={() => setRole('agronomist')} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${role === 'agronomist' ? 'bg-white text-sage-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                                        <Star className="w-4 h-4" /> Agronomist
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Error */}
                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    <AnimatePresence mode="wait">
                        <motion.form
                            key={mode}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ type: "spring", stiffness: 300, damping: 24 }}
                            className="space-y-5"
                            onSubmit={handleSubmit}
                        >
                            {/* Full Name (register only) */}
                            {mode === 'register' && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">Full Name</label>
                                    <div className="mt-1 relative rounded-xl shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input id="name" type="text" required value={name} onChange={e => setName(e.target.value)} className="block w-full pl-11 pr-4 py-3.5 border-gray-200 bg-gray-50 border focus:bg-white focus:ring-2 focus:ring-sage-500 focus:border-sage-500 rounded-xl transition-colors sm:text-sm outline-none text-gray-900 font-medium placeholder-gray-400/60" placeholder="Oluwakemi Adebayo" />
                                    </div>
                                </div>
                            )}

                            {/* Email */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">Email address</label>
                                <div className="mt-1 relative rounded-xl shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} className="block w-full pl-11 pr-4 py-3.5 border-gray-200 bg-gray-50 border focus:bg-white focus:ring-2 focus:ring-sage-500 focus:border-sage-500 rounded-xl transition-colors sm:text-sm outline-none text-gray-900 font-medium placeholder-gray-400/60" placeholder="you@example.com" />
                                </div>
                            </div>

                            {/* Password */}
                            {mode !== 'forgot' && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">Password</label>
                                    <div className="mt-1 relative rounded-xl shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input id="password" type={showPassword ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} className="block w-full pl-11 pr-12 py-3.5 border-gray-200 bg-gray-50 border focus:bg-white focus:ring-2 focus:ring-sage-500 focus:border-sage-500 rounded-xl transition-colors sm:text-sm outline-none text-gray-900 font-medium placeholder-gray-400/60" placeholder="••••••••" />
                                        <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600">
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>

                                    {/* Password strength indicator – register only */}
                                    {mode === 'register' && password.length > 0 && (
                                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-3 space-y-2">
                                            {/* Strength bar */}
                                            <div className="flex gap-1">
                                                {passwordCriteria.map((_, i) => (
                                                    <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i < passwordStrengthCount ? strengthColors[passwordStrengthCount - 1] : 'bg-gray-200'}`} />
                                                ))}
                                            </div>
                                            <p className={`text-xs font-bold ${passwordStrengthCount < 3 ? 'text-red-500' : passwordStrengthCount < 5 ? 'text-yellow-600' : 'text-green-600'}`}>
                                                {strengthLabels[passwordStrengthCount - 1] || 'Enter a password'}
                                            </p>
                                            {/* Criteria checklist */}
                                            <div className="grid grid-cols-1 gap-1 pt-1">
                                                {passwordCriteria.map((c, i) => (
                                                    <div key={i} className={`flex items-center gap-2 text-xs transition-colors ${c.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
                                                        {c.test(password)
                                                            ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                                                            : <XCircle className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                                                        }
                                                        {c.label}
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            )}

                            {/* Confirm Password (register only) */}
                            {mode === 'register' && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">Confirm Password</label>
                                    <div className="mt-1 relative rounded-xl shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input id="confirm_password" type={showConfirmPassword ? 'text' : 'password'} required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={`block w-full pl-11 pr-12 py-3.5 border bg-gray-50 focus:bg-white focus:ring-2 rounded-xl transition-colors sm:text-sm outline-none text-gray-900 font-medium placeholder-gray-400/60 ${confirmPassword.length > 0 && confirmPassword !== password ? 'border-red-300 focus:ring-red-400' : 'border-gray-200 focus:ring-sage-500 focus:border-sage-500'}`} placeholder="••••••••" />
                                        <button type="button" onClick={() => setShowConfirmPassword(v => !v)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600">
                                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    {confirmPassword.length > 0 && confirmPassword !== password && (
                                        <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                                            <XCircle className="w-3.5 h-3.5" /> Passwords do not match
                                        </p>
                                    )}
                                    {confirmPassword.length > 0 && confirmPassword === password && (
                                        <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">
                                            <CheckCircle2 className="w-3.5 h-3.5" /> Passwords match
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Forgot password link (login only) */}
                            {mode === 'login' && (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-sage-600 focus:ring-sage-500 border-gray-300 rounded" />
                                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">Remember me</label>
                                    </div>
                                    <button type="button" onClick={() => switchMode('forgot')} className="text-sm font-bold text-sage-700 hover:text-sage-900 transition-colors">Forgot password?</button>
                                </div>
                            )}

                            {/* Submit */}
                            <div className="pt-2">
                                <button
                                    disabled={loading}
                                    type="submit"
                                    className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-sage-700 hover:bg-sage-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage-500 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...
                                        </div>
                                    ) : (
                                        <>
                                            {mode === 'login' ? 'Sign in' : mode === 'register' ? 'Create Account' : 'Send Reset Link'}
                                            {mode !== 'forgot' && <ArrowRight className="w-4 h-4" />}
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.form>
                    </AnimatePresence>

                    {/* Social Logins */}
                    {mode !== 'forgot' && (
                        <div className="mt-8">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500 font-medium text-xs uppercase tracking-widest">Or continue with</span>
                                </div>
                            </div>
                            <div className="mt-6 grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => googleLogin()}
                                    className="w-full inline-flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-sm bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <img className="w-5 h-5" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
                                    Google
                                </button>
                                <button
                                    type="button"
                                    onClick={() => alert('Facebook OAuth credentials not yet configured. Please contact the admin.')}
                                    className="w-full inline-flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-sm bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                    Facebook
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Interswitch Trust Badge */}
                    <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col items-center gap-2">
                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Secure payments powered by</p>
                        <img src="/interswitch.png" alt="Interswitch" className="h-5 object-contain opacity-50 grayscale hover:opacity-80 hover:grayscale-0 transition-all duration-300" />
                    </div>

                </div>
            </div>
        </div>
    );
}
