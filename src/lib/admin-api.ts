// Admin API hooks for data management
import { GCYear, Hostel, Event, Announcement, GalleryItem, ContactPerson, Score } from '@/types';

const API_BASE = '/api/admin';

// GC Year operations
export async function fetchGCIndex() {
    const res = await fetch(`${API_BASE}/gc`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch index');
    return res.json();
}

export async function fetchGCYear(year: number): Promise<GCYear> {
    const res = await fetch(`${API_BASE}/gc?year=${year}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch GC year');
    return res.json();
}

export async function createGCYear(year: number, tagline: string, hostels: { name: string; abbreviation: string; color: string }[]) {
    const res = await fetch(`${API_BASE}/gc`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year, tagline, hostels })
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create GC year');
    }
    return res.json();
}

export async function updateGCYear(year: number, data: GCYear) {
    const res = await fetch(`${API_BASE}/gc`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year, data })
    });
    if (!res.ok) throw new Error('Failed to update GC year');
    return res.json();
}

export async function setCurrentYear(year: number) {
    const res = await fetch(`${API_BASE}/gc`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year, setAsCurrent: true })
    });
    if (!res.ok) throw new Error('Failed to set current year');
    return res.json();
}

export async function deleteGCYear(year: number) {
    const res = await fetch(`${API_BASE}/gc?year=${year}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete GC year');
    return res.json();
}

// Hostel operations
export async function addHostel(year: number, hostel: Partial<Hostel>) {
    const res = await fetch(`${API_BASE}/hostels`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year, hostel })
    });
    if (!res.ok) throw new Error('Failed to add hostel');
    return res.json();
}

export async function updateHostel(year: number, hostelId: string, updates: Partial<Hostel>) {
    const res = await fetch(`${API_BASE}/hostels`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year, hostelId, updates })
    });
    if (!res.ok) throw new Error('Failed to update hostel');
    return res.json();
}

export async function deleteHostel(year: number, hostelId: string) {
    const res = await fetch(`${API_BASE}/hostels?year=${year}&hostelId=${hostelId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete hostel');
    return res.json();
}

// Event operations
export async function addEvent(year: number, legId: string, event: Partial<Event>) {
    const res = await fetch(`${API_BASE}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year, legId, event })
    });
    if (!res.ok) throw new Error('Failed to add event');
    return res.json();
}

export async function updateEvent(year: number, legId: string, eventId: string, updates: Partial<Event>) {
    const res = await fetch(`${API_BASE}/events`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year, legId, eventId, updates })
    });
    if (!res.ok) throw new Error('Failed to update event');
    return res.json();
}

export async function deleteEvent(year: number, legId: string, eventId: string) {
    const res = await fetch(`${API_BASE}/events?year=${year}&legId=${legId}&eventId=${eventId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete event');
    return res.json();
}

// Score operations
export async function updateScores(year: number, legId: string, eventId: string, scores: Score[], status?: string) {
    const res = await fetch(`${API_BASE}/scores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year, legId, eventId, scores, status })
    });
    if (!res.ok) throw new Error('Failed to update scores');
    return res.json();
}

// Announcement operations
export async function addAnnouncement(year: number, announcement: Partial<Announcement>) {
    const res = await fetch(`${API_BASE}/announcements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year, announcement })
    });
    if (!res.ok) throw new Error('Failed to add announcement');
    return res.json();
}

export async function updateAnnouncement(year: number, announcementId: string, updates: Partial<Announcement>) {
    const res = await fetch(`${API_BASE}/announcements`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year, announcementId, updates })
    });
    if (!res.ok) throw new Error('Failed to update announcement');
    return res.json();
}

export async function deleteAnnouncement(year: number, announcementId: string) {
    const res = await fetch(`${API_BASE}/announcements?year=${year}&announcementId=${announcementId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete announcement');
    return res.json();
}

// Gallery operations
export async function addGalleryItem(year: number, item: Partial<GalleryItem>) {
    const res = await fetch(`${API_BASE}/gallery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year, item })
    });
    if (!res.ok) throw new Error('Failed to add gallery item');
    return res.json();
}

export async function deleteGalleryItem(year: number, itemId: string) {
    const res = await fetch(`${API_BASE}/gallery?year=${year}&itemId=${itemId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete gallery item');
    return res.json();
}

// Contact operations
export async function addContact(year: number, contact: Partial<ContactPerson>) {
    const res = await fetch(`${API_BASE}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year, contact })
    });
    if (!res.ok) throw new Error('Failed to add contact');
    return res.json();
}

export async function updateContact(year: number, contactId: string, updates: Partial<ContactPerson>) {
    const res = await fetch(`${API_BASE}/contacts`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year, contactId, updates })
    });
    if (!res.ok) throw new Error('Failed to update contact');
    return res.json();
}

export async function deleteContact(year: number, contactId: string) {
    const res = await fetch(`${API_BASE}/contacts?year=${year}&contactId=${contactId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete contact');
    return res.json();
}
