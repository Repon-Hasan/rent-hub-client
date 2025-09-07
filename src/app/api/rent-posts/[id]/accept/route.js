
import dbConnect from '@/lib/dbConnect';

export async function POST(req, { params }) {
    try {
        const { id } = params;
        const collection = await dbConnect('rentPosts');

        const updated = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { status: 'Accepted' } },
        );

        return new Response(JSON.stringify({ success: true, updated }), {
            status: 200,
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
        });
    }
}
