'use client';

import { motion } from 'framer-motion';
import { getCurrentGCYear } from '@/lib/data';
import { Footer } from '@/components/layout';

export default function GalleryPage() {
    const gcData = getCurrentGCYear();

    // Generate placeholder images for demonstration
    const placeholderImages = [
        { id: 1, aspect: 'tall', leg: 'sports' },
        { id: 2, aspect: 'wide', leg: 'tech' },
        { id: 3, aspect: 'square', leg: 'cult' },
        { id: 4, aspect: 'square', leg: 'sports' },
        { id: 5, aspect: 'tall', leg: 'tech' },
        { id: 6, aspect: 'wide', leg: 'cult' },
        { id: 7, aspect: 'square', leg: 'sports' },
        { id: 8, aspect: 'tall', leg: 'tech' },
        { id: 9, aspect: 'square', leg: 'cult' },
    ];

    const legColors = {
        sports: '#f97316',
        tech: '#3b82f6',
        cult: '#a855f7',
    };

    return (
        <div className="min-h-screen">
            {/* Header */}
            <section className="py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Gallery
                        </h1>
                        <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
                            Moments captured from GC {gcData.year}. The memories that define our championship.
                        </p>
                    </motion.div>

                    {/* Filter Tabs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-center justify-center gap-2 mt-8"
                    >
                        <button className="px-4 py-2 rounded-full text-sm font-medium bg-foreground text-background">
                            All
                        </button>
                        <button className="px-4 py-2 rounded-full text-sm font-medium text-foreground-muted hover:text-foreground hover:bg-background-secondary transition-colors">
                            Sports
                        </button>
                        <button className="px-4 py-2 rounded-full text-sm font-medium text-foreground-muted hover:text-foreground hover:bg-background-secondary transition-colors">
                            Tech
                        </button>
                        <button className="px-4 py-2 rounded-full text-sm font-medium text-foreground-muted hover:text-foreground hover:bg-background-secondary transition-colors">
                            Cultural
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Masonry Grid */}
            <section className="px-6 pb-20">
                <div className="max-w-6xl mx-auto">
                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                        {placeholderImages.map((img, index) => {
                            const heights = {
                                tall: 'h-80',
                                wide: 'h-48',
                                square: 'h-64',
                            };

                            return (
                                <motion.div
                                    key={img.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`
                    ${heights[img.aspect as keyof typeof heights]}
                    relative rounded-2xl overflow-hidden border border-border 
                    bg-background-secondary group cursor-pointer break-inside-avoid
                  `}
                                >
                                    {/* Placeholder gradient */}
                                    <div
                                        className="absolute inset-0 opacity-30"
                                        style={{
                                            background: `linear-gradient(135deg, ${legColors[img.leg as keyof typeof legColors]}40, transparent)`
                                        }}
                                    />

                                    {/* Placeholder icon */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div
                                            className="w-16 h-16 rounded-full flex items-center justify-center opacity-40"
                                            style={{ backgroundColor: legColors[img.leg as keyof typeof legColors] + '30' }}
                                        >
                                            <ImageIcon
                                                className="w-8 h-8"
                                                style={{ color: legColors[img.leg as keyof typeof legColors] }}
                                            />
                                        </div>
                                    </div>

                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="text-center p-4">
                                            <p className="text-sm text-foreground-muted mb-1">
                                                GC {gcData.year}
                                            </p>
                                            <p className="font-medium text-foreground capitalize">
                                                {img.leg} Event
                                            </p>
                                        </div>
                                    </div>

                                    {/* Leg badge */}
                                    <div
                                        className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium"
                                        style={{
                                            backgroundColor: legColors[img.leg as keyof typeof legColors] + '30',
                                            color: legColors[img.leg as keyof typeof legColors]
                                        }}
                                    >
                                        {img.leg}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Coming Soon Note */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-center mt-12 py-8 border border-dashed border-border rounded-2xl"
                    >
                        <p className="text-foreground-muted">
                            More photos will be added as events conclude.
                        </p>
                        <p className="text-sm text-foreground-subtle mt-1">
                            Stay tuned for the best moments of GC {gcData.year}!
                        </p>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

function ImageIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
    return (
        <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21,15 16,10 5,21" />
        </svg>
    );
}
