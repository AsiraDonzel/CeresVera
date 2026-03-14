import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();

    const themes = [
        { id: 'light', icon: <Sun className="w-4 h-4" />, label: 'Light' },
        { id: 'dark', icon: <Moon className="w-4 h-4" />, label: 'Dark' },
        { id: 'system', icon: <Monitor className="w-4 h-4" />, label: 'System' }
    ];

    return (
        <div className="flex items-center bg-app-surface border border-app-border p-1 rounded-full shadow-sm">
            {themes.map((t) => (
                <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`relative p-2 rounded-full transition-colors group ${
                        theme === t.id 
                            ? 'text-sage-600' 
                            : 'text-app-muted hover:text-app-text'
                    }`}
                    title={`${t.label} Mode`}
                >
                    {theme === t.id && (
                        <motion.div
                            layoutId="activeTheme"
                            className="absolute inset-0 bg-white dark:bg-harvest-900/20 rounded-full shadow-sm"
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                    )}
                    <div className="relative z-10">
                        {t.icon}
                    </div>
                </button>
            ))}
        </div>
    );
};

export default ThemeToggle;
