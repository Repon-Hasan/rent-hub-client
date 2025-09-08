import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email)
      return NextResponse.json({ error: "Email is required" }, { status: 400 });

    const is_live = process.env.SSLCZ_IS_LIVE === "true";

    const tran_id = `txn_${Date.now()}`;
    const data = {
      store_id: process.env.SSLCZ_STORE_ID,
      store_passwd: process.env.SSLCZ_STORE_PASS,
      total_amount: 500,
      currency: "BDT",
      tran_id,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/success`,
      fail_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/fail`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/become-owner`,
      cus_name: "Customer",
      cus_email: email,
      cus_add1: "House 123, Road 45",
      cus_city: "Dhaka",
      cus_country: "Bangladesh",
      cus_phone: "01700000000",
      cus_postcode: "1320",
      product_name: "Owner Upgrade",
      product_category: "Subscription",
      product_profile: "general",
      shipping_method: "NO",
    };

    // Save pending payment
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    await db.collection("payments_pending").insertOne({
      tran_id,
      email,
      amount: 500,
      status: "pending",
      createdAt: new Date(),
    });

    const sslUrl = !is_live
      ? "https://sandbox.sslcommerz.com/gwprocess/v4/api.php"
      : "https://securepay.sslcommerz.com/gwprocess/v4/api.php";

    const response = await fetch(sslUrl, {
      method: "POST",
      body: new URLSearchParams(data), // form-data
    });

    const text = await response.text();
    console.log("SSLCommerz Response Text:", text);

    const result = JSON.parse(text);
    if (!result?.GatewayPageURL)
      return NextResponse.json(
        { error: "Gateway URL not found", result },
        { status: 500 }
      );

    return NextResponse.json({ url: result.GatewayPageURL });
  } catch (err) {
    console.error("Init Payment Error:", err);
    return NextResponse.json({ error: "Payment init failed" }, { status: 500 });
  }
}
