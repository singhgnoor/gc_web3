'use client';

import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { getLegBySlug, getCurrentGCYear, calculateHostelLegScore } from '@/lib/data';
import { EventCard } from '@/components/ui';
import { Footer } from '@/components/layout';
import Link from 'next/link';
import { use } from 'react';

interface LegPageProps {
    params: Promise<{ slug: string }>;
}

export default function LegPage({ params }: LegPageProps) {
    const { slug } = use(params);
    const leg = getLegBySlug(slug);
    const gcData = getCurrentGCYear();

    if (!leg) {
        notFound();
    }

    // Calculate leg standings
    const legStandings = gcData.hostels
        .map(hostel => ({
            hostel,
            score: calculateHostelLegScore(hostel.id, leg.id, gcData)
        }))
        .sort((a, b) => b.score - a.score);

    const completedEvents = leg.events.filter(e => e.status === 'completed').length;
    const ongoingEvents = leg.events.filter(e => e.status === 'ongoing').length;

    return (
        <div className="min-h-screen">
            {/* Hero Header */}
            <section
                className="relative py-20 px-6 overflow-hidden"
                style={{
                    background: `linear-gradient(to bottom, ${leg.theme.primary}15, transparent)`
                }}
            >
                {/* Background glow */}
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[120px] opacity-30"
                    style={{ backgroundColor: leg.theme.primary }}
                />

                <div className="relative max-w-6xl mx-auto">
                    {/* Breadcrumb */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-sm text-foreground-muted mb-8"
                    >
                        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                        <span>/</span>
                        <span style={{ color: leg.theme.primary }}>{leg.name}</span>
                    </motion.div>

                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-4"
                                style={{
                                    backgroundColor: `${leg.theme.primary}20`,
                                    color: leg.theme.primary
                                }}
                            >
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: leg.theme.primary }} />
                                {leg.events.length} Events
                            </div>

                            <h1
                                className="text-5xl md:text-6xl font-bold mb-4"
                                style={{ color: leg.theme.primary }}
                            >
                                {leg.name}
                            </h1>

                            <p className="text-lg text-foreground-muted max-w-xl">
                                {completedEvents} completed · {ongoingEvents} ongoing · {leg.events.length - completedEvents - ongoingEvents} upcoming
                            </p>
                        </motion.div>

                        {/* Leg Standings Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="lg:w-80"
                        >
                            <div
                                className="p-5 rounded-xl border bg-background-secondary/80 backdrop-blur-sm"
                                style={{ borderColor: `${leg.theme.primary}40` }}
                            >
                                <h3 className="text-sm font-semibold text-foreground-subtle uppercase tracking-wider mb-4">
                                    {leg.name} Standings
                                </h3>
                                <div className="space-y-3">
                                    {legStandings.slice(0, 3).map((item, index) => (
                                        <div key={item.hostel.id} className="flex items-center gap-3">
                                            <span className={`
                        w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                        ${index === 0 ? 'bg-yellow-500/20 text-yellow-500' :
                                                    index === 1 ? 'bg-zinc-400/20 text-zinc-400' :
                                                        'bg-amber-700/20 text-amber-600'}
                      `}>
                                                {index + 1}
                                            </span>
                                            <div
                                                className="w-2 h-2 rounded-full"
                                                style={{ backgroundColor: item.hostel.color }}
                                            />
                                            <span className="flex-1 text-sm text-foreground truncate">
                                                {item.hostel.name}
                                            </span>
                                            <span className="text-sm font-semibold text-foreground">
                                                {item.score}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Events Grid */}
            <section className="py-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm font-semibold text-foreground-subtle uppercase tracking-wider mb-6"
                    >
                        All Events
                    </motion.h2>

                    <div className="space-y-4">
                        {/* Ongoing Events First */}
                        {leg.events.filter(e => e.status === 'ongoing').map((event, index) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <EventCard
                                    event={event}
                                    hostels={gcData.hostels}
                                    legSlug={leg.slug}
                                />
                            </motion.div>
                        ))}

                        {/* Completed Events */}
                        {leg.events.filter(e => e.status === 'completed').map((event, index) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: (index + ongoingEvents) * 0.05 }}
                            >
                                <EventCard
                                    event={event}
                                    hostels={gcData.hostels}
                                    legSlug={leg.slug}
                                />
                            </motion.div>
                        ))}

                        {/* Upcoming Events */}
                        {leg.events.filter(e => e.status === 'upcoming').map((event, index) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: (index + ongoingEvents + completedEvents) * 0.05 }}
                            >
                                <EventCard
                                    event={event}
                                    hostels={gcData.hostels}
                                    legSlug={leg.slug}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
