import dbConnect from "@/lib/dbConnect";

export async function POST(request) {
    const { name, subcategories, imageUrl } = await request.json();

    if (!name) {
        return new Response('Category name is required', { status: 400 });
    }
    if (!Array.isArray(subcategories) || subcategories.length === 0) {
        return new Response('At least one subcategory is required', { status: 400 });
    }
    if (!imageUrl) {
        return new Response('Image URL is required', { status: 400 });
    }

    try {
        const client = await dbConnect();
        const db = client.db(process.env.DB_NAME);
        const result = await db.collection('categories').insertOne({
            name,
            subcategories,
            imageUrl,
        });
        client.close();

        return new Response(JSON.stringify(result), { status: 201 });
    } catch (error) {
        console.error('Error adding category:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}

export async function GET() {
    try {
    const categoriesCollection = await dbConnect('categories');
    const categories = await categoriesCollection.find({}).toArray();
    return new Response(JSON.stringify(categories), { status: 200 });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}