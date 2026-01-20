'use client';

import { motion } from 'framer-motion';
import { getLeaderboard, getCurrentGCYear } from '@/lib/data';
import { Leaderboard } from '@/components/ui';
import { Footer } from '@/components/layout';
import Link from 'next/link';

export default function ScoreboardPage() {
    const gcData = getCurrentGCYear();
    const leaderboard = getLeaderboard();

    // Calculate leg-wise leaders
    const getLegLeader = (legId: string) => {
        const sorted = [...leaderboard.standings].sort((a, b) => {
            const aScore = a.legScores.find(l => l.legId === legId)?.score || 0;
            const bScore = b.legScores.find(l => l.legId === legId)?.score || 0;
            return bScore - aScore;
        });
        return sorted[0];
    };

    return (
        <div className="min-h-screen">
            {/* Header */}
            <section className="py-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Scoreboard
                        </h1>
                        <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
                            GC {gcData.year} · Real-time standings across all legs
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Leg Leaders */}
            <section className="px-6 pb-12">
                <div className="max-w-6xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm font-semibold text-foreground-subtle uppercase tracking-wider mb-6"
                    >
                        Leg Leaders
                    </motion.h2>

                    <div className="grid md:grid-cols-3 gap-4">
                        {gcData.legs.map((leg, index) => {
                            const leader = getLegLeader(leg.id);
                            const leaderScore = leader?.legScores.find(l => l.legId === leg.id)?.score || 0;

                            return (
                                <motion.div
                                    key={leg.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link href={`/leg/${leg.slug}`}>
                                        <div
                                            className="p-5 rounded-xl border bg-background-secondary hover:border-opacity-100 transition-all duration-300 group"
                                            style={{ borderColor: `${leg.theme.primary}40` }}
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <span
                                                    className="text-sm font-semibold uppercase tracking-wider"
                                                    style={{ color: leg.theme.primary }}
                                                >
                                                    {leg.name}
                                                </span>
                                                <span className="text-xs text-foreground-subtle group-hover:text-foreground-muted transition-colors">
                                                    {leg.events.length} events →
                                                </span>
                                            </div>

                                            {leader && (
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-3 h-3 rounded-full"
                                                        style={{ backgroundColor: leader.hostel.color }}
                                                    />
                                                    <span className="font-semibold text-foreground">
                                                        {leader.hostel.name}
                                                    </span>
                                                    <span className="text-foreground-muted ml-auto font-bold">
                                                        {leaderScore} pts
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Main Leaderboard */}
            <section className="py-12 px-6 bg-background-secondary/30">
                <div className="max-w-4xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm font-semibold text-foreground-subtle uppercase tracking-wider mb-6"
                    >
                        Overall Standings
                    </motion.h2>

                    <Leaderboard
                        standings={leaderboard.standings}
                        showLegBreakdown
                    />
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm font-semibold text-foreground-subtle uppercase tracking-wider mb-6"
                    >
                        Quick Stats
                    </motion.h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard
                            label="Total Events"
                            value={gcData.legs.reduce((sum, leg) => sum + leg.events.length, 0)}
                            delay={0}
                        />
                        <StatCard
                            label="Completed"
                            value={gcData.legs.reduce((sum, leg) => sum + leg.events.filter(e => e.status === 'completed').length, 0)}
                            delay={0.1}
                        />
                        <StatCard
                            label="Ongoing"
                            value={gcData.legs.reduce((sum, leg) => sum + leg.events.filter(e => e.status === 'ongoing').length, 0)}
                            delay={0.2}
                        />
                        <StatCard
                            label="Upcoming"
                            value={gcData.legs.reduce((sum, leg) => sum + leg.events.filter(e => e.status === 'upcoming').length, 0)}
                            delay={0.3}
                        />
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

function StatCard({ label, value, delay }: { label: string; value: number; delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="p-6 rounded-xl border border-border bg-background-secondary text-center"
        >
            <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {value}
            </div>
            <div className="text-sm text-foreground-muted">
                {label}
            </div>
        </motion.div>
    );
}
