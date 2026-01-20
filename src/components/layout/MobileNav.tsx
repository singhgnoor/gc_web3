'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const navItems = [
    { href: '/', label: 'Home', icon: HomeIcon },
    { href: '/scoreboard', label: 'Scores', icon: TrophyIcon },
    { href: '/leg/sports', label: 'Sports', icon: SportsIcon },
    { href: '/leg/tech', label: 'Tech', icon: TechIcon },
    { href: '/leg/cult', label: 'Cult', icon: CultIcon },
];

export default function MobileNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-4 left-4 right-4 z-50 lg:hidden">
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="bg-background-secondary/90 backdrop-blur-xl border border-border rounded-2xl px-2 py-2 shadow-2xl"
            >
                <div className="flex items-center justify-around">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== '/' && pathname.startsWith(item.href));

                        return (
                            <Link key={item.href} href={item.href} className="relative">
                                <motion.div
                                    className={cn(
                                        "flex flex-col items-center justify-center p-2 rounded-xl min-w-[56px] transition-colors",
                                        isActive
                                            ? "text-foreground"
                                            : "text-foreground-subtle"
                                    )}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="mobile-nav-active"
                                            className="absolute inset-0 bg-gradient-to-br from-sports/20 via-tech/20 to-cult/20 rounded-xl"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.2 }}
                                        />
                                    )}
                                    <item.icon className={cn(
                                        "w-5 h-5 relative z-10 transition-colors",
                                        isActive ? "text-cult" : ""
                                    )} />
                                    <span className="text-[10px] mt-1 relative z-10 font-medium">
                                        {item.label}
                                    </span>
                                </motion.div>
                            </Link>
                        );
                    })}

                    {/* More menu button */}
                    <MoreMenu />
                </div>
            </motion.div>
        </nav>
    );
}

function MoreMenu() {
    return (
        <Link href="/about">
            <motion.div
                className="flex flex-col items-center justify-center p-2 rounded-xl min-w-[56px] text-foreground-subtle"
                whileTap={{ scale: 0.9 }}
            >
                <MoreIcon className="w-5 h-5" />
                <span className="text-[10px] mt-1 font-medium">More</span>
            </motion.div>
        </Link>
    );
}

// Icons
function HomeIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9,22 9,12 15,12 15,22" />
        </svg>
    );
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

function SportsIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
            <path d="M2 12h20" />
        </svg>
    );
}

function TechIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <rect x="9" y="9" width="6" height="6" />
            <path d="M15 2v2" />
            <path d="M15 20v2" />
            <path d="M2 15h2" />
            <path d="M2 9h2" />
            <path d="M20 15h2" />
            <path d="M20 9h2" />
            <path d="M9 2v2" />
            <path d="M9 20v2" />
        </svg>
    );
}

function CultIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="5.5" cy="17.5" r="2.5" />
            <circle cx="17.5" cy="15.5" r="2.5" />
            <path d="M8 17V5l12-2v12" />
        </svg>
    );
}

function MoreIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
        </svg>
    );
}
