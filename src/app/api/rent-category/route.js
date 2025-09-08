import dbConnect from "@/lib/dbConnect";

export async function GET() {
    let client;
    try {
        const dbConn = await dbConnect('categories');
        client = dbConn.client;
        const categories = await dbConn.collection.find({}).toArray();
        client.close();
        return new Response(JSON.stringify(categories), { status: 200 });
    } catch (error) {
        if (client) client.close();
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}