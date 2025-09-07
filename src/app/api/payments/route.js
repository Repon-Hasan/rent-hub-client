import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  try {
    const email = req.nextUrl.searchParams.get("email"); // optional

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    let query = {};
    if (email) query.email = email;

    const payments = await db.collection("payments")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ payments });
  } catch (err) {
    console.error("Fetch Payments Error:", err);
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}
