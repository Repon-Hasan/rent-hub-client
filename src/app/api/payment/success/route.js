import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const tranId = formData.get("tran_id");
    const status = formData.get("status"); // VALID / FAILED

    if (!tranId) return NextResponse.json({ error: "Transaction ID not found" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const pending = await db.collection("payments_pending").findOne({ tran_id: tranId });
    if (!pending) return NextResponse.json({ error: "Pending payment not found" }, { status: 400 });

    const email = pending.email;

    // Update user role if payment valid
    if (status === "VALID") {
      await db.collection("users").updateOne(
        { email },
        { $set: { role: "owner" } },
        { upsert: false }
      );
    }

    // Insert into payments history
    await db.collection("payments").insertOne({
      email,
      transactionId: tranId,
      amount: pending.amount,
      status: status === "VALID" ? "success" : "failed",
      paymentType: "owner-upgrade",
      date: new Date(),
    });

    // Remove pending
    await db.collection("payments_pending").deleteOne({ tran_id: tranId });

    // Redirect
    if (status === "VALID") {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/success`);
    } else {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/fail`);
    }
  } catch (err) {
    console.error("Payment Success Error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
