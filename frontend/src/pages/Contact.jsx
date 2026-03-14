import { useRef, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Sparkles, Loader } from '@react-three/drei';
import { Mail, Phone, MapPin, Send, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

// 3D Spinning Flower Pot Component
function FlowerPot() {
    const groupRef = useRef();

    useFrame((state) => {
        if (groupRef.current) {
            // Gentle continuous rotation
            groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.4;
            // Slight sway
            groupRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.8) * 0.05;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={1}>
            <group ref={groupRef} position={[0, -1, 0]} scale={0.8}>
                {/* Pot Base */}
                <mesh position={[0, 0, 0]}>
                    <cylinderGeometry args={[1.2, 0.9, 1.5, 32]} />
                    <meshStandardMaterial color="#c0734a" roughness={0.7} />
                </mesh>
                
                {/* Pot Rim */}
                <mesh position={[0, 0.8, 0]}>
                    <torusGeometry args={[1.25, 0.15, 16, 64]} />
                    <meshStandardMaterial color="#a65d38" roughness={0.7} />
                </mesh>

                {/* Soil */}
                <mesh position={[0, 0.7, 0]} rotation={[-Math.PI/2, 0, 0]}>
                    <circleGeometry args={[1.15, 32]} />
                    <meshStandardMaterial color="#3d2817" roughness={0.9} />
                </mesh>

                {/* Main Stem */}
                <mesh position={[0, 1.5, 0]}>
                    <cylinderGeometry args={[0.08, 0.12, 1.6, 8]} />
                    <meshStandardMaterial color="#4b6b55" roughness={0.4} />
                </mesh>

                {/* Leaf 1 */}
                <mesh position={[0.4, 1.2, 0.2]} rotation={[0, 0, -0.5]}>
                    <sphereGeometry args={[0.3, 16, 16]} />
                    <meshStandardMaterial color="#5a8b66" />
                </mesh>

                {/* Leaf 2 */}
                <mesh position={[-0.4, 1.6, -0.2]} rotation={[0, 0, 0.5]}>
                    <sphereGeometry args={[0.25, 16, 16]} />
                    <meshStandardMaterial color="#3f5a48" />
                </mesh>

                {/* Flower Center */}
                <mesh position={[0, 2.3, 0]}>
                    <sphereGeometry args={[0.3, 16, 16]} />
                    <meshStandardMaterial color="#fbbf24" emissive="#d97706" emissiveIntensity={0.2} />
                </mesh>

                {/* Petals */}
                {[0, 1, 2, 3, 4, 5].map((i) => (
                    <mesh 
                        key={i} 
                        position={[
                            Math.cos((i * Math.PI) / 3) * 0.4, 
                            2.3, 
                            Math.sin((i * Math.PI) / 3) * 0.4
                        ]}
                    >
                        <sphereGeometry args={[0.2, 16, 16]} />
                        <meshStandardMaterial color="#fcd34d" />
                    </mesh>
                ))}
            </group>
            
            {/* Sparkles around the plant */}
            <Sparkles count={40} scale={4} size={2} speed={0.2} opacity={0.6} color="#fbbf24" position={[0, 1, 0]} />
        </Float>
    );
}

export default function Contact() {
    const [formState, setFormState] = useState('idle'); // idle, submitting, success

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormState('submitting');
        // Simulate API call
        setTimeout(() => setFormState('success'), 1500);
    };

    return (
        <div className="relative min-h-[90vh] bg-[#FAF9F6] overflow-hidden flex items-center font-sans">

            {/* Absolute 3D Canvas Background (Right Aligned on Desktop) */}
            <div className="absolute inset-0 lg:left-1/3 z-0 min-h-[500px]">
                <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Truth Engine...</div>}>
                    <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 2]}>
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[10, 10, 5]} intensity={1.5} />
                        <directionalLight position={[-10, -10, -5]} color="#d97706" intensity={1} />
                        <FlowerPot />
                        <Environment preset="city" />
                        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
                    </Canvas>
                </Suspense>

                {/* Gradient overlay to blend canvas into background color */}
                <Link to="/" className="absolute top-8 left-8 z-20 flex items-center gap-2 text-gray-400 hover:text-sage-700 font-bold transition-all group pointer-events-auto">
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>
                <div className="absolute inset-0 bg-gradient-to-r from-[#FAF9F6] via-[#FAF9F6]/80 lg:via-transparent to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F6] via-transparent to-transparent pointer-events-none h-32 bottom-0" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 py-12 lg:py-24">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">

                    {/* Left Column - Contact Form & Details */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="lg:col-span-5 space-y-10"
                    >
                        <div>
                            <h1 className="text-4xl sm:text-6xl font-black text-[#0F172A] tracking-tight mb-4">
                                Get in touch
                            </h1>
                            <p className="text-lg text-gray-600 font-medium">
                                Have questions about our models or want to join the Expert Marketplace? We'd love to hear from you.
                            </p>
                        </div>

                        {/* Glassmorphic Form Card */}
                        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-white/50 relative overflow-hidden">

                            {/* Success State Overlay */}
                            <motion.div
                                initial={false}
                                animate={{ opacity: formState === 'success' ? 1 : 0, scale: formState === 'success' ? 1 : 0.9 }}
                                className={`absolute inset-0 bg-sage-600 z-20 flex flex-col items-center justify-center text-white p-8 pointer-events-none ${formState === 'success' ? 'pointer-events-auto' : ''}`}
                            >
                                <CheckCircle2 className="w-20 h-20 text-white mb-6" />
                                <h3 className="text-2xl font-bold mb-2 text-center">Message Sent!</h3>
                                <p className="text-sage-100 text-center font-medium">We'll be in touch with you shortly regarding the Truth of the Harvest.</p>
                            </motion.div>

                            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="name" className="sr-only">Full Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            required
                                            disabled={formState !== 'idle'}
                                            placeholder="Your Name"
                                            className="w-full bg-gray-50/50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="sr-only">Email Address</label>
                                        <input
                                            type="email"
                                            id="email"
                                            required
                                            disabled={formState !== 'idle'}
                                            placeholder="Email Address"
                                            className="w-full bg-gray-50/50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="message" className="sr-only">Message</label>
                                        <textarea
                                            id="message"
                                            rows="4"
                                            required
                                            disabled={formState !== 'idle'}
                                            placeholder="How can we help you?"
                                            className="w-full bg-gray-50/50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all font-medium resize-none"
                                        ></textarea>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={formState !== 'idle'}
                                    className="w-full bg-[#0F172A] hover:bg-gray-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-gray-900/20 active:scale-95 flex justify-center items-center gap-2 group disabled:opacity-70 disabled:active:scale-100"
                                >
                                    {formState === 'submitting' ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>Send Message <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>

                    {/* Right Column (Floating Overlay Details on Desktop) */}
                    <div className="lg:col-span-4 lg:col-start-8 xl:col-start-9 space-y-8 pointer-events-none relative z-10">
                        {/* We use pointer-events-auto on the children so the canvas underneath is still somewhat grabbable */}

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white flex items-center gap-5 pointer-events-auto w-max ml-auto lg:mr-0 mr-auto"
                        >
                            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center shrink-0">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">Headquarters</h4>
                                <p className="text-sm font-medium text-gray-500">Innovation Hub, Nigeria</p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white flex items-center gap-5 pointer-events-auto w-max ml-auto lg:mr-8 mr-auto"
                        >
                            <div className="w-12 h-12 bg-sage-100 text-sage-600 rounded-full flex items-center justify-center shrink-0">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">Email Us</h4>
                                <p className="text-sm font-medium text-gray-500">hello@ceresvera.com</p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white flex items-center gap-5 pointer-events-auto w-max ml-auto lg:mr-16 mr-auto"
                        >
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                                <Phone className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">Call Us</h4>
                                <p className="text-sm font-medium text-gray-500">+254 700 000 000</p>
                            </div>
                        </motion.div>

                    </div>

                </div>
            </div>
        </div>
    );
}
