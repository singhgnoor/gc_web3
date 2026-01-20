// Server-side data service for JSON file operations
import fs from 'fs';
import path from 'path';
import { GCYear } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'src', 'data', 'gc');

// Ensure data directory exists
function ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
}

// Read index file
export function getIndex(): { years: number[]; currentYear: number } {
    ensureDataDir();
    const indexPath = path.join(DATA_DIR, 'index.json');

    if (!fs.existsSync(indexPath)) {
        const defaultIndex = { years: [], currentYear: 0 };
        fs.writeFileSync(indexPath, JSON.stringify(defaultIndex, null, 2));
        return defaultIndex;
    }

    const content = fs.readFileSync(indexPath, 'utf-8');
    return JSON.parse(content);
}

// Write index file
export function saveIndex(index: { years: number[]; currentYear: number }) {
    ensureDataDir();
    const indexPath = path.join(DATA_DIR, 'index.json');
    fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
}

// Get all available years
export function getAvailableYears(): number[] {
    return getIndex().years;
}

// Get GC data for a specific year
export function getGCYearData(year: number): GCYear | null {
    ensureDataDir();
    const filePath = path.join(DATA_DIR, `${year}.json`);

    if (!fs.existsSync(filePath)) {
        // Check fallback location (old structure)
        const oldPath = path.join(process.cwd(), 'src', 'data', `gc-${year}.json`);
        if (fs.existsSync(oldPath)) {
            // Read from old location and copy to new structure
            const content = fs.readFileSync(oldPath, 'utf-8');
            const data = JSON.parse(content) as GCYear;
            // Save to new location
            fs.writeFileSync(filePath, content);
            // Update index
            const index = getIndex();
            if (!index.years.includes(year)) {
                index.years.push(year);
                index.years.sort((a, b) => b - a);
                if (!index.currentYear) index.currentYear = year;
                saveIndex(index);
            }
            return data;
        }
        return null;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as GCYear;
}

// Save GC data for a specific year
export function saveGCYearData(year: number, data: GCYear) {
    ensureDataDir();
    const filePath = path.join(DATA_DIR, `${year}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    // Update index if year doesn't exist
    const index = getIndex();
    if (!index.years.includes(year)) {
        index.years.push(year);
        index.years.sort((a, b) => b - a); // Sort descending
        saveIndex(index);
    }
}

// Delete GC year data
export function deleteGCYearData(year: number): boolean {
    ensureDataDir();
    const filePath = path.join(DATA_DIR, `${year}.json`);

    if (!fs.existsSync(filePath)) {
        return false;
    }

    fs.unlinkSync(filePath);

    // Update index
    const index = getIndex();
    index.years = index.years.filter(y => y !== year);
    if (index.currentYear === year) {
        index.currentYear = index.years[0] || 0;
    }
    saveIndex(index);

    return true;
}

// Set current year
export function setCurrentYear(year: number) {
    const index = getIndex();
    if (index.years.includes(year)) {
        index.currentYear = year;
        saveIndex(index);
        return true;
    }
    return false;
}

// Get current year data
export function getCurrentYearData(): GCYear | null {
    const index = getIndex();
    if (!index.currentYear) return null;
    return getGCYearData(index.currentYear);
}

// Create new GC year with default structure
export function createGCYear(year: number, tagline: string, hostels: { name: string; abbreviation: string; color: string }[]): GCYear {
    const newGC: GCYear = {
        year,
        tagline,
        status: 'upcoming',
        hostels: hostels.map((h, i) => ({
            id: h.name.toLowerCase().replace(/\s+/g, '-'),
            name: h.name,
            abbreviation: h.abbreviation,
            color: h.color
        })),
        legs: [
            {
                id: 'sports',
                name: 'Sports',
                slug: 'sports',
                icon: 'trophy',
                theme: {
                    primary: '#f97316',
                    secondary: '#ea580c',
                    gradient: 'from-orange-500 to-orange-600',
                    glowColor: 'rgba(249, 115, 22, 0.4)'
                },
                events: []
            },
            {
                id: 'tech',
                name: 'Tech',
                slug: 'tech',
                icon: 'cpu',
                theme: {
                    primary: '#3b82f6',
                    secondary: '#1d4ed8',
                    gradient: 'from-blue-500 to-blue-700',
                    glowColor: 'rgba(59, 130, 246, 0.4)'
                },
                events: []
            },
            {
                id: 'cult',
                name: 'Cultural',
                slug: 'cult',
                icon: 'music',
                theme: {
                    primary: '#a855f7',
                    secondary: '#7c3aed',
                    gradient: 'from-purple-500 to-violet-600',
                    glowColor: 'rgba(168, 85, 247, 0.4)'
                },
                events: []
            }
        ],
        gallery: [],
        announcements: [],
        contacts: []
    };

    saveGCYearData(year, newGC);

    // Set as current if no current year
    const index = getIndex();
    if (!index.currentYear) {
        setCurrentYear(year);
    }

    return newGC;
}
