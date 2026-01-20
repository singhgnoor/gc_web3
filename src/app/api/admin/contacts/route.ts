import { NextRequest, NextResponse } from 'next/server';
import { getGCYearData, saveGCYearData } from '@/lib/server-data';
import { ContactPerson } from '@/types';

// GET /api/admin/contacts?year=2026
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

        return NextResponse.json(data.contacts);
    } catch (error) {
        console.error('Error reading contacts:', error);
        return NextResponse.json({ error: 'Failed to read contacts' }, { status: 500 });
    }
}

// POST /api/admin/contacts - Add new contact
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { year, contact } = body;

        if (!year || !contact) {
            return NextResponse.json({ error: 'Year and contact data are required' }, { status: 400 });
        }

        const data = getGCYearData(year);
        if (!data) {
            return NextResponse.json({ error: 'GC year not found' }, { status: 404 });
        }

        // Create contact with generated ID
        const newContact: ContactPerson = {
            id: `c${Date.now()}`,
            name: contact.name,
            role: contact.role,
            email: contact.email,
            phone: contact.phone,
            legId: contact.legId
        };

        data.contacts.push(newContact);
        saveGCYearData(year, data);

        return NextResponse.json(newContact, { status: 201 });
    } catch (error) {
        console.error('Error adding contact:', error);
        return NextResponse.json({ error: 'Failed to add contact' }, { status: 500 });
    }
}

// PUT /api/admin/contacts - Update contact
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { year, contactId, updates } = body;

        if (!year || !contactId || !updates) {
            return NextResponse.json({ error: 'Year, contactId, and updates are required' }, { status: 400 });
        }

        const data = getGCYearData(year);
        if (!data) {
            return NextResponse.json({ error: 'GC year not found' }, { status: 404 });
        }

        const index = data.contacts.findIndex(c => c.id === contactId);
        if (index === -1) {
            return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
        }

        data.contacts[index] = {
            ...data.contacts[index],
            ...updates
        };

        saveGCYearData(year, data);

        return NextResponse.json(data.contacts[index]);
    } catch (error) {
        console.error('Error updating contact:', error);
        return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 });
    }
}

// DELETE /api/admin/contacts
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const year = searchParams.get('year');
        const contactId = searchParams.get('contactId');

        if (!year || !contactId) {
            return NextResponse.json({ error: 'Year and contactId are required' }, { status: 400 });
        }

        const data = getGCYearData(parseInt(year));
        if (!data) {
            return NextResponse.json({ error: 'GC year not found' }, { status: 404 });
        }

        const index = data.contacts.findIndex(c => c.id === contactId);
        if (index === -1) {
            return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
        }

        data.contacts.splice(index, 1);
        saveGCYearData(parseInt(year), data);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting contact:', error);
        return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 });
    }
}
