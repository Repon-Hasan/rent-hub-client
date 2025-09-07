import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function GET(req, context) {
  const params = await context.params;
  const { id } = params;
  try {
  const collection = await dbConnect("rentPosts"); // Use the correct collection name for rent posts
    const post = await collection.findOne({ _id: new ObjectId(id) });
    if (!post) return new Response("Not found", { status: 404 });
    return new Response(JSON.stringify(post), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function PUT(req, context) {
  const params = await context.params;
  const { id } = params;
  const data = await req.json();
  try {
    const collection = await dbConnect("rentPosts"); // Use the correct collection name for rent posts
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: data }
    );
    if (result.matchedCount === 0) {
      return new Response("Not found", { status: 404 });
    }
    return new Response("Updated successfully", { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function DELETE(req, context) {
  const params = await context.params;
  const { id } = params;
  try {
    const collection = await dbConnect("rentPosts"); // Use the correct collection name for rent posts
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return new Response("Not found", { status: 404 });
    }
    return new Response("Deleted successfully", { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

