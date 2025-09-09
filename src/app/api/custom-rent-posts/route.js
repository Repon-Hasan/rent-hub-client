import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/dbConnect';

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== 'admin') {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
            });
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const search = searchParams.get('search') || '';
        const array = searchParams.get('array') === 'true';
        const limit = 10;

        const collection = await dbConnect('rentPosts');
        const query = search
            ? {
                  $or: [
                      { title: { $regex: search, $options: 'i' } },
                      { userEmail: { $regex: search, $options: 'i' } },
                  ],
              }
            : {};

        const total = await collection.countDocuments(query);
        const rentals = await collection
            .find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .toArray();

        const plainRentals = rentals.map((rental) => ({
            ...rental,
            _id: rental._id.toString(),
        }));

        if (array) {
            return new Response(JSON.stringify(plainRentals), {
                status: 200,
                headers: { 'X-Total-Pages': Math.ceil(total / limit) },
            });
        }

        return new Response(
            JSON.stringify({
                rentals: plainRentals,
                totalPages: Math.ceil(total / limit),
            }),
            { status: 200 },
        );
    } catch (error) {
        console.error('Error fetching rentals:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to fetch rentals' }),
            { status: 500 },
        );
    }
}

export async function POST(request) {
    try {
        const collection = await dbConnect('rentPosts');
        const reqBody = await request.json();
        const newPost = await collection.insertOne(reqBody);
        return new Response(JSON.stringify(newPost), { status: 201 });
    } catch (error) {
        console.error('Error creating rental:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
        });
    }
}
