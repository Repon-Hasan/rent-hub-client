import dbConnect from "@/lib/dbConnect";
import { NextResponse } from 'next/server';

// Simple in-memory cache
let rentPostsCache = null;
let rentPostsCacheTimestamp = 0;
const CACHE_TTL = 60 * 1000; // 1 minute

export async function GET(req) {
    let client;
    try {
        const { searchParams } = new URL(req.url);
        const searchQuery = searchParams.get('search');
        const email = searchParams.get('email');

        const dbConn = await dbConnect('rentPosts');
        client = dbConn.client;

        // Case 1: Filter by email
        if (email) {
            const posts = await dbConn.collection.find({ email }).toArray();
            return NextResponse.json(posts, { status: 200 });
        }

        // Case 2: Search query
        if (searchQuery) {
            const searchRegex = new RegExp(searchQuery, 'i');
            const query = {
                $or: [
                    { title: { $regex: searchRegex } },
                    { category: { $regex: searchRegex } },
                ],
            };
            const data = await dbConn.collection.find(query).toArray();
            return NextResponse.json(data, { status: 200 });
        }

        // Case 3: Cached data
        if (
            rentPostsCache &&
            Date.now() - rentPostsCacheTimestamp < CACHE_TTL
        ) {
            return NextResponse.json(rentPostsCache, { status: 200 });
        }

        // Case 4: Fetch all posts
        const data = await dbConn.collection.find({}).toArray();

        rentPostsCache = data;
        rentPostsCacheTimestamp = Date.now();

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        if (client) await client.close();
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
        
        // Invalidate cache when a new post is created
        rentPostsCache = null;
        rentPostsCacheTimestamp = 0;
        
        return new Response(JSON.stringify(newPost), { status: 201 });
    } catch (error) {
        if (client) client.close();
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}