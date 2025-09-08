import dbConnect from "@/lib/dbConnect";

// Simple in-memory cache
let rentPostsCache = null;
let rentPostsCacheTimestamp = 0;
const CACHE_TTL = 60 * 1000; // 1 minute

export async function GET(req) {
    let client;
    try {
        const { searchParams } = new URL(req.url);
        const searchQuery = searchParams.get("search");

        const dbConn = await dbConnect('rentPosts');
        client = dbConn.client;

        // Check if a search query exists in the URL
        if (searchQuery) {
            // If a search query is present, we bypass the cache
            // and perform a new, specific database query.
            const searchRegex = new RegExp(searchQuery, 'i'); // 'i' for case-insensitive
            const query = {
                $or: [
                    // Search in the 'title' and 'category' fields
                    { title: { $regex: searchRegex } }, 
                    { category: { $regex: searchRegex } }, 
                ],
            };
            const data = await dbConn.collection.find(query).toArray();
            client.close();
            return new Response(JSON.stringify(data), { status: 200 });
        }
        
        // If there is no search query, proceed with the caching logic
        if (rentPostsCache && Date.now() - rentPostsCacheTimestamp < CACHE_TTL) {
            return new Response(JSON.stringify(rentPostsCache), { status: 200 });
        }
        
        // Fetch all data from the database
        const data = await dbConn.collection.find({}).toArray();
        client.close();

        // Populate the cache with the full list
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
        
        // Invalidate cache when a new post is created
        rentPostsCache = null;
        rentPostsCacheTimestamp = 0;
        
        return new Response(JSON.stringify(newPost), { status: 201 });
    } catch (error) {
        if (client) client.close();
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}