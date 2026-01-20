// Data loading utilities for GC Platform
import gc2026 from '@/data/gc-2026.json';
import { GCYear, HostelScore, LeaderboardData, Leg, Event, Hostel } from '@/types';

// Get all available GC years
export function getAvailableYears(): number[] {
    return [2026]; // Add more years as data files are created
}

// Get data for a specific GC year
export function getGCData(year: number): GCYear | null {
    switch (year) {
        case 2026:
            return gc2026 as GCYear;
        default:
            return null;
    }
}

// Get current/latest GC year
export function getCurrentGCYear(): GCYear {
    return gc2026 as GCYear;
}

// Get a specific leg by slug
export function getLegBySlug(slug: string, year?: number): Leg | null {
    const data = year ? getGCData(year) : getCurrentGCYear();
    if (!data) return null;
    return data.legs.find(leg => leg.slug === slug) || null;
}

// Get hostel by ID
export function getHostelById(hostelId: string, year?: number): Hostel | null {
    const data = year ? getGCData(year) : getCurrentGCYear();
    if (!data) return null;
    return data.hostels.find(hostel => hostel.id === hostelId) || null;
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
export function getLeaderboard(year?: number): LeaderboardData {
    const data = year ? getGCData(year) : getCurrentGCYear();
    if (!data) {
        return {
            year: 2026,
            standings: [],
            lastUpdated: new Date().toISOString()
        };
    }

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
export function getEventsByStatus(status: 'upcoming' | 'ongoing' | 'completed', year?: number): Array<{ event: Event; leg: Leg }> {
    const data = year ? getGCData(year) : getCurrentGCYear();
    if (!data) return [];

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
