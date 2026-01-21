'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useGC } from '@/context/GCContext';

export function GCYearSelector() {
    const { years, currentYear, switchYear, loading } = useGC();
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (years.length === 0) return null;

    const handleSelect = (year: number) => {
        switchYear(year);
        setIsOpen(false);
    };

    return (
        <div ref={ref} className="relative inline-flex">
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={loading}
                className={`
          inline-flex items-center gap-2 px-4 py-2 rounded-full
          border border-border bg-background-secondary/80 backdrop-blur-sm
          text-sm font-medium text-foreground
          hover:bg-background-tertiary transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
            >
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>GC {currentYear}</span>
                <ChevronIcon className={`w-4 h-4 text-foreground-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-2 min-w-[120px] bg-background-secondary border border-border rounded-xl overflow-hidden shadow-xl z-50"
                    >
                        {years.map((year) => (
                            <button
                                key={year}
                                onClick={() => handleSelect(year)}
                                className={`
                  w-full px-4 py-2.5 text-left text-sm font-medium transition-colors
                  ${year === currentYear
                                        ? 'bg-cult/10 text-cult'
                                        : 'text-foreground hover:bg-background-tertiary'
                                    }
                `}
                            >
                                <span className="flex items-center gap-2">
                                    {year === currentYear && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-cult" />
                                    )}
                                    GC {year}
                                </span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function ChevronIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6,9 12,15 18,9" />
        </svg>
    );
}
