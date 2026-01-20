'use client';

import { motion } from 'framer-motion';
import { HostelScore } from '@/types';
import { cn } from '@/lib/utils';
import { getOrdinal } from '@/lib/utils';
import Link from 'next/link';

interface LeaderboardProps {
    standings: HostelScore[];
    compact?: boolean;
    showLegBreakdown?: boolean;
}

export default function Leaderboard({
    standings,
    compact = false,
    showLegBreakdown = false
}: LeaderboardProps) {
    const maxScore = standings.length > 0 ? standings[0].totalScore : 0;

    return (
        <div className="space-y-3">
            {standings.map((item, index) => {
                const isTop3 = index < 3;
                const percentage = maxScore > 0 ? (item.totalScore / maxScore) * 100 : 0;

                const rankColors = [
                    'from-yellow-500/30 to-yellow-600/5 border-yellow-500/50',
                    'from-zinc-400/20 to-zinc-500/5 border-zinc-400/40',
                    'from-amber-700/20 to-amber-800/5 border-amber-700/40',
                ];

                return (
                    <motion.div
                        key={item.hostel.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.08 }}
                        className={cn(
                            "relative rounded-2xl overflow-hidden border transition-all duration-300",
                            compact ? "p-3" : "p-4 md:p-5",
                            isTop3
                                ? `bg-gradient-to-r ${rankColors[index]}`
                                : "bg-background-secondary border-border hover:border-border-hover"
                        )}
                    >
                        {/* Progress bar */}
                        <div
                            className="absolute inset-0 opacity-10"
                            style={{
                                background: `linear-gradient(90deg, ${item.hostel.color} 0%, transparent ${percentage}%)`,
                            }}
                        />

                        <div className="relative flex items-center gap-4">
                            {/* Rank */}
                            <div className={cn(
                                "flex-shrink-0 font-bold",
                                compact ? "text-lg w-8" : "text-2xl w-12",
                                index === 0 ? "text-yellow-500" :
                                    index === 1 ? "text-zinc-400" :
                                        index === 2 ? "text-amber-600" :
                                            "text-foreground-subtle"
                            )}>
                                {getOrdinal(item.rank)}
                            </div>

                            {/* Hostel Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <div
                                        className="w-3 h-3 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: item.hostel.color }}
                                    />
                                    <span className={cn(
                                        "font-semibold text-foreground truncate",
                                        compact ? "text-sm" : "text-base md:text-lg"
                                    )}>
                                        {item.hostel.name}
                                    </span>
                                    {index === 0 && (
                                        <span className="text-yellow-500 flex-shrink-0 ml-1">
                                            <CrownIcon className={compact ? "w-4 h-4" : "w-5 h-5"} />
                                        </span>
                                    )}
                                </div>

                                {/* Leg Breakdown */}
                                {showLegBreakdown && !compact && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {item.legScores.map((leg) => {
                                            const legColors = {
                                                Sports: 'text-sports bg-sports/10',
                                                Tech: 'text-tech bg-tech/10',
                                                Cultural: 'text-cult bg-cult/10',
                                            };
                                            const colorClass = legColors[leg.legName as keyof typeof legColors] || 'text-foreground-muted bg-background-tertiary';

                                            return (
                                                <span
                                                    key={leg.legId}
                                                    className={cn(
                                                        "text-xs px-2 py-1 rounded-lg font-medium",
                                                        colorClass
                                                    )}
                                                >
                                                    {leg.legName}: {leg.score}
                                                </span>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Total Score */}
                            <div className={cn(
                                "flex-shrink-0 text-right",
                                compact ? "" : "min-w-[80px]"
                            )}>
                                <div className={cn(
                                    "font-bold tabular-nums",
                                    compact ? "text-lg" : "text-2xl md:text-3xl",
                                    index === 0 ? "text-yellow-500" : "text-foreground"
                                )}>
                                    {item.totalScore}
                                </div>
                                <div className="text-xs text-foreground-subtle">
                                    points
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}

function CrownIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
        </svg>
    );
}
