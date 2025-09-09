import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/dbConnect';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function PATCH(req) {
    // Only allow logged-in users
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { postId, action } = await req.json();
    if (!postId || !['add', 'remove'].includes(action)) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const { collection, client } = await dbConnect('users');
    try {
        const user = await collection.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        let update;
        if (action === 'add') {
            update = { $addToSet: { bookmarks: postId } };
        } else {
            update = { $pull: { bookmarks: postId } };
        }
        await collection.updateOne({ email: session.user.email }, update);
        return NextResponse.json({ message: 'Bookmark updated' }, { status: 200 });
    } finally {
        await client.close();
    }
}

export async function GET(req) {
    // session fetch
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { collection, client } = await dbConnect('users');
    try {
        const user = await collection.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        // If admin, return all users
        if (user.role === 'admin') {
            const data = await collection.find({}).toArray();
            return NextResponse.json(data, { status: 200 });
        }
        // Otherwise, return only current user's data
        return NextResponse.json(user, { status: 200 });
    } finally {
        await client.close();
    }
}


export async function DELETE(req) {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id)
        return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    const { client, collection } = await dbConnect('users');
    try {
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0)
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 },
            );
        return NextResponse.json({ message: 'User deleted successfully' });
    } finally {
        await client.close();
    }
}
