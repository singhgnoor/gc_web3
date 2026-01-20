'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Footer } from '@/components/layout';

const siteLinks = [
    {
        category: 'Main Pages',
        links: [
            { href: '/', label: 'Home', description: 'Landing page with overview and current standings' },
            { href: '/scoreboard', label: 'Scoreboard', description: 'Complete GC standings and statistics' },
            { href: '/gallery', label: 'Gallery', description: 'Photo gallery from GC events' },
            { href: '/about', label: 'About', description: 'Learn about the General Championship' },
            { href: '/contact', label: 'Contact', description: 'Get in touch with the GC team' },
        ]
    },
    {
        category: 'Leg Pages',
        links: [
            { href: '/leg/sports', label: 'Sports', description: 'All sports events and scores' },
            { href: '/leg/tech', label: 'Tech', description: 'Technology and coding events' },
            { href: '/leg/cult', label: 'Cultural', description: 'Cultural and arts events' },
        ]
    },
    {
        category: 'Admin',
        links: [
            { href: '/admin', label: 'Admin Panel', description: 'Manage GC data (restricted access)' },
        ]
    }
];

export default function SitemapPage() {
    return (
        <div className="min-h-screen">
            {/* Header */}
            <section className="py-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-foreground mb-4"
                    >
                        Sitemap
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-foreground-muted"
                    >
                        A complete overview of all pages on the GC platform.
                    </motion.p>
                </div>
            </section>

            {/* Links */}
            <section className="px-6 pb-20">
                <div className="max-w-4xl mx-auto space-y-12">
                    {siteLinks.map((section, sectionIndex) => (
                        <motion.div
                            key={section.category}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: sectionIndex * 0.1 }}
                        >
                            <h2 className="text-sm font-semibold text-foreground-subtle uppercase tracking-wider mb-4">
                                {section.category}
                            </h2>

                            <div className="grid gap-3">
                                {section.links.map((link, linkIndex) => (
                                    <motion.div
                                        key={link.href}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: sectionIndex * 0.1 + linkIndex * 0.05 }}
                                    >
                                        <Link
                                            href={link.href}
                                            className="group flex items-center justify-between p-4 rounded-xl border border-border bg-background-secondary hover:border-cult/50 hover:bg-background-tertiary transition-all duration-200"
                                        >
                                            <div>
                                                <h3 className="font-medium text-foreground group-hover:text-cult transition-colors">
                                                    {link.label}
                                                </h3>
                                                <p className="text-sm text-foreground-muted mt-1">
                                                    {link.description}
                                                </p>
                                            </div>
                                            <ArrowIcon className="w-5 h-5 text-foreground-subtle group-hover:text-cult group-hover:translate-x-1 transition-all" />
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
}

function ArrowIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12,5 19,12 12,19" />
        </svg>
    );
}
