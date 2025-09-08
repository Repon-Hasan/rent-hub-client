import dbConnect from '@/lib/dbConnect';
import { ObjectId } from 'mongodb';

export async function GET(req, context) {
    const params = await context.params;
    const { id } = params;
    let client;
    try {
        const dbConn = await dbConnect('rentPosts');
        client = dbConn.client;
        const post = await dbConn.collection.findOne({ _id: new ObjectId(id) });
        client.close();
        if (!post) return new Response('Not found', { status: 404 });
        return new Response(JSON.stringify(post), { status: 200 });
    } catch (error) {
        if (client) client.close();
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
        });
    }
}

export async function PUT(req, context) {
    const params = await context.params;
    const { id } = params;
    const data = await req.json();
    let client;
    try {
        const dbConn = await dbConnect('rentPosts');
        client = dbConn.client;
        const result = await dbConn.collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: data },
        );
        client.close();
        if (result.matchedCount === 0) {
            return new Response('Not found', { status: 404 });
        }
        return new Response('Updated successfully', { status: 200 });
    } catch (error) {
        if (client) client.close();
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
        });
    }
}

export async function DELETE(req, context) {
    const params = await context.params;
    const { id } = params;
    let client;
    try {
        const dbConn = await dbConnect('rentPosts');
        client = dbConn.client;
        const result = await dbConn.collection.deleteOne({
            _id: new ObjectId(id),
        });
        client.close();
        if (result.deletedCount === 0) {
            return new Response('Not found', { status: 404 });
        }
        return new Response('Deleted successfully', { status: 200 });
    } catch (error) {
        if (client) client.close();
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
        });
    }
}
