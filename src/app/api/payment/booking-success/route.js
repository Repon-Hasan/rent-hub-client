import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const tran_id = formData.get("tran_id");
    const status = formData.get("status"); // VALID / FAILED

    if (!tran_id)
      return NextResponse.json({ error: "Transaction ID missing" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    // Fetch pending booking
    const pendingBooking = await db.collection("bookings").findOne({
      tran_id,
      status: "pending",
      rentCount,
    });
    if (!pendingBooking)
      return NextResponse.json({ error: "Pending booking not found" }, { status: 404 });

    if (status === "VALID") {
      // Update booking status to confirmed
      await db.collection("bookings").updateOne(
        { _id: pendingBooking._id },
        { $set: { status: "confirmed", confirmedAt: new Date(), rentCount: rentCount++} }
      );
    }

    // Insert payment record
    await db.collection("payments").insertOne({
      email: pendingBooking.email,
      transactionId: tran_id,
      amount:
        pendingBooking.advance && pendingBooking.advance > 0
          ? pendingBooking.advance
          : pendingBooking.totalCost,
      status: status === "VALID" ? "success" : "failed",
      paymentType: "rent-booking",
      date: new Date(),
    });

    // Redirect user to proper page
    if (status === "VALID") {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/booking/payment-success`);
    } else {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/booking/payment-cancelled`);
    }
  } catch (err) {
    console.error("Booking Payment Success Error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
