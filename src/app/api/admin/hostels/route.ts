import { NextRequest, NextResponse } from 'next/server';
import { getGCYearData, saveGCYearData } from '@/lib/server-data';
import { Hostel } from '@/types';

// GET /api/admin/hostels?year=2026 - Get hostels for a year
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const year = searchParams.get('year');

        if (!year) {
            return NextResponse.json({ error: 'Year is required' }, { status: 400 });
        }

        const data = getGCYearData(parseInt(year));
        if (!data) {
            return NextResponse.json({ error: 'GC year not found' }, { status: 404 });
        }

        return NextResponse.json(data.hostels);
    } catch (error) {
        console.error('Error reading hostels:', error);
        return NextResponse.json({ error: 'Failed to read hostels' }, { status: 500 });
    }
}

// POST /api/admin/hostels - Add new hostel
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { year, hostel } = body;

        if (!year || !hostel) {
            return NextResponse.json({ error: 'Year and hostel data are required' }, { status: 400 });
        }

        const data = getGCYearData(year);
        if (!data) {
            return NextResponse.json({ error: 'GC year not found' }, { status: 404 });
        }

        // Create hostel with generated ID
        const newHostel: Hostel = {
            id: hostel.name.toLowerCase().replace(/\s+/g, '-'),
            name: hostel.name,
            abbreviation: hostel.abbreviation,
            color: hostel.color
        };

        // Check for duplicate
        if (data.hostels.find(h => h.id === newHostel.id)) {
            return NextResponse.json({ error: 'Hostel already exists' }, { status: 409 });
        }

        data.hostels.push(newHostel);
        saveGCYearData(year, data);

        return NextResponse.json(newHostel, { status: 201 });
    } catch (error) {
        console.error('Error adding hostel:', error);
        return NextResponse.json({ error: 'Failed to add hostel' }, { status: 500 });
    }
}

// PUT /api/admin/hostels - Update hostel
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { year, hostelId, updates } = body;

        if (!year || !hostelId || !updates) {
            return NextResponse.json({ error: 'Year, hostelId, and updates are required' }, { status: 400 });
        }

        const data = getGCYearData(year);
        if (!data) {
            return NextResponse.json({ error: 'GC year not found' }, { status: 404 });
        }

        const hostelIndex = data.hostels.findIndex(h => h.id === hostelId);
        if (hostelIndex === -1) {
            return NextResponse.json({ error: 'Hostel not found' }, { status: 404 });
        }

        // Update hostel
        data.hostels[hostelIndex] = {
            ...data.hostels[hostelIndex],
            ...updates
        };

        saveGCYearData(year, data);

        return NextResponse.json(data.hostels[hostelIndex]);
    } catch (error) {
        console.error('Error updating hostel:', error);
        return NextResponse.json({ error: 'Failed to update hostel' }, { status: 500 });
    }
}

// DELETE /api/admin/hostels - Delete hostel
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const year = searchParams.get('year');
        const hostelId = searchParams.get('hostelId');

        if (!year || !hostelId) {
            return NextResponse.json({ error: 'Year and hostelId are required' }, { status: 400 });
        }

        const data = getGCYearData(parseInt(year));
        if (!data) {
            return NextResponse.json({ error: 'GC year not found' }, { status: 404 });
        }

        const hostelIndex = data.hostels.findIndex(h => h.id === hostelId);
        if (hostelIndex === -1) {
            return NextResponse.json({ error: 'Hostel not found' }, { status: 404 });
        }

        data.hostels.splice(hostelIndex, 1);
        saveGCYearData(parseInt(year), data);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting hostel:', error);
        return NextResponse.json({ error: 'Failed to delete hostel' }, { status: 500 });
    }
}
