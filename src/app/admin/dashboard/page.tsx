'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getCurrentGCYear } from '@/lib/data';
import Link from 'next/link';

type Tab = 'overview' | 'events' | 'scores' | 'hostels' | 'announcements' | 'gallery';

export default function AdminDashboardPage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const gcData = getCurrentGCYear();

    useEffect(() => {
        // Check auth state
        const isAuth = localStorage.getItem('gc_admin_auth') === 'true';
        if (!isAuth) {
            router.push('/admin/login');
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('gc_admin_auth');
        router.push('/admin/login');
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-cult border-t-transparent rounded-full" />
            </div>
        );
    }

    const tabs: { id: Tab; label: string }[] = [
        { id: 'overview', label: 'Overview' },
        { id: 'events', label: 'Events' },
        { id: 'scores', label: 'Scores' },
        { id: 'hostels', label: 'Hostels' },
        { id: 'announcements', label: 'Announcements' },
        { id: 'gallery', label: 'Gallery' },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border bg-background-secondary sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sports via-tech to-cult flex items-center justify-center">
                            <span className="text-white font-bold">GC</span>
                        </div>
                        <div>
                            <h1 className="font-semibold text-foreground">Admin Dashboard</h1>
                            <p className="text-xs text-foreground-muted">GC {gcData.year}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="text-sm text-foreground-muted hover:text-foreground transition-colors"
                        >
                            View Site →
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-foreground-muted hover:text-foreground hover:bg-background-tertiary transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
                ${activeTab === tab.id
                                    ? 'bg-cult text-white'
                                    : 'text-foreground-muted hover:text-foreground hover:bg-background-secondary'}
              `}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'overview' && <OverviewTab gcData={gcData} />}
                    {activeTab === 'events' && <EventsTab gcData={gcData} />}
                    {activeTab === 'scores' && <ScoresTab gcData={gcData} />}
                    {activeTab === 'hostels' && <HostelsTab gcData={gcData} />}
                    {activeTab === 'announcements' && <AnnouncementsTab gcData={gcData} />}
                    {activeTab === 'gallery' && <GalleryTab />}
                </motion.div>
            </div>
        </div>
    );
}

// Overview Tab
function OverviewTab({ gcData }: { gcData: ReturnType<typeof getCurrentGCYear> }) {
    const totalEvents = gcData.legs.reduce((sum, leg) => sum + leg.events.length, 0);
    const completedEvents = gcData.legs.reduce((sum, leg) =>
        sum + leg.events.filter(e => e.status === 'completed').length, 0
    );

    return (
        <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Total Events" value={totalEvents} />
                <StatCard label="Completed" value={completedEvents} />
                <StatCard label="Hostels" value={gcData.hostels.length} />
                <StatCard label="Announcements" value={gcData.announcements.length} />
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <ActionCard
                        label="Add Event"
                        icon="+"
                        description="Create a new event"
                    />
                    <ActionCard
                        label="Update Scores"
                        icon="📊"
                        description="Enter event results"
                    />
                    <ActionCard
                        label="Post Announcement"
                        icon="📢"
                        description="Share an update"
                    />
                    <ActionCard
                        label="Upload Photos"
                        icon="📷"
                        description="Add to gallery"
                    />
                </div>
            </div>

            {/* Recent Activity */}
            <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">Recent Announcements</h2>
                <div className="space-y-3">
                    {gcData.announcements.slice(0, 3).map((announcement) => (
                        <div key={announcement.id} className="p-4 rounded-xl border border-border bg-background-secondary">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="font-medium text-foreground">{announcement.title}</h3>
                                    <p className="text-sm text-foreground-muted mt-1">{announcement.content}</p>
                                </div>
                                <span className="text-xs text-foreground-subtle">{announcement.date}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Events Tab
function EventsTab({ gcData }: { gcData: ReturnType<typeof getCurrentGCYear> }) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">All Events</h2>
                <button className="px-4 py-2 rounded-lg bg-cult text-white text-sm font-medium hover:bg-cult/90 transition-colors">
                    + Add Event
                </button>
            </div>

            {gcData.legs.map((leg) => (
                <div key={leg.id} className="space-y-4">
                    <h3
                        className="text-sm font-semibold uppercase tracking-wider"
                        style={{ color: leg.theme.primary }}
                    >
                        {leg.name}
                    </h3>
                    <div className="grid gap-3">
                        {leg.events.map((event) => (
                            <div
                                key={event.id}
                                className="flex items-center justify-between p-4 rounded-xl border border-border bg-background-secondary hover:border-border-hover transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: leg.theme.primary }}
                                    />
                                    <span className="font-medium text-foreground">{event.name}</span>
                                    <span className={`
                    text-xs px-2 py-1 rounded-full
                    ${event.status === 'completed' ? 'bg-foreground-muted/20 text-foreground-muted' :
                                            event.status === 'ongoing' ? 'bg-green-500/20 text-green-400' :
                                                'bg-foreground-subtle/20 text-foreground-subtle'}
                  `}>
                                        {event.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-foreground-muted hover:text-foreground hover:bg-background-tertiary transition-colors">
                                        Edit
                                    </button>
                                    <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-foreground-muted hover:text-foreground hover:bg-background-tertiary transition-colors">
                                        Scores
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

// Scores Tab
function ScoresTab({ gcData }: { gcData: ReturnType<typeof getCurrentGCYear> }) {
    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground">Score Management</h2>

            <div className="p-8 rounded-xl border border-dashed border-border text-center">
                <p className="text-foreground-muted mb-4">
                    Select an event to enter or update scores
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                    {gcData.legs.flatMap(leg =>
                        leg.events
                            .filter(e => e.status !== 'upcoming')
                            .map(event => (
                                <button
                                    key={event.id}
                                    className="px-3 py-2 rounded-lg text-sm font-medium border border-border hover:border-cult hover:text-cult transition-colors"
                                >
                                    {event.name}
                                </button>
                            ))
                    )}
                </div>
            </div>

            <div className="rounded-xl border border-border bg-background-secondary p-6">
                <p className="text-sm text-foreground-muted text-center">
                    Score entry interface will appear here when an event is selected.
                </p>
            </div>
        </div>
    );
}

// Hostels Tab
function HostelsTab({ gcData }: { gcData: ReturnType<typeof getCurrentGCYear> }) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Participating Hostels</h2>
                <button className="px-4 py-2 rounded-lg bg-cult text-white text-sm font-medium hover:bg-cult/90 transition-colors">
                    + Add Hostel
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {gcData.hostels.map((hostel) => (
                    <div
                        key={hostel.id}
                        className="flex items-center justify-between p-4 rounded-xl border border-border bg-background-secondary"
                    >
                        <div className="flex items-center gap-4">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white"
                                style={{ backgroundColor: hostel.color }}
                            >
                                {hostel.abbreviation}
                            </div>
                            <div>
                                <h3 className="font-medium text-foreground">{hostel.name}</h3>
                                <p className="text-xs text-foreground-muted">ID: {hostel.id}</p>
                            </div>
                        </div>
                        <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-foreground-muted hover:text-foreground hover:bg-background-tertiary transition-colors">
                            Edit
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Announcements Tab
function AnnouncementsTab({ gcData }: { gcData: ReturnType<typeof getCurrentGCYear> }) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Announcements</h2>
                <button className="px-4 py-2 rounded-lg bg-cult text-white text-sm font-medium hover:bg-cult/90 transition-colors">
                    + New Announcement
                </button>
            </div>

            <div className="space-y-3">
                {gcData.announcements.map((announcement) => (
                    <div
                        key={announcement.id}
                        className="flex items-start justify-between p-4 rounded-xl border border-border bg-background-secondary"
                    >
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium text-foreground">{announcement.title}</h3>
                                <span className={`
                  text-xs px-2 py-0.5 rounded-full capitalize
                  ${announcement.type === 'result' ? 'bg-yellow-500/20 text-yellow-400' :
                                        announcement.type === 'event' ? 'bg-green-500/20 text-green-400' :
                                            'bg-blue-500/20 text-blue-400'}
                `}>
                                    {announcement.type}
                                </span>
                            </div>
                            <p className="text-sm text-foreground-muted">{announcement.content}</p>
                            <p className="text-xs text-foreground-subtle mt-2">{announcement.date}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                            <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-foreground-muted hover:text-foreground hover:bg-background-tertiary transition-colors">
                                Edit
                            </button>
                            <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Gallery Tab
function GalleryTab() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Gallery Management</h2>
                <button className="px-4 py-2 rounded-lg bg-cult text-white text-sm font-medium hover:bg-cult/90 transition-colors">
                    + Upload Images
                </button>
            </div>

            <div className="p-12 rounded-xl border border-dashed border-border text-center">
                <div className="w-16 h-16 rounded-full bg-background-tertiary flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📷</span>
                </div>
                <h3 className="font-medium text-foreground mb-2">Upload Event Photos</h3>
                <p className="text-sm text-foreground-muted mb-4">
                    Drag and drop images here or click to browse
                </p>
                <button className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground-muted hover:text-foreground hover:bg-background-secondary transition-colors">
                    Browse Files
                </button>
            </div>
        </div>
    );
}

// Utility Components
function StatCard({ label, value }: { label: string; value: number }) {
    return (
        <div className="p-6 rounded-xl border border-border bg-background-secondary">
            <div className="text-3xl font-bold text-foreground mb-1">{value}</div>
            <div className="text-sm text-foreground-muted">{label}</div>
        </div>
    );
}

function ActionCard({ label, icon, description }: { label: string; icon: string; description: string }) {
    return (
        <button className="p-4 rounded-xl border border-border bg-background-secondary hover:border-cult/50 hover:bg-background-tertiary transition-all text-left group">
            <div className="text-2xl mb-2">{icon}</div>
            <h3 className="font-medium text-foreground group-hover:text-cult transition-colors">{label}</h3>
            <p className="text-xs text-foreground-muted mt-1">{description}</p>
        </button>
    );
}
