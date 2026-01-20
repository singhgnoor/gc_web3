import { NextRequest, NextResponse } from 'next/server';
import {
    getIndex,
    getAvailableYears,
    getGCYearData,
    saveGCYearData,
    createGCYear,
    deleteGCYearData,
    setCurrentYear
} from '@/lib/server-data';

// GET /api/admin/gc - Get all GC years or specific year data
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const year = searchParams.get('year');

        if (year) {
            const data = getGCYearData(parseInt(year));
            if (!data) {
                return NextResponse.json({ error: 'GC year not found' }, { status: 404 });
            }
            return NextResponse.json(data);
        }

        // Return index with all years
        const index = getIndex();
        return NextResponse.json(index);
    } catch (error) {
        console.error('Error reading GC data:', error);
        return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
    }
}

// POST /api/admin/gc - Create new GC year
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { year, tagline, hostels } = body;

        // Validation
        if (!year || typeof year !== 'number') {
            return NextResponse.json({ error: 'Valid year is required' }, { status: 400 });
        }

        if (!tagline || typeof tagline !== 'string') {
            return NextResponse.json({ error: 'Tagline is required' }, { status: 400 });
        }

        if (!hostels || !Array.isArray(hostels) || hostels.length === 0) {
            return NextResponse.json({ error: 'At least one hostel is required' }, { status: 400 });
        }

        // Check if year already exists
        const existingYears = getAvailableYears();
        if (existingYears.includes(year)) {
            return NextResponse.json({ error: 'GC year already exists' }, { status: 409 });
        }

        // Create new GC year
        const newGC = createGCYear(year, tagline, hostels);

        return NextResponse.json(newGC, { status: 201 });
    } catch (error) {
        console.error('Error creating GC year:', error);
        return NextResponse.json({ error: 'Failed to create GC year' }, { status: 500 });
    }
}

// PUT /api/admin/gc - Update GC year data
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { year, data, setAsCurrent } = body;

        if (!year || typeof year !== 'number') {
            return NextResponse.json({ error: 'Valid year is required' }, { status: 400 });
        }

        if (setAsCurrent) {
            setCurrentYear(year);
            return NextResponse.json({ success: true, currentYear: year });
        }

        if (!data) {
            return NextResponse.json({ error: 'Data is required' }, { status: 400 });
        }

        saveGCYearData(year, data);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating GC year:', error);
        return NextResponse.json({ error: 'Failed to update GC year' }, { status: 500 });
    }
}

// DELETE /api/admin/gc - Delete GC year
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const year = searchParams.get('year');

        if (!year) {
            return NextResponse.json({ error: 'Year is required' }, { status: 400 });
        }

        const success = deleteGCYearData(parseInt(year));

        if (!success) {
            return NextResponse.json({ error: 'GC year not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting GC year:', error);
        return NextResponse.json({ error: 'Failed to delete GC year' }, { status: 500 });
    }
}
