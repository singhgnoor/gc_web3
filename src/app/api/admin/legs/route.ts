import { NextRequest, NextResponse } from 'next/server';
import { getGCYearData, saveGCYearData } from '@/lib/server-data';
import { Leg } from '@/types';

// GET /api/admin/legs?year=2026
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

        return NextResponse.json(data.legs);
    } catch (error) {
        console.error('Error reading legs:', error);
        return NextResponse.json({ error: 'Failed to read legs' }, { status: 500 });
    }
}

// PUT /api/admin/legs - Update leg
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { year, legId, updates } = body;

        if (!year || !legId || !updates) {
            return NextResponse.json({ error: 'Year, legId, and updates are required' }, { status: 400 });
        }

        const data = getGCYearData(year);
        if (!data) {
            return NextResponse.json({ error: 'GC year not found' }, { status: 404 });
        }

        const index = data.legs.findIndex(l => l.id === legId);
        if (index === -1) {
            return NextResponse.json({ error: 'Leg not found' }, { status: 404 });
        }

        // Only allow updating name and theme
        if (updates.name) {
            data.legs[index].name = updates.name;
        }
        if (updates.theme) {
            data.legs[index].theme = {
                ...data.legs[index].theme,
                ...updates.theme
            };
        }

        saveGCYearData(year, data);

        return NextResponse.json(data.legs[index]);
    } catch (error) {
        console.error('Error updating leg:', error);
        return NextResponse.json({ error: 'Failed to update leg' }, { status: 500 });
    }
}
