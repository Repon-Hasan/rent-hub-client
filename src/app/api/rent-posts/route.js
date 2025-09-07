import dbConnect from "@/lib/dbConnect";

// Simple in-memory cache
let rentPostsCache = null;
let rentPostsCacheTimestamp = 0;
const CACHE_TTL = 60 * 1000; // 1 minute

export async function GET() {
    // Serve from cache if valid
    if (rentPostsCache && Date.now() - rentPostsCacheTimestamp < CACHE_TTL) {
        return new Response(JSON.stringify(rentPostsCache), { status: 200 });
    }
    let client;
    try {
        const dbConn = await dbConnect('rentPosts');
        client = dbConn.client;
        const data = await dbConn.collection.find({}).toArray();
        client.close();
        rentPostsCache = data;
        rentPostsCacheTimestamp = Date.now();
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        if (client) client.close();
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

export async function POST(request) {
    let client;
    try {
        const dbConn = await dbConnect('rentPosts');
        client = dbConn.client;
        const reqBody = await request.json();
        const newPost = await dbConn.collection.insertOne(reqBody);
        client.close();
        // Invalidate cache
        rentPostsCache = null;
        rentPostsCacheTimestamp = 0;
        return new Response(JSON.stringify(newPost), { status: 201 });
    } catch (error) {
        if (client) client.close();
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

