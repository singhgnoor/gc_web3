'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { GCYear, HostelScore, LeaderboardData } from '@/types';

interface GCContextType {
    years: number[];
    currentYear: number;
    gcData: GCYear | null;
    leaderboard: LeaderboardData | null;
    loading: boolean;
    switchYear: (year: number) => void;
}

const GCContext = createContext<GCContextType | null>(null);

const STORAGE_KEY = 'gc_selected_year';

export function GCProvider({ children }: { children: ReactNode }) {
    const [years, setYears] = useState<number[]>([]);
    const [currentYear, setCurrentYear] = useState<number>(0);
    const [gcData, setGcData] = useState<GCYear | null>(null);
    const [leaderboard, setLeaderboard] = useState<LeaderboardData | null>(null);
    const [loading, setLoading] = useState(true);

    // Load initial data
    useEffect(() => {
        async function init() {
            try {
                const res = await fetch('/api/admin/gc');
                const index = await res.json();
                setYears(index.years || []);

                // Check localStorage for saved preference
                const savedYear = localStorage.getItem(STORAGE_KEY);
                const yearToLoad = savedYear && index.years.includes(parseInt(savedYear))
                    ? parseInt(savedYear)
                    : index.currentYear;

                if (yearToLoad) {
                    await loadYearData(yearToLoad);
                }
            } catch (e) {
                console.error('Failed to load GC index:', e);
            } finally {
                setLoading(false);
            }
        }
        init();
    }, []);

    const loadYearData = async (year: number) => {
        try {
            const res = await fetch(`/api/admin/gc?year=${year}`);
            if (!res.ok) return;
            const data: GCYear = await res.json();
            setGcData(data);
            setCurrentYear(year);
            setLeaderboard(calculateLeaderboard(data));
            localStorage.setItem(STORAGE_KEY, year.toString());
        } catch (e) {
            console.error('Failed to load GC data:', e);
        }
    };

    const switchYear = useCallback(async (year: number) => {
        if (year === currentYear) return;
        setLoading(true);
        await loadYearData(year);
        setLoading(false);
    }, [currentYear]);

    return (
        <GCContext.Provider value={{ years, currentYear, gcData, leaderboard, loading, switchYear }}>
            {children}
        </GCContext.Provider>
    );
}

export function useGC() {
    const ctx = useContext(GCContext);
    if (!ctx) throw new Error('useGC must be used within GCProvider');
    return ctx;
}

// Calculate leaderboard from GC data
function calculateLeaderboard(data: GCYear): LeaderboardData {
    const hostelScores: HostelScore[] = data.hostels.map(hostel => {
        let totalScore = 0;
        const legScores = data.legs.map(leg => {
            let legScore = 0;
            for (const event of leg.events) {
                const score = event.scores.find(s => s.hostelId === hostel.id);
                if (score) legScore += score.points;
            }
            totalScore += legScore;
            return { legId: leg.id, legName: leg.name, score: legScore };
        });
        return { hostel, totalScore, legScores, rank: 0 };
    });

    hostelScores.sort((a, b) => b.totalScore - a.totalScore);
    hostelScores.forEach((s, i) => { s.rank = i + 1; });

    return {
        year: data.year,
        standings: hostelScores,
        lastUpdated: new Date().toISOString()
    };
}
