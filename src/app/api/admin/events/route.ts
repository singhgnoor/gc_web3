import { NextRequest, NextResponse } from 'next/server';
import { getGCYearData, saveGCYearData } from '@/lib/server-data';
import { Event } from '@/types';

// GET /api/admin/events?year=2026&legId=sports - Get events for a leg
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const year = searchParams.get('year');
        const legId = searchParams.get('legId');

        if (!year) {
            return NextResponse.json({ error: 'Year is required' }, { status: 400 });
        }

        const data = getGCYearData(parseInt(year));
        if (!data) {
            return NextResponse.json({ error: 'GC year not found' }, { status: 404 });
        }

        if (legId) {
            const leg = data.legs.find(l => l.id === legId);
            if (!leg) {
                return NextResponse.json({ error: 'Leg not found' }, { status: 404 });
            }
            return NextResponse.json(leg.events);
        }

        // Return all events grouped by leg
        return NextResponse.json(data.legs.map(l => ({ legId: l.id, legName: l.name, events: l.events })));
    } catch (error) {
        console.error('Error reading events:', error);
        return NextResponse.json({ error: 'Failed to read events' }, { status: 500 });
    }
}

// POST /api/admin/events - Add new event
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { year, legId, event } = body;

        if (!year || !legId || !event) {
            return NextResponse.json({ error: 'Year, legId, and event data are required' }, { status: 400 });
        }

        const data = getGCYearData(year);
        if (!data) {
            return NextResponse.json({ error: 'GC year not found' }, { status: 404 });
        }

        const legIndex = data.legs.findIndex(l => l.id === legId);
        if (legIndex === -1) {
            return NextResponse.json({ error: 'Leg not found' }, { status: 404 });
        }

        // Create event with generated ID
        const newEvent: Event = {
            id: event.name.toLowerCase().replace(/\s+/g, '-'),
            name: event.name,
            image: event.image || '/events/default.jpg',
            description: event.description || '',
            rules: event.rules || [],
            maxPoints: event.maxPoints || 100,
            scores: [],
            status: 'upcoming'
        };

        // Check for duplicate
        if (data.legs[legIndex].events.find(e => e.id === newEvent.id)) {
            return NextResponse.json({ error: 'Event already exists in this leg' }, { status: 409 });
        }

        data.legs[legIndex].events.push(newEvent);
        saveGCYearData(year, data);

        return NextResponse.json(newEvent, { status: 201 });
    } catch (error) {
        console.error('Error adding event:', error);
        return NextResponse.json({ error: 'Failed to add event' }, { status: 500 });
    }
}

// PUT /api/admin/events - Update event
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { year, legId, eventId, updates } = body;

        if (!year || !legId || !eventId) {
            return NextResponse.json({ error: 'Year, legId, and eventId are required' }, { status: 400 });
        }

        const data = getGCYearData(year);
        if (!data) {
            return NextResponse.json({ error: 'GC year not found' }, { status: 404 });
        }

        const legIndex = data.legs.findIndex(l => l.id === legId);
        if (legIndex === -1) {
            return NextResponse.json({ error: 'Leg not found' }, { status: 404 });
        }

        const eventIndex = data.legs[legIndex].events.findIndex(e => e.id === eventId);
        if (eventIndex === -1) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        // Update event
        data.legs[legIndex].events[eventIndex] = {
            ...data.legs[legIndex].events[eventIndex],
            ...updates
        };

        saveGCYearData(year, data);

        return NextResponse.json(data.legs[legIndex].events[eventIndex]);
    } catch (error) {
        console.error('Error updating event:', error);
        return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
    }
}

// DELETE /api/admin/events - Delete event
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const year = searchParams.get('year');
        const legId = searchParams.get('legId');
        const eventId = searchParams.get('eventId');

        if (!year || !legId || !eventId) {
            return NextResponse.json({ error: 'Year, legId, and eventId are required' }, { status: 400 });
        }

        const data = getGCYearData(parseInt(year));
        if (!data) {
            return NextResponse.json({ error: 'GC year not found' }, { status: 404 });
        }

        const legIndex = data.legs.findIndex(l => l.id === legId);
        if (legIndex === -1) {
            return NextResponse.json({ error: 'Leg not found' }, { status: 404 });
        }

        const eventIndex = data.legs[legIndex].events.findIndex(e => e.id === eventId);
        if (eventIndex === -1) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        data.legs[legIndex].events.splice(eventIndex, 1);
        saveGCYearData(parseInt(year), data);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting event:', error);
        return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
    }
}
