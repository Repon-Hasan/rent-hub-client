import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"; 

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const ownerId = searchParams.get("ownerId");

  const client = await clientPromise;
  const db = client.db("RentHub");

  const reviews = await db
    .collection("reviews")
    .find({ ownerId })
    .sort({ createdAt: -1 })
    .toArray();

  return Response.json(reviews);
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { ownerId, rating, comment } = await req.json();

  const client = await clientPromise;
  const db = client.db("RentHub");

  const review = {
    ownerId,
    userEmail: session.user.email,
    userName: session.user.name,
    rating,
    comment,
    createdAt: new Date(),
  };

  await db.collection("reviews").insertOne(review);

  return Response.json({ message: "Review added successfully" });
}
