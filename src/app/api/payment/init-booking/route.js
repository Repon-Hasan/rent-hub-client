import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      email,
      name,
      phone,
      postId,
      title,
      category,
      advance,
      totalCost,
      startDate,
      endDate,
      monthDiff,
    } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const is_live = process.env.SSLCZ_IS_LIVE === "true";
    const tran_id = `txn_${Date.now()}`;

    // Connect to DB
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    // Save preliminary booking as "pending"
    const booking = {
      postId,
      itemTitle: title || "Unknown Item",  // Ensure title is not null
      category: category || "Renting",
      name,
      email,
      phone,
      startDate,
      endDate,
      totalCost,
      advance: advance > 0 ? advance : 0,
      monthDiff,
      status: "pending",
      createdAt: new Date(),
      tran_id,
    };

    await db.collection("bookings").insertOne(booking);

    // SSLCOMMERZ payment init data
    const paymentData = {
      store_id: process.env.SSLCZ_STORE_ID,
      store_passwd: process.env.SSLCZ_STORE_PASS,
      total_amount: advance > 0 ? advance : totalCost,
      currency: "BDT",
      tran_id,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/booking-success`,
      fail_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/booking-fail`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/booking-fail`,
      cus_name: name,
      cus_email: email,
      cus_add1: "Dhaka",
      cus_city: "Dhaka",
      cus_country: "Bangladesh",
      cus_phone: phone,
      product_name: title || "Unknown Item",
      product_category: category || "Renting",
      product_profile: "general",
      shipping_method: "NO",
    };

    const sslUrl = !is_live
      ? "https://sandbox.sslcommerz.com/gwprocess/v4/api.php"
      : "https://securepay.sslcommerz.com/gwprocess/v4/api.php";

    const response = await fetch(sslUrl, {
      method: "POST",
      body: new URLSearchParams(paymentData), // form-data required by SSLCOMMERZ
    });

    const text = await response.text();
    const result = JSON.parse(text);

    if (!result?.GatewayPageURL) {
      return NextResponse.json(
        { error: "Gateway URL not found", result },
        { status: 500 }
      );
    }

    return NextResponse.json({ paymentUrl: result.GatewayPageURL });
  } catch (err) {
    console.error("Init Payment Error:", err);
    return NextResponse.json({ error: "Payment init failed" }, { status: 500 });
  }
}
