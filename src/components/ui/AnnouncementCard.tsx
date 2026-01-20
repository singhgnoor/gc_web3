'use client';

import { motion } from 'framer-motion';
import { Announcement } from '@/types';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface AnnouncementCardProps {
    announcement: Announcement;
    index?: number;
}

const typeStyles = {
    result: {
        icon: TrophyIcon,
        badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        glow: 'hover:shadow-[0_0_20px_rgba(234,179,8,0.15)]',
    },
    event: {
        icon: CalendarIcon,
        badge: 'bg-green-500/20 text-green-400 border-green-500/30',
        glow: 'hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]',
    },
    notice: {
        icon: BellIcon,
        badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        glow: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]',
    },
};

export default function AnnouncementCard({ announcement, index = 0 }: AnnouncementCardProps) {
    const style = typeStyles[announcement.type];
    const Icon = style.icon;

    const content = (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className={cn(
                "p-4 rounded-xl border border-border bg-background-secondary transition-all duration-300",
                style.glow,
                announcement.link && "cursor-pointer hover:border-border-hover"
            )}
        >
            <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={cn(
                    "p-2 rounded-lg border flex-shrink-0",
                    style.badge
                )}>
                    <Icon className="w-4 h-4" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-foreground text-sm">
                            {announcement.title}
                        </h3>
                        <span className="text-xs text-foreground-subtle flex-shrink-0">
                            {formatDate(announcement.date)}
                        </span>
                    </div>
                    <p className="text-sm text-foreground-muted line-clamp-2">
                        {announcement.content}
                    </p>
                </div>

                {/* Arrow if has link */}
                {announcement.link && (
                    <ArrowIcon className="w-4 h-4 text-foreground-subtle flex-shrink-0 mt-1" />
                )}
            </div>
        </motion.div>
    );

    if (announcement.link) {
        return <Link href={announcement.link}>{content}</Link>;
    }

    return content;
}

function TrophyIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
    );
}

function CalendarIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
    );
}

function BellIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
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
