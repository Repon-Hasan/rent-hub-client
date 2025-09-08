import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/dbConnect';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user?.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 },
            );
        }
        const { client, collection } = await dbConnect('users');

        const users = await collection.find({}).toArray();

        const plainUsers = users.map((user) => ({
            ...user,
            _id: user?._id?.toString(),
            email: user.email,
            role: user.role || 'renter',
        }));

        
        await client.close();

        return NextResponse.json(plainUsers);
    } catch (err) {
        console.error('Error fetching users:', err);
        return NextResponse.json(
            { error: 'Something went wrong' },
            { status: 500 },
        );
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
