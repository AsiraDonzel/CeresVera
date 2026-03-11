import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-[#FAF9F6]">
            <div className="max-w-max mx-auto text-center">
                <main className="sm:flex">
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-6xl font-black text-amber-500 sm:text-7xl"
                    >
                        404
                    </motion.p>
                    <div className="sm:ml-6 sm:border-l sm:border-gray-300 sm:pl-6">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl mb-2">
                                Lost in the Field
                            </h1>
                            <p className="text-lg text-gray-500 font-medium">
                                We couldn't find the page you're looking for. It might have been moved or deleted.
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="mt-8 flex space-x-4 sm:border-l-transparent sm:pl-0"
                        >
                            <Link
                                to="/"
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-bold rounded-full shadow-sm text-white bg-sage-700 hover:bg-sage-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage-500"
                            >
                                Go back home
                            </Link>
                            <Link
                                to="/crops"
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-bold rounded-full text-sage-800 bg-sage-100 hover:bg-sage-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage-500"
                            >
                                Browse Crops
                            </Link>
                        </motion.div>
                    </div>
                </main>
            </div>
        </div>
    );
}
