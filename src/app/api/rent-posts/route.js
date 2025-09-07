import dbConnect from "@/lib/dbConnect";

export async function GET() {
    try {
        const collection = await dbConnect('rentPosts');
        const data = await collection.find({}).toArray();
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

export async function POST(request) {
    try {
        const collection = await dbConnect('rentPosts');
        const reqBody = await request.json();
        const newPost = await collection.insertOne(reqBody);
        return new Response(JSON.stringify(newPost), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

