// app/api/bookings/route.js
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME); 

    const url = new URL(req.url);
    const postId = url.searchParams.get("postId");
    const email = url.searchParams.get("email");

    let query = {};
    if (postId) query.postId = postId;
    if (email) query.email = email;

    const bookings = await db
      .collection("bookings")
      .find(query)
      .sort({ startDate: 1 })
      .toArray();

    return NextResponse.json(bookings);
  } catch (err) {
    console.error("Fetch bookings error:", err);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
