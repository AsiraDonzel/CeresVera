import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, CheckCircle, AlertTriangle, ArrowRight, Loader, Camera, MessageSquare } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function ScanUpload() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [result, setResult] = useState(null);

    const handleDrag = (e) => { e.preventDefault(); e.stopPropagation(); };

    const handleDrop = (e) => {
        e.preventDefault(); e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileInput = (e) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    const processFile = (file) => {
        setFile(file);
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target.result);
        reader.readAsDataURL(file);
        setResult(null);
    };


    const performScan = async () => {
        if (!file) return;
        setIsScanning(true);

        const formData = new FormData();
        formData.append('image', file);

        try {
            const token = localStorage.getItem('access_token');
            const headers = { 'Content-Type': 'multipart/form-data' };

            // If the user happens to skip login and tests the scanner directly, it's still OK
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            let response;
            try {
                response = await axios.post('http://localhost:8080/api/upload-scan/', formData, { headers });
            } catch (authErr) {
                // If DRF throws a 401 Unauthorized due to an expired token, we retry anonymously
                if (authErr.response && authErr.response.status === 401) {
                    console.log("Token expired, retrying anonymously.");
                    delete headers['Authorization'];
                    response = await axios.post('http://localhost:8080/api/upload-scan/', formData, { headers });
                } else {
                    throw authErr;
                }
            }

            const data = response.data;
            const isHealthy = data.disease_name && data.disease_name.toLowerCase().includes('healthy');

            const scanResult = {
                disease_name: data.disease_name,
                confidence: data.confidence,
                description: data.description,
                recommended_action: data.recommended_action,
                isHealthy: isHealthy
            };

            setResult(scanResult);
        } catch (error) {
            console.error("AI Scan Error:", error);
            setResult({
                disease_name: 'Analysis Failed',
                confidence: 0,
                description: 'The secure connection to the AI could not be established or the image was unreadable.',
                recommended_action: 'Please check your internet connection and try reloading the image.',
                isHealthy: false
            });
        } finally {
            setIsScanning(false);
        }
    };

    return (
        <div className="p-8 space-y-8 bg-app-subtle min-h-full">

            <div className="bg-app-card rounded-3xl p-8 shadow-sm border border-app-border">
                {!preview ? (
                    <div
                        onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                        className="border-2 border-dashed border-app-border rounded-2xl p-16 text-center hover:bg-app-accent-subtle transition-colors cursor-pointer flex flex-col items-center justify-center"
                        onClick={() => document.getElementById('file-upload').click()}
                    >
                        <div className="p-4 bg-earth-100 text-earth-700 rounded-full mb-4 group-hover:scale-110 transition-transform">
                            <UploadCloud className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-black text-app-text mb-2">Drag & drop an image</h3>
                        <p className="text-gray-500 font-medium mb-8">or use your camera for instant detection</p>
                        
                        <div className="flex gap-4">
                            <input type="file" id="file-upload" className="hidden" accept="image/png, image/jpeg" onChange={handleFileInput} />
                            <input type="file" id="camera-upload" className="hidden" accept="image/*" capture="environment" onChange={handleFileInput} />
                            
                            <button 
                                onClick={(e) => { e.stopPropagation(); document.getElementById('camera-upload').click(); }}
                                className="px-8 py-3 bg-sage-700 text-white rounded-xl font-bold shadow-lg shadow-sage-700/20 flex items-center gap-2 hover:bg-sage-800 transition-all"
                            >
                                <Camera className="w-5 h-5" /> Open Camera
                            </button>
                            
                            <button 
                                onClick={(e) => { e.stopPropagation(); document.getElementById('file-upload').click(); }}
                                className="px-8 py-3 bg-white border border-sage-200 text-sage-800 rounded-xl font-bold shadow-sm hover:bg-sage-50 transition-all"
                            >
                                Browse Files
                            </button>
                        </div>
                        
                        <div className="mt-8 pt-8 border-t border-app-border w-full flex flex-col items-center">
                            <p className="text-sm text-app-text-muted mb-4">Need more AI insight instead?</p>
                            <Link to="/chat" className="flex items-center gap-2 text-sage-700 dark:text-sage-400 font-bold hover:text-sage-900 transition-colors">
                                <MessageSquare className="w-4 h-4" /> Ask Cera AI Assistant <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-video flex items-center justify-center">
                            <img src={preview} alt="Plant preview" className="max-h-full object-contain" />

                            {/* Shimmer Effect overlay when scanning */}
                            {isScanning && (
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="absolute inset-0 bg-sage-900/40 backdrop-blur-sm flex flex-col items-center justify-center text-white"
                                >
                                    <Loader className="w-12 h-12 animate-spin mb-4" />
                                    <p className="text-lg font-medium animate-pulse">AI is analyzing patterns...</p>

                                    {/* Scanner line animation */}
                                    <motion.div
                                        animate={{ top: ['0%', '100%', '0%'] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                        className="absolute left-0 right-0 h-1 bg-sage-300 shadow-[0_0_15px_rgba(181,199,186,0.8)] z-10"
                                    />
                                </motion.div>
                            )}
                        </div>

                        {!result && !isScanning && (
                            <div className="flex justify-between items-center bg-app-subtle p-4 rounded-xl mt-4">
                                <button onClick={() => setPreview(null)} className="text-app-text-muted font-medium px-4 py-2 hover:bg-app-card rounded-lg transition-colors">
                                    Choose different image
                                </button>
                                <button onClick={performScan} className="bg-sage-700 text-white px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                                    Start Analysis
                                </button>
                            </div>
                        )}

                        {/* Results Panel */}
                        <AnimatePresence>
                            {result && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                    className="bg-app-card border-2 border-app-border p-6 rounded-2xl shadow-sm"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-full ${result.isHealthy ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {result.isHealthy ? <CheckCircle className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-2xl font-bold text-app-text">{result.disease_name}</h3>
                                                    <p className="text-app-text-muted mt-1">{result.description}</p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm text-gray-500 font-medium">Confidence</div>
                                                    <div className="text-xl font-bold text-sage-700">{Math.round(result.confidence)}%</div>
                                                </div>
                                            </div>

                                            <div className="mt-6 p-4 bg-app-subtle rounded-xl border border-app-border">
                                                <h4 className="font-semibold text-app-text mb-2">Recommended Action</h4>
                                                <p className="text-app-text-muted">{result.recommended_action}</p>
                                            </div>

                                            <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
                                                <button
                                                    onClick={() => {
                                                        setResult(null);
                                                        setPreview(null);
                                                        setFile(null);
                                                        setTimeout(() => document.getElementById('camera-upload')?.click(), 100);
                                                    }}
                                                    className="inline-flex items-center justify-center bg-app-card border-2 border-app-border text-sage-700 dark:text-sage-400 px-6 py-3 rounded-xl font-bold hover:bg-app-accent-subtle transition-all flex items-center gap-2"
                                                >
                                                    <Camera className="w-4 h-4" /> Open Camera
                                                </button>
                                                <Link 
                                                    to="/chat" 
                                                    className="inline-flex items-center justify-center bg-app-card border-2 border-app-border text-sage-700 dark:text-sage-400 px-6 py-3 rounded-xl font-bold hover:bg-app-accent-subtle transition-all flex items-center gap-2"
                                                >
                                                    <MessageSquare className="w-4 h-4" /> Ask Cera AI
                                                </Link>
                                                <Link to="/consultants" className="inline-flex justify-center items-center gap-2 bg-sage-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-sage-700/20 hover:bg-sage-900 transition-all">
                                                    Consult Expert <ArrowRight className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
