import { NextRequest, NextResponse } from 'next/server';
import { getGCYearData, saveGCYearData } from '@/lib/server-data';
import { Score } from '@/types';

// POST /api/admin/scores - Update scores for an event
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { year, legId, eventId, scores, status } = body;

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

        const event = data.legs[legIndex].events[eventIndex];

        // Validate scores
        if (scores && Array.isArray(scores)) {
            // Validate each score doesn't exceed max points
            for (const score of scores) {
                if (score.points > event.maxPoints) {
                    return NextResponse.json({
                        error: `Score for ${score.hostelId} (${score.points}) exceeds max points (${event.maxPoints})`
                    }, { status: 400 });
                }
                if (score.points < 0) {
                    return NextResponse.json({
                        error: `Score cannot be negative`
                    }, { status: 400 });
                }
            }

            event.scores = scores as Score[];
        }

        // Update status if provided
        if (status && ['upcoming', 'ongoing', 'completed'].includes(status)) {
            event.status = status;
        }

        data.legs[legIndex].events[eventIndex] = event;
        saveGCYearData(year, data);

        return NextResponse.json(event);
    } catch (error) {
        console.error('Error updating scores:', error);
        return NextResponse.json({ error: 'Failed to update scores' }, { status: 500 });
    }
}
