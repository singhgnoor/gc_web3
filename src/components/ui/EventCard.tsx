'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Event, Hostel } from '@/types';
import { cn } from '@/lib/utils';
import ScoreTable from './ScoreTable';

interface EventCardProps {
    event: Event;
    hostels: Hostel[];
    legSlug: 'sports' | 'tech' | 'cult';
}

const legStyles = {
    sports: {
        gradient: 'from-orange-500/20 to-orange-600/5',
        border: 'border-orange-500/30',
        glow: 'hover:shadow-[0_0_30px_rgba(249,115,22,0.2)]',
        accent: 'text-orange-500',
        badge: 'bg-orange-500/20 text-orange-400',
    },
    tech: {
        gradient: 'from-blue-500/20 to-blue-600/5',
        border: 'border-blue-500/30',
        glow: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]',
        accent: 'text-blue-500',
        badge: 'bg-blue-500/20 text-blue-400',
    },
    cult: {
        gradient: 'from-purple-500/20 to-purple-600/5',
        border: 'border-purple-500/30',
        glow: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]',
        accent: 'text-purple-500',
        badge: 'bg-purple-500/20 text-purple-400',
    },
};

export default function EventCard({ event, hostels, legSlug }: EventCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const styles = legStyles[legSlug];

    const totalPoints = event.scores.reduce((sum, s) => sum + s.points, 0);
    const maxScore = event.scores.length > 0
        ? Math.max(...event.scores.map(s => s.points))
        : 0;
    const winner = event.scores.find(s => s.points === maxScore);
    const winnerHostel = winner ? hostels.find(h => h.id === winner.hostelId) : null;

    const statusColors = {
        upcoming: 'bg-foreground-subtle/20 text-foreground-subtle',
        ongoing: 'bg-green-500/20 text-green-400',
        completed: 'bg-foreground-muted/20 text-foreground-muted',
    };

    return (
        <motion.div
            layout
            className={cn(
                "relative rounded-2xl border bg-background-secondary overflow-hidden transition-all duration-300 cursor-pointer",
                styles.border,
                styles.glow,
                isExpanded && "border-opacity-100"
            )}
            onClick={() => setIsExpanded(!isExpanded)}
        >
            {/* Gradient overlay */}
            <div className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-50 pointer-events-none",
                styles.gradient
            )} />

            {/* Card Content */}
            <div className="relative z-10">
                {/* Collapsed View */}
                <div className="p-5">
                    <div className="flex items-start gap-4">
                        {/* Event Image Placeholder */}
                        <div className={cn(
                            "w-16 h-16 rounded-xl bg-background-tertiary flex items-center justify-center flex-shrink-0 border",
                            styles.border
                        )}>
                            <EventIcon className={cn("w-8 h-8", styles.accent)} />
                        </div>

                        {/* Event Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                                <h3 className="text-lg font-semibold text-foreground truncate">
                                    {event.name}
                                </h3>
                                <span className={cn(
                                    "text-xs px-2 py-1 rounded-full flex-shrink-0 font-medium capitalize",
                                    statusColors[event.status]
                                )}>
                                    {event.status}
                                </span>
                            </div>

                            <div className="flex items-center gap-4 mt-2">
                                <span className="text-sm text-foreground-muted">
                                    Max: <span className="font-semibold text-foreground">{event.maxPoints}</span> pts
                                </span>
                                {winnerHostel && event.status === 'completed' && (
                                    <span className="text-sm text-foreground-muted flex items-center gap-1">
                                        <TrophyIcon className="w-4 h-4 text-yellow-500" />
                                        <span className="font-medium" style={{ color: winnerHostel.color }}>
                                            {winnerHostel.abbreviation}
                                        </span>
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Expand Icon */}
                        <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-foreground-subtle flex-shrink-0"
                        >
                            <ChevronIcon className="w-5 h-5" />
                        </motion.div>
                    </div>
                </div>

                {/* Expanded View */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                            className="overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="px-5 pb-5 border-t border-border/50 pt-4">
                                {/* Description */}
                                <p className="text-sm text-foreground-muted mb-4">
                                    {event.description}
                                </p>

                                {/* Rules */}
                                {event.rules.length > 0 && (
                                    <div className="mb-4">
                                        <h4 className="text-sm font-semibold text-foreground mb-2">Rules</h4>
                                        <ul className="space-y-1">
                                            {event.rules.map((rule, index) => (
                                                <li key={index} className="text-sm text-foreground-muted flex items-start gap-2">
                                                    <span className={cn("mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0", styles.badge.split(' ')[0])} />
                                                    {rule}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Score Table */}
                                {event.scores.length > 0 ? (
                                    <ScoreTable
                                        scores={event.scores}
                                        hostels={hostels}
                                        legSlug={legSlug}
                                        showRank={true}
                                    />
                                ) : (
                                    <div className={cn(
                                        "text-center py-6 rounded-xl border",
                                        styles.border,
                                        "bg-background-tertiary/50"
                                    )}>
                                        <p className="text-foreground-subtle text-sm">
                                            Scores will be updated after the event
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

function EventIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    );
}

function ChevronIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6,9 12,15 18,9" />
        </svg>
    );
}

function TrophyIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 6v3m0 0v3m0-3h3m-3 0H9m12-3a2 2 0 0 1-2 2h-.5a.5.5 0 0 0-.5.5V9a6 6 0 0 1-5 5.92V17h2a2 2 0 0 1 2 2v1H7v-1a2 2 0 0 1 2-2h2v-2.08A6 6 0 0 1 6 9V6.5a.5.5 0 0 0-.5-.5H5a2 2 0 0 1-2-2V3h4v2a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V3h4v1z" />
        </svg>
    );
}
