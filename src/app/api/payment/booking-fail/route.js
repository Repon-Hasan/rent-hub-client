import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const tran_id = searchParams.get("tran_id");

    if (!tran_id) {
      return NextResponse.json({ error: "Missing tran_id" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    // Update pending booking/payment status to failed
    await db.collection("bookings").updateOne(
      { tran_id },
      { $set: { status: "failed", updatedAt: new Date() } }
    );

    await db.collection("payments_pending").updateOne(
      { tran_id },
      { $set: { status: "failed", updatedAt: new Date() } }
    );

    return NextResponse.json({
      message: "Payment failed or cancelled. Booking not confirmed.",
      transactionId: tran_id,
    });
  } catch (err) {
    console.error("Payment Fail Error:", err);
    return NextResponse.json({ error: "Payment fail processing failed" }, { status: 500 });
  }
}
