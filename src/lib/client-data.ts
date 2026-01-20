// Client-side data loading utilities for GC Platform
// This reads from JSON files via API for dynamic data

import { GCYear, HostelScore, LeaderboardData, Leg, Event, Hostel } from '@/types';

// Cache for client-side data
let cachedData: { [year: number]: GCYear } = {};
let cachedIndex: { years: number[]; currentYear: number } | null = null;

// Fetch index data
export async function fetchIndex(): Promise<{ years: number[]; currentYear: number }> {
    const res = await fetch('/api/admin/gc', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch index');
    cachedIndex = await res.json();
    return cachedIndex!;
}

// Fetch GC data for a specific year
export async function fetchGCData(year: number): Promise<GCYear | null> {
    const res = await fetch(`/api/admin/gc?year=${year}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    cachedData[year] = data;
    return data;
}

// Get all available GC years
export async function getAvailableYearsAsync(): Promise<number[]> {
    const index = await fetchIndex();
    return index.years;
}

// Get current/latest GC year data
export async function getCurrentGCYearAsync(): Promise<GCYear | null> {
    const index = await fetchIndex();
    if (!index.currentYear) return null;
    return fetchGCData(index.currentYear);
}

// Calculate total score for a hostel across all events
export function calculateHostelTotalScore(hostelId: string, data: GCYear): number {
    let total = 0;
    for (const leg of data.legs) {
        for (const event of leg.events) {
            const score = event.scores.find(s => s.hostelId === hostelId);
            if (score) {
                total += score.points;
            }
        }
    }
    return total;
}

// Calculate score for a hostel in a specific leg
export function calculateHostelLegScore(hostelId: string, legId: string, data: GCYear): number {
    const leg = data.legs.find(l => l.id === legId);
    if (!leg) return 0;

    let total = 0;
    for (const event of leg.events) {
        const score = event.scores.find(s => s.hostelId === hostelId);
        if (score) {
            total += score.points;
        }
    }
    return total;
}

// Get full leaderboard with rankings
export function getLeaderboardFromData(data: GCYear): LeaderboardData {
    const hostelScores: HostelScore[] = data.hostels.map(hostel => {
        const legScores = data.legs.map(leg => ({
            legId: leg.id,
            legName: leg.name,
            score: calculateHostelLegScore(hostel.id, leg.id, data)
        }));

        return {
            hostel,
            totalScore: calculateHostelTotalScore(hostel.id, data),
            legScores,
            rank: 0 // Will be set after sorting
        };
    });

    // Sort by total score descending
    hostelScores.sort((a, b) => b.totalScore - a.totalScore);

    // Assign ranks
    hostelScores.forEach((score, index) => {
        score.rank = index + 1;
    });

    return {
        year: data.year,
        standings: hostelScores,
        lastUpdated: new Date().toISOString()
    };
}

// Get winner of an event
export function getEventWinner(event: Event, hostels: Hostel[]): Hostel | null {
    if (event.scores.length === 0) return null;

    const maxScore = Math.max(...event.scores.map(s => s.points));
    const winnerScore = event.scores.find(s => s.points === maxScore);

    if (!winnerScore) return null;
    return hostels.find(h => h.id === winnerScore.hostelId) || null;
}

// Get events by status
export function getEventsByStatus(status: 'upcoming' | 'ongoing' | 'completed', data: GCYear): Array<{ event: Event; leg: Leg }> {
    const results: Array<{ event: Event; leg: Leg }> = [];

    for (const leg of data.legs) {
        for (const event of leg.events) {
            if (event.status === status) {
                results.push({ event, leg });
            }
        }
    }

    return results;
}

// Get a specific leg by slug
export function getLegBySlugFromData(slug: string, data: GCYear): Leg | null {
    return data.legs.find(leg => leg.slug === slug) || null;
}

// Get hostel by ID
export function getHostelByIdFromData(hostelId: string, data: GCYear): Hostel | null {
    return data.hostels.find(hostel => hostel.id === hostelId) || null;
}
