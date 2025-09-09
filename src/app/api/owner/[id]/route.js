import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db("RentHub"); 

    const ownerId = params.id;

    const owner = await db.collection("users").findOne(
      { _id: new ObjectId(ownerId) },
      { projection: { password: 0 } }
    );

    if (!owner) {
      return Response.json({ error: "Owner not found" }, { status: 404 });
    }

    const posts = await db
      .collection("rentPosts")
      .find({ ownerId: ownerId })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    return Response.json({ owner, posts });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
