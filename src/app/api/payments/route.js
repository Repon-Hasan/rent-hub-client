import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    // Get email from query parameters
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    // Build query
    const query = email ? { email } : {};

    const payments = await db
      .collection("payments")
      .find(query)
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json({ payments });
  } catch (err) {
    console.error("Fetch Payments Error:", err);
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}
