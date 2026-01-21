'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { GCYear, Hostel, Event, Announcement, Score } from '@/types';
import * as api from '@/lib/admin-api';
import Link from 'next/link';

type Tab = 'overview' | 'events' | 'scores' | 'hostels' | 'announcements' | 'gallery' | 'contacts';

export default function AdminDashboardPage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [gcIndex, setGcIndex] = useState<{ years: number[]; currentYear: number } | null>(null);
    const [selectedYear, setSelectedYear] = useState<number>(2026);
    const [gcData, setGcData] = useState<GCYear | null>(null);
    const [loading, setLoading] = useState(true);
    const [showAddGC, setShowAddGC] = useState(false);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const index = await api.fetchGCIndex();
            setGcIndex(index);
            if (index.currentYear) {
                setSelectedYear(index.currentYear);
                const data = await api.fetchGCYear(index.currentYear);
                setGcData(data);
            }
        } catch (e) {
            console.error('Failed to load data:', e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const isAuth = localStorage.getItem('gc_admin_auth') === 'true';
        if (!isAuth) {
            router.push('/admin/login');
        } else {
            setIsAuthenticated(true);
            loadData();
        }
    }, [router, loadData]);

    const switchYear = async (year: number) => {
        setSelectedYear(year);
        const data = await api.fetchGCYear(year);
        setGcData(data);
    };

    const refreshData = async () => {
        if (selectedYear) {
            const data = await api.fetchGCYear(selectedYear);
            setGcData(data);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('gc_admin_auth');
        router.push('/admin/login');
    };

    if (!isAuthenticated || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
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
        { id: 'contacts', label: 'Contacts' },
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
                            <div className="flex items-center gap-2">
                                <select
                                    value={selectedYear}
                                    onChange={(e) => switchYear(parseInt(e.target.value))}
                                    className="text-xs bg-transparent text-foreground-muted border-none focus:outline-none cursor-pointer"
                                >
                                    {gcIndex?.years.map(y => (
                                        <option key={y} value={y} className="bg-background-secondary">GC {y}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={() => setShowAddGC(true)}
                                    className="text-xs text-cult hover:text-cult/80"
                                >
                                    + Add Year
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-sm text-foreground-muted hover:text-foreground">View Site →</Link>
                        <button onClick={handleLogout} className="px-4 py-2 rounded-lg text-sm text-foreground-muted hover:bg-background-tertiary">Logout</button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
                    {tabs.map((tab) => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
                ${activeTab === tab.id ? 'bg-cult text-white' : 'text-foreground-muted hover:text-foreground hover:bg-background-secondary'}`}>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                    {gcData && (
                        <>
                            {activeTab === 'overview' && <OverviewTab gcData={gcData} year={selectedYear} allYears={gcIndex?.years || []} onRefresh={refreshData} onDeleteGC={loadData} />}
                            {activeTab === 'events' && <EventsTab gcData={gcData} year={selectedYear} onRefresh={refreshData} />}
                            {activeTab === 'scores' && <ScoresTab gcData={gcData} year={selectedYear} onRefresh={refreshData} />}
                            {activeTab === 'hostels' && <HostelsTab gcData={gcData} year={selectedYear} onRefresh={refreshData} />}
                            {activeTab === 'announcements' && <AnnouncementsTab gcData={gcData} year={selectedYear} onRefresh={refreshData} />}
                            {activeTab === 'gallery' && <GalleryTab gcData={gcData} year={selectedYear} onRefresh={refreshData} />}
                            {activeTab === 'contacts' && <ContactsTab gcData={gcData} year={selectedYear} onRefresh={refreshData} />}
                        </>
                    )}
                </motion.div>
            </div>

            {/* Add GC Modal */}
            {showAddGC && <AddGCModal onClose={() => setShowAddGC(false)} onSuccess={() => { setShowAddGC(false); loadData(); }} existingYears={gcIndex?.years || []} />}
        </div>
    );
}

// Add GC Modal
function AddGCModal({ onClose, onSuccess, existingYears }: { onClose: () => void; onSuccess: () => void; existingYears: number[] }) {
    const [year, setYear] = useState(new Date().getFullYear() + 1);
    const [tagline, setTagline] = useState('Where Excellence Competes');
    const [hostels, setHostels] = useState([
        { name: 'Satluj', abbreviation: 'SAT', color: '#3b82f6' },
        { name: 'Beas', abbreviation: 'BEA', color: '#10b981' },
    ]);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const addHostelField = () => setHostels([...hostels, { name: '', abbreviation: '', color: '#' + Math.floor(Math.random() * 16777215).toString(16) }]);
    const removeHostel = (i: number) => setHostels(hostels.filter((_, idx) => idx !== i));
    const updateHostel = (i: number, field: string, value: string) => {
        const updated = [...hostels];
        (updated[i] as any)[field] = value;
        setHostels(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (existingYears.includes(year)) { setError('Year already exists'); return; }
        if (hostels.length < 2) { setError('At least 2 hostels required'); return; }
        if (hostels.some(h => !h.name || !h.abbreviation)) { setError('All hostel fields required'); return; }

        setSubmitting(true);
        try {
            await api.createGCYear(year, tagline, hostels);
            onSuccess();
        } catch (e: any) {
            setError(e.message);
        }
        setSubmitting(false);
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-background-secondary border border-border rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-semibold text-foreground mb-4">Create New GC Year</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-foreground-muted mb-1">Year</label>
                        <input type="number" value={year} onChange={e => setYear(parseInt(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground" />
                    </div>
                    <div>
                        <label className="block text-sm text-foreground-muted mb-1">Tagline</label>
                        <input type="text" value={tagline} onChange={e => setTagline(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground" />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm text-foreground-muted">Hostels</label>
                            <button type="button" onClick={addHostelField} className="text-xs text-cult">+ Add</button>
                        </div>
                        {hostels.map((h, i) => (
                            <div key={i} className="flex gap-2 mb-2">
                                <input placeholder="Name" value={h.name} onChange={e => updateHostel(i, 'name', e.target.value)} className="flex-1 px-2 py-1 text-sm rounded bg-background border border-border text-foreground" />
                                <input placeholder="Abbr" value={h.abbreviation} onChange={e => updateHostel(i, 'abbreviation', e.target.value)} className="w-16 px-2 py-1 text-sm rounded bg-background border border-border text-foreground" />
                                <input type="color" value={h.color} onChange={e => updateHostel(i, 'color', e.target.value)} className="w-10 h-8 rounded border-0 cursor-pointer" />
                                {hostels.length > 2 && <button type="button" onClick={() => removeHostel(i)} className="text-red-400 text-sm">×</button>}
                            </div>
                        ))}
                    </div>
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <div className="flex gap-2 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg border border-border text-foreground-muted">Cancel</button>
                        <button type="submit" disabled={submitting} className="flex-1 py-2 rounded-lg bg-cult text-white font-medium disabled:opacity-50">
                            {submitting ? 'Creating...' : 'Create GC'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Overview Tab
function OverviewTab({ gcData, year, allYears, onRefresh, onDeleteGC }: { gcData: GCYear; year: number; allYears: number[]; onRefresh: () => void; onDeleteGC: () => void }) {
    const totalEvents = gcData.legs.reduce((s, l) => s + l.events.length, 0);
    const completed = gcData.legs.reduce((s, l) => s + l.events.filter(e => e.status === 'completed').length, 0);
    const [deleting, setDeleting] = useState(false);

    const handleDeleteGC = async () => {
        const confirmed = confirm(`⚠️ DELETE GC ${year}?\n\nThis will permanently remove:\n- All events and scores\n- All announcements\n- All gallery items\n- All contacts\n\nThis action CANNOT be undone.`);
        if (!confirmed) return;

        const doubleConfirm = confirm(`Are you absolutely sure you want to delete GC ${year}? Type OK to confirm.`);
        if (!doubleConfirm) return;

        setDeleting(true);
        try {
            await api.deleteGCYear(year);
            onDeleteGC();
        } catch (e) {
            console.error('Failed to delete GC:', e);
            alert('Failed to delete GC year');
        }
        setDeleting(false);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-6 rounded-xl border border-border bg-background-secondary">
                    <div className="text-3xl font-bold text-foreground">{totalEvents}</div>
                    <div className="text-sm text-foreground-muted">Total Events</div>
                </div>
                <div className="p-6 rounded-xl border border-border bg-background-secondary">
                    <div className="text-3xl font-bold text-foreground">{completed}</div>
                    <div className="text-sm text-foreground-muted">Completed</div>
                </div>
                <div className="p-6 rounded-xl border border-border bg-background-secondary">
                    <div className="text-3xl font-bold text-foreground">{gcData.hostels.length}</div>
                    <div className="text-sm text-foreground-muted">Hostels</div>
                </div>
                <div className="p-6 rounded-xl border border-border bg-background-secondary">
                    <div className="text-3xl font-bold text-foreground">{gcData.announcements.length}</div>
                    <div className="text-sm text-foreground-muted">Announcements</div>
                </div>
            </div>
            <div className="p-4 rounded-xl border border-border bg-background-secondary">
                <h3 className="font-medium text-foreground mb-2">GC {gcData.year}</h3>
                <p className="text-sm text-foreground-muted">"{gcData.tagline}"</p>
                <p className="text-xs text-foreground-subtle mt-1 capitalize">Status: {gcData.status}</p>
            </div>

            {/* Danger Zone */}
            <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/5">
                <h3 className="font-medium text-red-400 mb-2">Danger Zone</h3>
                <p className="text-sm text-foreground-muted mb-3">
                    Permanently delete this GC year and all associated data. This action cannot be undone.
                </p>
                <button
                    onClick={handleDeleteGC}
                    disabled={deleting || allYears.length <= 1}
                    className="px-4 py-2 rounded-lg border border-red-500/50 text-red-400 text-sm hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {deleting ? 'Deleting...' : `Delete GC ${year}`}
                </button>
                {allYears.length <= 1 && (
                    <p className="text-xs text-foreground-subtle mt-2">Cannot delete the only GC year.</p>
                )}
            </div>
        </div>
    );
}

// Events Tab with full CRUD
function EventsTab({ gcData, year, onRefresh }: { gcData: GCYear; year: number; onRefresh: () => void }) {
    const [showAdd, setShowAdd] = useState(false);
    const [editEvent, setEditEvent] = useState<{ legId: string; event: Event } | null>(null);
    const [selectedLeg, setSelectedLeg] = useState(gcData.legs[0]?.id || '');
    const [form, setForm] = useState({ name: '', description: '', maxPoints: 100, rules: '' });
    const [saving, setSaving] = useState(false);

    const handleAdd = async () => {
        setSaving(true);
        try {
            await api.addEvent(year, selectedLeg, { ...form, rules: form.rules.split('\n').filter(r => r.trim()) });
            setForm({ name: '', description: '', maxPoints: 100, rules: '' });
            setShowAdd(false);
            onRefresh();
        } catch (e) { console.error(e); }
        setSaving(false);
    };

    const handleUpdate = async () => {
        if (!editEvent) return;
        setSaving(true);
        try {
            await api.updateEvent(year, editEvent.legId, editEvent.event.id, { ...form, rules: form.rules.split('\n').filter(r => r.trim()) });
            setEditEvent(null);
            onRefresh();
        } catch (e) { console.error(e); }
        setSaving(false);
    };

    const handleDelete = async (legId: string, eventId: string) => {
        if (!confirm('Delete this event?')) return;
        await api.deleteEvent(year, legId, eventId);
        onRefresh();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between">
                <h2 className="text-lg font-semibold text-foreground">Events</h2>
                <button onClick={() => setShowAdd(true)} className="px-4 py-2 rounded-lg bg-cult text-white text-sm">+ Add Event</button>
            </div>

            {gcData.legs.map(leg => (
                <div key={leg.id} className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: leg.theme.primary }}>{leg.name}</h3>
                    {leg.events.length === 0 ? (
                        <p className="text-sm text-foreground-subtle">No events yet</p>
                    ) : (
                        leg.events.map(event => (
                            <div key={event.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-background-secondary">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: leg.theme.primary }} />
                                    <span className="font-medium text-foreground">{event.name}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${event.status === 'completed' ? 'bg-foreground-muted/20 text-foreground-muted' : event.status === 'ongoing' ? 'bg-green-500/20 text-green-400' : 'bg-foreground-subtle/20 text-foreground-subtle'}`}>{event.status}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => { setEditEvent({ legId: leg.id, event }); setForm({ name: event.name, description: event.description, maxPoints: event.maxPoints, rules: event.rules.join('\n') }); }} className="px-3 py-1 text-xs text-foreground-muted hover:bg-background-tertiary rounded">Edit</button>
                                    <button onClick={() => handleDelete(leg.id, event.id)} className="px-3 py-1 text-xs text-red-400 hover:bg-red-500/10 rounded">Delete</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            ))}

            {/* Add/Edit Modal */}
            {(showAdd || editEvent) && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => { setShowAdd(false); setEditEvent(null); }}>
                    <div className="bg-background-secondary border border-border rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-semibold text-foreground mb-4">{editEvent ? 'Edit Event' : 'Add Event'}</h3>
                        <div className="space-y-3">
                            {!editEvent && (
                                <select value={selectedLeg} onChange={e => setSelectedLeg(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground">
                                    {gcData.legs.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                                </select>
                            )}
                            <input placeholder="Event Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground" />
                            <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground" />
                            <input type="number" placeholder="Max Points" value={form.maxPoints} onChange={e => setForm({ ...form, maxPoints: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground" />
                            <textarea placeholder="Rules (one per line)" value={form.rules} onChange={e => setForm({ ...form, rules: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground" />
                            <div className="flex gap-2 pt-2">
                                <button onClick={() => { setShowAdd(false); setEditEvent(null); }} className="flex-1 py-2 rounded-lg border border-border text-foreground-muted">Cancel</button>
                                <button onClick={editEvent ? handleUpdate : handleAdd} disabled={saving || !form.name} className="flex-1 py-2 rounded-lg bg-cult text-white disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Scores Tab
function ScoresTab({ gcData, year, onRefresh }: { gcData: GCYear; year: number; onRefresh: () => void }) {
    const [selected, setSelected] = useState<{ legId: string; eventId: string } | null>(null);
    const [scores, setScores] = useState<{ [hostelId: string]: number }>({});
    const [status, setStatus] = useState<string>('');
    const [saving, setSaving] = useState(false);

    const selectEvent = (legId: string, eventId: string) => {
        const leg = gcData.legs.find(l => l.id === legId);
        const event = leg?.events.find(e => e.id === eventId);
        if (event) {
            setSelected({ legId, eventId });
            setStatus(event.status);
            const scoreMap: { [id: string]: number } = {};
            gcData.hostels.forEach(h => { scoreMap[h.id] = event.scores.find(s => s.hostelId === h.id)?.points || 0; });
            setScores(scoreMap);
        }
    };

    const handleSave = async () => {
        if (!selected) return;
        setSaving(true);
        const scoreArray = Object.entries(scores).map(([hostelId, points]) => ({ hostelId, points }));
        await api.updateScores(year, selected.legId, selected.eventId, scoreArray, status);
        onRefresh();
        setSaving(false);
    };

    const selectedEvent = selected ? gcData.legs.find(l => l.id === selected.legId)?.events.find(e => e.id === selected.eventId) : null;

    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground">Score Entry</h2>
            <div className="flex flex-wrap gap-2">
                {gcData.legs.flatMap(leg => leg.events.map(e => (
                    <button key={e.id} onClick={() => selectEvent(leg.id, e.id)}
                        className={`px-3 py-2 rounded-lg text-sm border transition-colors ${selected?.eventId === e.id ? 'border-cult text-cult' : 'border-border text-foreground-muted hover:border-cult/50'}`}>
                        {e.name}
                    </button>
                )))}
            </div>

            {selectedEvent && (
                <div className="p-6 rounded-xl border border-border bg-background-secondary">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-foreground">{selectedEvent.name}</h3>
                        <select value={status} onChange={e => setStatus(e.target.value)} className="px-2 py-1 rounded bg-background border border-border text-sm text-foreground">
                            <option value="upcoming">Upcoming</option>
                            <option value="ongoing">Ongoing</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <p className="text-xs text-foreground-muted mb-4">Max Points: {selectedEvent.maxPoints}</p>
                    <div className="space-y-3">
                        {gcData.hostels.map(h => (
                            <div key={h.id} className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: h.color }} />
                                <span className="flex-1 text-foreground">{h.name}</span>
                                <input type="number" min={0} max={selectedEvent.maxPoints} value={scores[h.id] || 0}
                                    onChange={e => setScores({ ...scores, [h.id]: Math.min(selectedEvent.maxPoints, parseInt(e.target.value) || 0) })}
                                    className="w-24 px-2 py-1 rounded bg-background border border-border text-foreground text-right" />
                            </div>
                        ))}
                    </div>
                    <button onClick={handleSave} disabled={saving} className="mt-4 w-full py-2 rounded-lg bg-cult text-white disabled:opacity-50">
                        {saving ? 'Saving...' : 'Save Scores'}
                    </button>
                </div>
            )}
        </div>
    );
}

// Hostels Tab
function HostelsTab({ gcData, year, onRefresh }: { gcData: GCYear; year: number; onRefresh: () => void }) {
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState({ name: '', abbreviation: '', color: '#3b82f6' });
    const [saving, setSaving] = useState(false);

    const handleAdd = async () => {
        setSaving(true);
        await api.addHostel(year, form);
        setForm({ name: '', abbreviation: '', color: '#3b82f6' });
        setShowAdd(false);
        onRefresh();
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this hostel? All scores will be affected.')) return;
        await api.deleteHostel(year, id);
        onRefresh();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between">
                <h2 className="text-lg font-semibold text-foreground">Hostels</h2>
                <button onClick={() => setShowAdd(true)} className="px-4 py-2 rounded-lg bg-cult text-white text-sm">+ Add Hostel</button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                {gcData.hostels.map(h => (
                    <div key={h.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-background-secondary">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: h.color }}>{h.abbreviation}</div>
                            <span className="font-medium text-foreground">{h.name}</span>
                        </div>
                        <button onClick={() => handleDelete(h.id)} className="text-red-400 text-sm hover:bg-red-500/10 px-2 py-1 rounded">Delete</button>
                    </div>
                ))}
            </div>
            {showAdd && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setShowAdd(false)}>
                    <div className="bg-background-secondary border border-border rounded-2xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-semibold mb-4 text-foreground">Add Hostel</h3>
                        <div className="space-y-3">
                            <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground" />
                            <input placeholder="Abbreviation" value={form.abbreviation} onChange={e => setForm({ ...form, abbreviation: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground" />
                            <input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} className="w-full h-10 rounded cursor-pointer" />
                            <div className="flex gap-2">
                                <button onClick={() => setShowAdd(false)} className="flex-1 py-2 rounded-lg border border-border text-foreground-muted">Cancel</button>
                                <button onClick={handleAdd} disabled={saving || !form.name} className="flex-1 py-2 rounded-lg bg-cult text-white disabled:opacity-50">{saving ? 'Adding...' : 'Add'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Announcements Tab
function AnnouncementsTab({ gcData, year, onRefresh }: { gcData: GCYear; year: number; onRefresh: () => void }) {
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState({ title: '', content: '', type: 'notice' as 'notice' | 'result' | 'event', link: '' });
    const [saving, setSaving] = useState(false);

    const handleAdd = async () => {
        setSaving(true);
        await api.addAnnouncement(year, form);
        setForm({ title: '', content: '', type: 'notice', link: '' });
        setShowAdd(false);
        onRefresh();
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this announcement?')) return;
        await api.deleteAnnouncement(year, id);
        onRefresh();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between">
                <h2 className="text-lg font-semibold text-foreground">Announcements</h2>
                <button onClick={() => setShowAdd(true)} className="px-4 py-2 rounded-lg bg-cult text-white text-sm">+ Add</button>
            </div>
            <div className="space-y-3">
                {gcData.announcements.map(a => (
                    <div key={a.id} className="flex justify-between p-4 rounded-xl border border-border bg-background-secondary">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-foreground">{a.title}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${a.type === 'result' ? 'bg-yellow-500/20 text-yellow-400' : a.type === 'event' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>{a.type}</span>
                            </div>
                            <p className="text-sm text-foreground-muted">{a.content}</p>
                            <p className="text-xs text-foreground-subtle mt-1">{a.date}</p>
                        </div>
                        <button onClick={() => handleDelete(a.id)} className="text-red-400 text-sm">Delete</button>
                    </div>
                ))}
            </div>
            {showAdd && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setShowAdd(false)}>
                    <div className="bg-background-secondary border border-border rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-semibold mb-4 text-foreground">Add Announcement</h3>
                        <div className="space-y-3">
                            <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground" />
                            <textarea placeholder="Content" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground" />
                            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as any })} className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground">
                                <option value="notice">Notice</option>
                                <option value="result">Result</option>
                                <option value="event">Event</option>
                            </select>
                            <input placeholder="Link (optional)" value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground" />
                            <div className="flex gap-2">
                                <button onClick={() => setShowAdd(false)} className="flex-1 py-2 rounded-lg border border-border text-foreground-muted">Cancel</button>
                                <button onClick={handleAdd} disabled={saving || !form.title} className="flex-1 py-2 rounded-lg bg-cult text-white disabled:opacity-50">{saving ? 'Adding...' : 'Add'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Gallery Tab
function GalleryTab({ gcData, year, onRefresh }: { gcData: GCYear; year: number; onRefresh: () => void }) {
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState({ src: '', alt: '', caption: '', legId: '' });
    const [saving, setSaving] = useState(false);

    const handleAdd = async () => {
        setSaving(true);
        await api.addGalleryItem(year, form);
        setForm({ src: '', alt: '', caption: '', legId: '' });
        setShowAdd(false);
        onRefresh();
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Remove this image?')) return;
        await api.deleteGalleryItem(year, id);
        onRefresh();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between">
                <h2 className="text-lg font-semibold text-foreground">Gallery</h2>
                <button onClick={() => setShowAdd(true)} className="px-4 py-2 rounded-lg bg-cult text-white text-sm">+ Add Image</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {gcData.gallery.map(g => (
                    <div key={g.id} className="relative group rounded-xl border border-border bg-background-secondary p-2">
                        <div className="aspect-square bg-background-tertiary rounded-lg flex items-center justify-center text-foreground-subtle text-xs">{g.src || 'No image'}</div>
                        <p className="text-xs text-foreground-muted mt-1 truncate">{g.caption || g.alt}</p>
                        <button onClick={() => handleDelete(g.id)} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500/80 text-white text-xs opacity-0 group-hover:opacity-100">×</button>
                    </div>
                ))}
            </div>
            {showAdd && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setShowAdd(false)}>
                    <div className="bg-background-secondary border border-border rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-semibold mb-4 text-foreground">Add Gallery Image</h3>
                        <div className="space-y-3">
                            <input placeholder="Image Path (e.g. /gallery/photo.jpg)" value={form.src} onChange={e => setForm({ ...form, src: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground" />
                            <input placeholder="Alt Text" value={form.alt} onChange={e => setForm({ ...form, alt: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground" />
                            <input placeholder="Caption" value={form.caption} onChange={e => setForm({ ...form, caption: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground" />
                            <select value={form.legId} onChange={e => setForm({ ...form, legId: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground">
                                <option value="">No specific leg</option>
                                {gcData.legs.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                            </select>
                            <div className="flex gap-2">
                                <button onClick={() => setShowAdd(false)} className="flex-1 py-2 rounded-lg border border-border text-foreground-muted">Cancel</button>
                                <button onClick={handleAdd} disabled={saving || !form.src} className="flex-1 py-2 rounded-lg bg-cult text-white disabled:opacity-50">{saving ? 'Adding...' : 'Add'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Contacts Tab
function ContactsTab({ gcData, year, onRefresh }: { gcData: GCYear; year: number; onRefresh: () => void }) {
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState({ name: '', role: '', email: '', phone: '', legId: '' });
    const [saving, setSaving] = useState(false);

    const handleAdd = async () => {
        setSaving(true);
        await api.addContact(year, form);
        setForm({ name: '', role: '', email: '', phone: '', legId: '' });
        setShowAdd(false);
        onRefresh();
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this contact?')) return;
        await api.deleteContact(year, id);
        onRefresh();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between">
                <h2 className="text-lg font-semibold text-foreground">Contacts</h2>
                <button onClick={() => setShowAdd(true)} className="px-4 py-2 rounded-lg bg-cult text-white text-sm">+ Add Contact</button>
            </div>
            <div className="space-y-3">
                {gcData.contacts.map(c => (
                    <div key={c.id} className="flex justify-between p-4 rounded-xl border border-border bg-background-secondary">
                        <div>
                            <span className="font-medium text-foreground">{c.name}</span>
                            <p className="text-sm text-foreground-muted">{c.role}</p>
                            <p className="text-xs text-foreground-subtle">{c.email} {c.phone && `• ${c.phone}`}</p>
                        </div>
                        <button onClick={() => handleDelete(c.id)} className="text-red-400 text-sm">Delete</button>
                    </div>
                ))}
            </div>
            {showAdd && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setShowAdd(false)}>
                    <div className="bg-background-secondary border border-border rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-semibold mb-4 text-foreground">Add Contact</h3>
                        <div className="space-y-3">
                            <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground" />
                            <input placeholder="Role" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground" />
                            <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground" />
                            <input placeholder="Phone (optional)" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground" />
                            <select value={form.legId} onChange={e => setForm({ ...form, legId: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground">
                                <option value="">General (no specific leg)</option>
                                {gcData.legs.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                            </select>
                            <div className="flex gap-2">
                                <button onClick={() => setShowAdd(false)} className="flex-1 py-2 rounded-lg border border-border text-foreground-muted">Cancel</button>
                                <button onClick={handleAdd} disabled={saving || !form.name || !form.email} className="flex-1 py-2 rounded-lg bg-cult text-white disabled:opacity-50">{saving ? 'Adding...' : 'Add'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
