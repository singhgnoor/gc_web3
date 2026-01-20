import { NextRequest, NextResponse } from 'next/server';
import { getGCYearData, saveGCYearData } from '@/lib/server-data';
import { Announcement } from '@/types';

// GET /api/admin/announcements?year=2026
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

        return NextResponse.json(data.announcements);
    } catch (error) {
        console.error('Error reading announcements:', error);
        return NextResponse.json({ error: 'Failed to read announcements' }, { status: 500 });
    }
}

// POST /api/admin/announcements - Add new announcement
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { year, announcement } = body;

        if (!year || !announcement) {
            return NextResponse.json({ error: 'Year and announcement data are required' }, { status: 400 });
        }

        const data = getGCYearData(year);
        if (!data) {
            return NextResponse.json({ error: 'GC year not found' }, { status: 404 });
        }

        // Create announcement with generated ID
        const newAnnouncement: Announcement = {
            id: `a${Date.now()}`,
            title: announcement.title,
            content: announcement.content,
            date: new Date().toISOString().split('T')[0],
            type: announcement.type || 'notice',
            link: announcement.link
        };

        // Add to beginning of array (newest first)
        data.announcements.unshift(newAnnouncement);
        saveGCYearData(year, data);

        return NextResponse.json(newAnnouncement, { status: 201 });
    } catch (error) {
        console.error('Error adding announcement:', error);
        return NextResponse.json({ error: 'Failed to add announcement' }, { status: 500 });
    }
}

// PUT /api/admin/announcements - Update announcement
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { year, announcementId, updates } = body;

        if (!year || !announcementId || !updates) {
            return NextResponse.json({ error: 'Year, announcementId, and updates are required' }, { status: 400 });
        }

        const data = getGCYearData(year);
        if (!data) {
            return NextResponse.json({ error: 'GC year not found' }, { status: 404 });
        }

        const index = data.announcements.findIndex(a => a.id === announcementId);
        if (index === -1) {
            return NextResponse.json({ error: 'Announcement not found' }, { status: 404 });
        }

        data.announcements[index] = {
            ...data.announcements[index],
            ...updates
        };

        saveGCYearData(year, data);

        return NextResponse.json(data.announcements[index]);
    } catch (error) {
        console.error('Error updating announcement:', error);
        return NextResponse.json({ error: 'Failed to update announcement' }, { status: 500 });
    }
}

// DELETE /api/admin/announcements
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const year = searchParams.get('year');
        const announcementId = searchParams.get('announcementId');

        if (!year || !announcementId) {
            return NextResponse.json({ error: 'Year and announcementId are required' }, { status: 400 });
        }

        const data = getGCYearData(parseInt(year));
        if (!data) {
            return NextResponse.json({ error: 'GC year not found' }, { status: 404 });
        }

        const index = data.announcements.findIndex(a => a.id === announcementId);
        if (index === -1) {
            return NextResponse.json({ error: 'Announcement not found' }, { status: 404 });
        }

        data.announcements.splice(index, 1);
        saveGCYearData(parseInt(year), data);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting announcement:', error);
        return NextResponse.json({ error: 'Failed to delete announcement' }, { status: 500 });
    }
}
