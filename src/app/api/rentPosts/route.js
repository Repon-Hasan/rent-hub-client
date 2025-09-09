import dbConnect from '@/lib/dbConnect';
import { NextResponse } from 'next/server';

export async function GET(req) {
    let client;
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email'); 

        const { client: dbClient, collection } = await dbConnect('rentPosts');
        client = dbClient;

        const query = email ? { email } : {};
        const posts = await collection.find(query).toArray();

        await client.close();
        return NextResponse.json(posts, { status: 200 });
    } catch (error) {
        if (client) await client.close();
        console.error('Error fetching posts:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    let client;
    try {
        const { client: dbClient, collection } = await dbConnect('rentPosts');
        client = dbClient;

        const reqBody = await req.json();
        const result = await collection.insertOne(reqBody);

        await client.close();
        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        if (client) await client.close();
        console.error('Error creating post:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
