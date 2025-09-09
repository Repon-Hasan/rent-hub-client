import dbConnect from '@/lib/dbConnect';
import { ObjectId } from 'mongodb';

export async function GET(req, { params }) {
    const { id } = params;
    let client;
    try {
        const { client: dbClient, collection } = await dbConnect('rentPosts');
        client = dbClient;

        const post = await collection.findOne({ _id: new ObjectId(id) });
        await client.close();

        if (!post) return new Response('Not found', { status: 404 });
        return new Response(JSON.stringify(post), { status: 200 });
    } catch (error) {
        if (client) await client.close();
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
        });
    }
}

export async function PATCH(req, { params }) {
    const { id } = params;
    let client;
    try {
        const { client: dbClient, collection } = await dbConnect('rentPosts');
        client = dbClient;
        const body = await req.json();

        // If review data is present, push to reviews and ratings
        if (body.review && body.rating && body.name && body.email && body.reviewDate) {
            const reviewObj = {
                name: body.name,
                email: body.email,
                rating: body.rating,
                description: body.review,
                date: body.reviewDate,
            };
            const result = await collection.updateOne(
                { _id: new ObjectId(id) },
                {
                    $push: {
                        reviews: reviewObj,
                        ratings: body.rating,
                    },
                }
            );
            await client.close();
            if (result.matchedCount === 0) {
                return new Response('Not found', { status: 404 });
            }
            return new Response(JSON.stringify({ message: 'Review added' }), { status: 200 });
        }

        // Fallback: status update (legacy)
        if (body.status) {
            const result = await collection.updateOne(
                { _id: new ObjectId(id) },
                { $set: { status: body.status } },
            );
            await client.close();
            if (result.matchedCount === 0) {
                return new Response('Not found', { status: 404 });
            }
            return new Response(
                JSON.stringify({ message: 'Status updated', status: body.status }),
                { status: 200 },
            );
        }

        await client.close();
        return new Response(JSON.stringify({ error: 'Invalid PATCH body' }), { status: 400 });
    } catch (error) {
        if (client) await client.close();
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
        });
    }
}

export async function PUT(req, { params }) {
    const { id } = params;
    let client;
    try {
        const { client: dbClient, collection } = await dbConnect('rentPosts');
        client = dbClient;
        const body = await req.json();
        // Remove _id from body to avoid immutable field error
        if ('_id' in body) {
            delete body._id;
        }
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: body }
        );
        await client.close();

        if (result.matchedCount === 0) {
            return new Response('Not found', { status: 404 });
        }
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        if (client) await client.close();
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
        });
    }
}


export async function DELETE(req, { params }) {
    const { id } = params;
    let client;
    try {
        const { client: dbClient, collection } = await dbConnect('rentPosts');
        client = dbClient;

        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        await client.close();

        if (result.deletedCount === 0) {
            return new Response('Not found', { status: 404 });
        }
        return new Response('Deleted successfully', { status: 200 });
    } catch (error) {
        if (client) await client.close();
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
        });
    }
}