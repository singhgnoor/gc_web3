// Data loading utilities for GC Platform - Server Components Only
// This file should only be imported in server components/API routes

import { GCYear, HostelScore, LeaderboardData, Leg, Event, Hostel } from '@/types';

// Dynamic imports for server-side only
let fs: typeof import('fs') | null = null;
let path: typeof import('path') | null = null;

async function initFs() {
    if (typeof window === 'undefined') {
        fs = await import('fs');
        path = await import('path');
    }
}

function getDataDir(): string {
    if (!path) throw new Error('Path module not initialized');
    return path.join(process.cwd(), 'src', 'data', 'gc');
}

// Get index - synchronous version for server
function getIndexSync(): { years: number[]; currentYear: number } {
    if (!fs || !path) {
        // Fallback for when modules aren't loaded
        return { years: [2026], currentYear: 2026 };
    }
    const indexPath = path.join(getDataDir(), 'index.json');
    if (!fs.existsSync(indexPath)) {
        return { years: [2026], currentYear: 2026 };
    }
    return JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
}

// Get all available GC years
export function getAvailableYears(): number[] {
    try {
        return getIndexSync().years;
    } catch {
        return [2026];
    }
}

// Get data for a specific GC year
export function getGCData(year: number): GCYear | null {
    if (!fs || !path) {
        // Try importing the static file as fallback
        try {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            return require(`@/data/gc-2026.json`) as GCYear;
        } catch {
            return null;
        }
    }

    const filePath = path.join(getDataDir(), `${year}.json`);
    if (!fs.existsSync(filePath)) {
        // Fallback to old location
        const oldPath = path.join(process.cwd(), 'src', 'data', `gc-${year}.json`);
        if (fs.existsSync(oldPath)) {
            return JSON.parse(fs.readFileSync(oldPath, 'utf-8')) as GCYear;
        }
        return null;
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as GCYear;
}

// Get current/latest GC year
export function getCurrentGCYear(): GCYear {
    try {
        const index = getIndexSync();
        const data = getGCData(index.currentYear);
        if (data) return data;
    } catch {
        // Fallback
    }

    // Static fallback
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('@/data/gc-2026.json') as GCYear;
}

// Initialize fs for server-side usage
if (typeof window === 'undefined') {
    initFs();
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
            rank: 0
        };
    });

    hostelScores.sort((a, b) => b.totalScore - a.totalScore);
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
