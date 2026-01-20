'use client';

import { motion } from 'framer-motion';
import { Score, Hostel } from '@/types';
import { cn } from '@/lib/utils';
import { getOrdinal } from '@/lib/utils';

interface ScoreTableProps {
    scores: Score[];
    hostels: Hostel[];
    legSlug?: 'sports' | 'tech' | 'cult';
    showRank?: boolean;
    compact?: boolean;
}

export default function ScoreTable({
    scores,
    hostels,
    legSlug = 'cult',
    showRank = true,
    compact = false
}: ScoreTableProps) {
    // Sort scores by points descending
    const sortedScores = [...scores].sort((a, b) => b.points - a.points);
    const maxPoints = sortedScores.length > 0 ? sortedScores[0].points : 0;

    return (
        <div className="space-y-2">
            {showRank && <h4 className="text-sm font-semibold text-foreground mb-3">Standings</h4>}
            <div className="space-y-2">
                {sortedScores.map((score, index) => {
                    const hostel = hostels.find(h => h.id === score.hostelId);
                    if (!hostel) return null;

                    const isWinner = index === 0;
                    const percentage = maxPoints > 0 ? (score.points / maxPoints) * 100 : 0;

                    return (
                        <motion.div
                            key={score.hostelId}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={cn(
                                "relative rounded-xl overflow-hidden",
                                compact ? "py-2 px-3" : "py-3 px-4",
                                isWinner
                                    ? "bg-gradient-to-r from-yellow-500/10 to-transparent border border-yellow-500/30"
                                    : "bg-background-tertiary/50 border border-border/50"
                            )}
                        >
                            {/* Progress bar background */}
                            <div
                                className="absolute inset-0 opacity-20 transition-all duration-500"
                                style={{
                                    background: `linear-gradient(90deg, ${hostel.color}40 0%, transparent ${percentage}%)`,
                                }}
                            />

                            {/* Content */}
                            <div className="relative flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    {/* Rank */}
                                    {showRank && (
                                        <span className={cn(
                                            "font-bold tabular-nums",
                                            compact ? "text-sm w-6" : "text-lg w-8",
                                            isWinner ? "text-yellow-500" : "text-foreground-subtle"
                                        )}>
                                            {getOrdinal(index + 1)}
                                        </span>
                                    )}

                                    {/* Hostel Color Dot */}
                                    <div
                                        className={cn(
                                            "rounded-full flex-shrink-0",
                                            compact ? "w-2 h-2" : "w-3 h-3"
                                        )}
                                        style={{ backgroundColor: hostel.color }}
                                    />

                                    {/* Hostel Name */}
                                    <span className={cn(
                                        "font-medium truncate",
                                        compact ? "text-sm" : "text-base",
                                        isWinner ? "text-foreground" : "text-foreground-muted"
                                    )}>
                                        {hostel.name}
                                    </span>

                                    {/* Winner badge */}
                                    {isWinner && (
                                        <span className="text-yellow-500 flex-shrink-0">
                                            <TrophySmallIcon className={compact ? "w-4 h-4" : "w-5 h-5"} />
                                        </span>
                                    )}
                                </div>

                                {/* Points */}
                                <span className={cn(
                                    "font-bold tabular-nums",
                                    compact ? "text-sm" : "text-lg",
                                    isWinner ? "text-yellow-500" : "text-foreground"
                                )}>
                                    {score.points}
                                    <span className="text-foreground-subtle font-normal ml-1 text-xs">pts</span>
                                </span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

function TrophySmallIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 15c3.31 0 6-2.69 6-6V4H6v5c0 3.31 2.69 6 6 6zm-1 2.93V20H8v2h8v-2h-3v-2.07A8.001 8.001 0 0 0 20 10V4h1V2H3v2h1v6a8.001 8.001 0 0 0 7 7.93z" />
        </svg>
    );
}
