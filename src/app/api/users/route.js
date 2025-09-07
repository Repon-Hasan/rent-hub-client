import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/dbConnect';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 },
            );
        }

        const collection = await dbConnect('users');
        const users = await collection.find({}).toArray();
        const plainUsers = users.map((user) => ({
            ...user,
            _id: user._id.toString(),
            email: user.email,
            role: user.role || 'renter',
        }));

        return NextResponse.json(plainUsers);
    } catch (err) {
        console.error('Error fetching users:', err);
        return NextResponse.json(
            { error: 'Something went wrong' },
            { status: 500 },
        );
    }
}
