import { NextRequest, NextResponse } from 'next/server';
import { getGCYearData, saveGCYearData } from '@/lib/server-data';
import { GalleryItem } from '@/types';

// GET /api/admin/gallery?year=2026
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

        return NextResponse.json(data.gallery);
    } catch (error) {
        console.error('Error reading gallery:', error);
        return NextResponse.json({ error: 'Failed to read gallery' }, { status: 500 });
    }
}

// POST /api/admin/gallery - Add new gallery item
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { year, item } = body;

        if (!year || !item) {
            return NextResponse.json({ error: 'Year and item data are required' }, { status: 400 });
        }

        const data = getGCYearData(year);
        if (!data) {
            return NextResponse.json({ error: 'GC year not found' }, { status: 404 });
        }

        // Create gallery item with generated ID
        const newItem: GalleryItem = {
            id: `g${Date.now()}`,
            src: item.src,
            alt: item.alt || 'GC Photo',
            year: year,
            legId: item.legId,
            eventId: item.eventId,
            caption: item.caption
        };

        data.gallery.push(newItem);
        saveGCYearData(year, data);

        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        console.error('Error adding gallery item:', error);
        return NextResponse.json({ error: 'Failed to add gallery item' }, { status: 500 });
    }
}

// DELETE /api/admin/gallery
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const year = searchParams.get('year');
        const itemId = searchParams.get('itemId');

        if (!year || !itemId) {
            return NextResponse.json({ error: 'Year and itemId are required' }, { status: 400 });
        }

        const data = getGCYearData(parseInt(year));
        if (!data) {
            return NextResponse.json({ error: 'GC year not found' }, { status: 404 });
        }

        const index = data.gallery.findIndex(g => g.id === itemId);
        if (index === -1) {
            return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 });
        }

        data.gallery.splice(index, 1);
        saveGCYearData(parseInt(year), data);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting gallery item:', error);
        return NextResponse.json({ error: 'Failed to delete gallery item' }, { status: 500 });
    }
}
