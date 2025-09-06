export async function GET(){
    const client = await connectToDatabase();
    const db = client.db(process.env.DB_NAME);
    const categories = await db.collection('categories').find({}).toArray();
    client.close();
    return new Response(JSON.stringify(categories), { status: 200 });
}